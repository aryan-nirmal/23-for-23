import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:table_calendar/table_calendar.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/utils/mock_data.dart';
import '../../../booking/data/models/slot_model.dart';

class SlotManagerScreen extends StatefulWidget {
  final String venueId;
  const SlotManagerScreen({super.key, required this.venueId});

  @override
  State<SlotManagerScreen> createState() => _SlotManagerScreenState();
}

class _SlotManagerScreenState extends State<SlotManagerScreen> {
  DateTime _selectedDay = DateTime.now();
  List<SlotModel> _slots = [];

  @override
  void initState() {
    super.initState();
    _loadSlots();
  }

  void _loadSlots() {
    setState(() {
      _slots = MockData.generateSlotsForVenue(widget.venueId, _selectedDay);
    });
  }

  void _toggleSlotStatus(SlotModel slot) {
    if (slot.isBooked) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Cannot modify a booked slot'),
          backgroundColor: AppConstants.surfaceCard,
        ),
      );
      return;
    }

    setState(() {
      final index = _slots.indexWhere((s) => s.id == slot.id);
      if (index == -1) return;
      final newStatus = slot.isBlocked ? 'available' : 'blocked';
      _slots[index] = slot.copyWith(status: newStatus);
    });
  }

  @override
  Widget build(BuildContext context) {
    final venue = MockData.venues.firstWhere(
      (v) => v.id == widget.venueId,
      orElse: () => MockData.venues.first,
    );

    return Scaffold(
      backgroundColor: AppConstants.backgroundDark,
      appBar: AppBar(
        leading: GestureDetector(
          onTap: () => context.pop(),
          child: const Icon(Icons.arrow_back_ios_new_rounded),
        ),
        title: Text('Slots – ${venue.name}'),
        actions: [
          TextButton.icon(
            onPressed: _showAddSlotDialog,
            icon: Icon(Icons.add_rounded,
                color: AppConstants.primaryGreen, size: 20),
            label: Text('Add',
                style: TextStyle(color: AppConstants.primaryGreen)),
          ),
        ],
      ),
      body: Column(
        children: [
          // Calendar
          Container(
            color: AppConstants.surfaceDark,
            child: TableCalendar(
              firstDay: DateTime.now().subtract(const Duration(days: 7)),
              lastDay: DateTime.now().add(const Duration(days: 60)),
              focusedDay: _selectedDay,
              selectedDayPredicate: (d) => isSameDay(d, _selectedDay),
              onDaySelected: (day, _) {
                setState(() => _selectedDay = day);
                _loadSlots();
              },
              calendarFormat: CalendarFormat.week,
              calendarStyle: CalendarStyle(
                defaultTextStyle: TextStyle(color: AppConstants.textPrimary),
                weekendTextStyle: TextStyle(color: AppConstants.textSecondary),
                todayDecoration: BoxDecoration(
                  color: AppConstants.primaryGreen.withOpacity(0.4),
                  shape: BoxShape.circle,
                ),
                selectedDecoration: BoxDecoration(
                  color: AppConstants.primaryGreen,
                  shape: BoxShape.circle,
                ),
                selectedTextStyle: TextStyle(color: AppConstants.backgroundDark),
                outsideDaysVisible: false,
              ),
              headerStyle: HeaderStyle(
                formatButtonVisible: false,
                titleCentered: true,
                titleTextStyle: TextStyle(
                    color: AppConstants.textPrimary, fontWeight: FontWeight.w700),
                leftChevronIcon: Icon(Icons.chevron_left,
                    color: AppConstants.textSecondary),
                rightChevronIcon: Icon(Icons.chevron_right,
                    color: AppConstants.textSecondary),
              ),
              daysOfWeekStyle: DaysOfWeekStyle(
                weekdayStyle: TextStyle(
                    color: AppConstants.textMuted, fontSize: 12),
                weekendStyle: TextStyle(
                    color: AppConstants.textMuted, fontSize: 12),
              ),
            ),
          ),

          // Legend
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            child: Row(
              children: [
                _LegendDot(color: AppConstants.primaryGreen, label: 'Available'),
                const SizedBox(width: 16),
                _LegendDot(color: AppConstants.errorRed, label: 'Booked'),
                const SizedBox(width: 16),
                _LegendDot(color: AppConstants.textMuted, label: 'Blocked'),
                const Spacer(),
                Text('${_slots.where((s) => s.isAvailable).length} available',
                    style: TextStyle(
                        color: AppConstants.primaryGreen,
                        fontSize: 12,
                        fontWeight: FontWeight.w600)),
              ],
            ),
          ),

          // Slots grid
          Expanded(
            child: GridView.builder(
              padding: const EdgeInsets.all(16),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 10,
                mainAxisSpacing: 10,
                childAspectRatio: 1.8,
              ),
              itemCount: _slots.length,
              itemBuilder: (context, i) {
                final slot = _slots[i];
                return _SlotTile(slot: slot, onTap: () => _toggleSlotStatus(slot))
                    .animate()
                    .fadeIn(delay: Duration(milliseconds: 50 * i));
              },
            ),
          ),
        ],
      ),
    );
  }

  void _showAddSlotDialog() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppConstants.surfaceDark,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => Padding(
        padding: EdgeInsets.only(
          left: 24,
          right: 24,
          top: 24,
          bottom: MediaQuery.of(context).viewInsets.bottom + 24,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: AppConstants.borderColor,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 20),
            Text('Add Slot', style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 20),
            Text('Coming soon in the next release!',
                style: Theme.of(context).textTheme.bodyMedium),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => context.pop(),
                child: const Text('Close'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SlotTile extends StatelessWidget {
  final SlotModel slot;
  final VoidCallback onTap;

  const _SlotTile({required this.slot, required this.onTap});

  Color get _bgColor {
    if (slot.isBooked) return AppConstants.errorRed.withOpacity(0.08);
    if (slot.isBlocked) return AppConstants.surfaceDark;
    return AppConstants.primaryGreen.withOpacity(0.08);
  }

  Color get _borderColor {
    if (slot.isBooked) return AppConstants.errorRed.withOpacity(0.4);
    if (slot.isBlocked) return AppConstants.borderColor;
    return AppConstants.primaryGreen.withOpacity(0.4);
  }

  Color get _textColor {
    if (slot.isBooked) return AppConstants.errorRed;
    if (slot.isBlocked) return AppConstants.textMuted;
    return AppConstants.primaryGreen;
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: 200.ms,
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: _bgColor,
          borderRadius: BorderRadius.circular(AppConstants.radiusMD),
          border: Border.all(color: _borderColor),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(slot.timeRangeLabel,
                style: TextStyle(
                  color: AppConstants.textPrimary,
                  fontWeight: FontWeight.w600,
                  fontSize: 12,
                )),
            const SizedBox(height: 4),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('₹${slot.price.toInt()}',
                    style: TextStyle(
                      color: _textColor,
                      fontWeight: FontWeight.w700,
                      fontSize: 14,
                    )),
                Text(
                  slot.isBooked
                      ? '🔴 Booked'
                      : slot.isBlocked
                          ? '⛔ Blocked'
                          : '✅ Open',
                  style: TextStyle(fontSize: 10),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _LegendDot extends StatelessWidget {
  final Color color;
  final String label;

  const _LegendDot({required this.color, required this.label});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 10,
          height: 10,
          decoration: BoxDecoration(color: color, shape: BoxShape.circle),
        ),
        const SizedBox(width: 4),
        Text(label, style: TextStyle(color: AppConstants.textSecondary, fontSize: 11)),
      ],
    );
  }
}
