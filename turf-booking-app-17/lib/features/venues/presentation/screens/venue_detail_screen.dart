import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:table_calendar/table_calendar.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/utils/mock_data.dart';
import '../../data/models/venue_model.dart';
import '../../../booking/data/models/slot_model.dart';

class VenueDetailScreen extends StatefulWidget {
  final String venueId;

  const VenueDetailScreen({super.key, required this.venueId});

  @override
  State<VenueDetailScreen> createState() => _VenueDetailScreenState();
}

class _VenueDetailScreenState extends State<VenueDetailScreen>
    with TickerProviderStateMixin {
  Venue? _venue;
  DateTime _selectedDay = DateTime.now();
  List<SlotModel> _slots = [];
  SlotModel? _selectedSlot;
  late TabController _tabController;
  int _imageIndex = 0;
  late PageController _imagePageController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _imagePageController = PageController();
    _loadVenue();
  }

  @override
  void dispose() {
    _tabController.dispose();
    _imagePageController.dispose();
    super.dispose();
  }

  void _loadVenue() {
    final venue = MockData.venues
        .firstWhere((v) => v.id == widget.venueId, orElse: () => MockData.venues.first);
    setState(() {
      _venue = venue;
      _slots = MockData.generateSlotsForVenue(venue.id, _selectedDay);
    });
  }

  void _onDaySelected(DateTime day, DateTime focusedDay) {
    setState(() {
      _selectedDay = day;
      _selectedSlot = null;
      _slots = MockData.generateSlotsForVenue(_venue!.id, day);
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_venue == null) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    return Scaffold(
      backgroundColor: AppConstants.backgroundDark,
      body: Stack(
        children: [
          CustomScrollView(
            slivers: [
              _buildImageHeader(),
              _buildVenueInfo(),
              _buildTabs(),
              _buildTabContent(),
              const SliverPadding(padding: EdgeInsets.only(bottom: 100)),
            ],
          ),
          if (_selectedSlot != null) _buildBookNowBar(),
        ],
      ),
    );
  }

  SliverAppBar _buildImageHeader() {
    return SliverAppBar(
      expandedHeight: 280,
      pinned: true,
      backgroundColor: AppConstants.backgroundDark,
      leading: GestureDetector(
        onTap: () => context.pop(),
        child: Container(
          margin: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: Colors.black.withOpacity(0.5),
            shape: BoxShape.circle,
          ),
          child: const Icon(Icons.arrow_back_ios_new_rounded,
              color: Colors.white, size: 18),
        ),
      ),
      flexibleSpace: FlexibleSpaceBar(
        background: Stack(
          children: [
            PageView.builder(
              controller: _imagePageController,
              onPageChanged: (i) => setState(() => _imageIndex = i),
              itemCount: _venue!.imageUrls.length,
              itemBuilder: (_, i) => Image.network(
                _venue!.imageUrls[i],
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => Container(
                  color: AppConstants.surfaceCard,
                  child: const Icon(Icons.sports_soccer,
                      color: AppConstants.primaryGreen, size: 60),
                ),
              ),
            ),
            // Gradient
            Positioned.fill(
              child: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [Colors.transparent, Colors.black.withOpacity(0.7)],
                    stops: const [0.5, 1.0],
                  ),
                ),
              ),
            ),
            // Image indicators
            Positioned(
              bottom: 12,
              left: 0,
              right: 0,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(
                  _venue!.imageUrls.length,
                  (i) => AnimatedContainer(
                    duration: 200.ms,
                    margin: const EdgeInsets.symmetric(horizontal: 3),
                    width: _imageIndex == i ? 20 : 6,
                    height: 6,
                    decoration: BoxDecoration(
                      color: _imageIndex == i
                          ? AppConstants.primaryGreen
                          : Colors.white.withOpacity(0.4),
                      borderRadius: BorderRadius.circular(3),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  SliverToBoxAdapter _buildVenueInfo() {
    return SliverToBoxAdapter(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(_venue!.name,
                      style: Theme.of(context).textTheme.headlineLarge),
                ),
                Row(
                  children: [
                    const Text('⭐', style: TextStyle(fontSize: 16)),
                    const SizedBox(width: 4),
                    Text(_venue!.rating.toString(),
                        style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                            color: AppConstants.warningAmber,
                            fontWeight: FontWeight.w700)),
                    Text(' (${_venue!.reviewCount})',
                        style: Theme.of(context).textTheme.bodySmall),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Icon(Icons.location_on_rounded,
                    size: 14, color: AppConstants.textSecondary),
                const SizedBox(width: 4),
                Expanded(
                  child: Text(_venue!.address,
                      style: Theme.of(context).textTheme.bodyMedium),
                ),
              ],
            ),
            const SizedBox(height: 12),
            // Sports
            Wrap(
              spacing: 8,
              children: _venue!.sportTypes.map((s) {
                return Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: AppConstants.primaryGreen.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(AppConstants.radiusCircle),
                    border: Border.all(
                        color: AppConstants.primaryGreen.withOpacity(0.4)),
                  ),
                  child: Text('${AppConstants.sportIcons[s] ?? ''} $s',
                      style: TextStyle(
                        color: AppConstants.primaryGreen,
                        fontWeight: FontWeight.w600,
                        fontSize: 12,
                      )),
                );
              }).toList(),
            ),
            const SizedBox(height: 16),
            // Price & Contact
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                  decoration: BoxDecoration(
                    gradient: AppConstants.primaryGradient,
                    borderRadius: BorderRadius.circular(AppConstants.radiusMD),
                    boxShadow: AppConstants.glowShadow,
                  ),
                  child: Text('From ₹${_venue!.basePrice.toInt()}/hr',
                      style: TextStyle(
                        color: AppConstants.backgroundDark,
                        fontWeight: FontWeight.w800,
                        fontSize: 14,
                      )),
                ),
                const SizedBox(width: 12),
                if (_venue!.phone != null)
                  GestureDetector(
                    onTap: () {},
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                      decoration: BoxDecoration(
                        color: AppConstants.surfaceCard,
                        borderRadius: BorderRadius.circular(AppConstants.radiusMD),
                        border: Border.all(color: AppConstants.borderColor),
                      ),
                      child: Row(
                        children: [
                          Icon(Icons.phone_outlined,
                              color: AppConstants.textSecondary, size: 16),
                          const SizedBox(width: 6),
                          Text('Call',
                              style: TextStyle(
                                  color: AppConstants.textSecondary, fontSize: 13)),
                        ],
                      ),
                    ),
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  SliverToBoxAdapter _buildTabs() {
    return SliverToBoxAdapter(
      child: TabBar(
        controller: _tabController,
        labelColor: AppConstants.primaryGreen,
        unselectedLabelColor: AppConstants.textMuted,
        indicatorColor: AppConstants.primaryGreen,
        indicatorWeight: 2,
        tabs: const [
          Tab(text: 'Book Slot'),
          Tab(text: 'About'),
          Tab(text: 'Amenities'),
        ],
      ),
    );
  }

  SliverToBoxAdapter _buildTabContent() {
    return SliverToBoxAdapter(
      child: SizedBox(
        height: 560,
        child: TabBarView(
          controller: _tabController,
          children: [
            _buildBookingTab(),
            _buildAboutTab(),
            _buildAmenitiesTab(),
          ],
        ),
      ),
    );
  }

  Widget _buildBookingTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Calendar
          Container(
            decoration: BoxDecoration(
              color: AppConstants.surfaceCard,
              borderRadius: BorderRadius.circular(AppConstants.radiusLG),
              border: Border.all(color: AppConstants.borderColor),
            ),
            child: TableCalendar(
              firstDay: DateTime.now(),
              lastDay: DateTime.now().add(const Duration(days: 30)),
              focusedDay: _selectedDay,
              selectedDayPredicate: (day) => isSameDay(day, _selectedDay),
              onDaySelected: _onDaySelected,
              calendarStyle: CalendarStyle(
                defaultTextStyle: TextStyle(color: AppConstants.textPrimary),
                weekendTextStyle: TextStyle(color: AppConstants.textSecondary),
                todayTextStyle: TextStyle(color: AppConstants.backgroundDark),
                todayDecoration: BoxDecoration(
                  color: AppConstants.primaryGreen.withOpacity(0.6),
                  shape: BoxShape.circle,
                ),
                selectedTextStyle: TextStyle(color: AppConstants.backgroundDark),
                selectedDecoration: BoxDecoration(
                  color: AppConstants.primaryGreen,
                  shape: BoxShape.circle,
                ),
                outsideDaysVisible: false,
              ),
              headerStyle: HeaderStyle(
                formatButtonVisible: false,
                titleCentered: true,
                titleTextStyle: TextStyle(
                  color: AppConstants.textPrimary,
                  fontWeight: FontWeight.w700,
                ),
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

          const SizedBox(height: 20),

          Text('Available Slots',
              style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 12),

          // Slots grid
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              crossAxisSpacing: 10,
              mainAxisSpacing: 10,
              childAspectRatio: 2.2,
            ),
            itemCount: _slots.length,
            itemBuilder: (context, i) {
              final slot = _slots[i];
              final isSelected = _selectedSlot?.id == slot.id;

              return GestureDetector(
                onTap: slot.isAvailable
                    ? () => setState(() {
                          _selectedSlot = isSelected ? null : slot;
                        })
                    : null,
                child: AnimatedContainer(
                  duration: 200.ms,
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: isSelected
                        ? AppConstants.primaryGreen.withOpacity(0.15)
                        : slot.isAvailable
                            ? AppConstants.surfaceCard
                            : AppConstants.backgroundDark,
                    borderRadius: BorderRadius.circular(AppConstants.radiusMD),
                    border: Border.all(
                      color: isSelected
                          ? AppConstants.primaryGreen
                          : slot.isAvailable
                              ? AppConstants.borderColor
                              : AppConstants.borderColor.withOpacity(0.3),
                      width: isSelected ? 1.5 : 1,
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        slot.timeRangeLabel,
                        style: TextStyle(
                          color: slot.isAvailable
                              ? AppConstants.textPrimary
                              : AppConstants.textMuted,
                          fontWeight: FontWeight.w600,
                          fontSize: 12,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('₹${slot.price.toInt()}',
                              style: TextStyle(
                                color: isSelected
                                    ? AppConstants.primaryGreen
                                    : slot.isAvailable
                                        ? AppConstants.primaryGreen
                                        : AppConstants.textMuted,
                                fontWeight: FontWeight.w700,
                                fontSize: 13,
                              )),
                          if (!slot.isAvailable)
                            Text(
                              slot.isBooked ? 'Booked' : 'Blocked',
                              style: TextStyle(
                                  color: AppConstants.textMuted,
                                  fontSize: 10,
                                  fontWeight: FontWeight.w500),
                            ),
                          if (isSelected)
                            Icon(Icons.check_circle_rounded,
                                color: AppConstants.primaryGreen, size: 14),
                        ],
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildAboutTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('About This Venue',
              style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 12),
          Text(_venue!.description,
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                height: 1.6,
                color: AppConstants.textSecondary,
              )),
          const SizedBox(height: 20),
          Text('Cancellation Policy', style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 8),
          _PolicyCard(
            icon: Icons.access_time_rounded,
            title: 'Free cancellation',
            subtitle: 'Cancel 24 hours before your slot for a full refund',
          ),
          const SizedBox(height: 8),
          _PolicyCard(
            icon: Icons.money_off_rounded,
            title: '50% refund',
            subtitle: 'Cancel 12–24 hours before for a 50% refund',
          ),
          const SizedBox(height: 8),
          _PolicyCard(
            icon: Icons.cancel_outlined,
            title: 'No refund',
            subtitle: 'Cancellations less than 12 hours before are non-refundable',
            isWarning: true,
          ),
        ],
      ),
    );
  }

  Widget _buildAmenitiesTab() {
    final amenities = _venue!.amenities ?? {};
    final items = [
      {'key': 'floodlights', 'label': 'Flood Lights', 'icon': Icons.lightbulb_outline},
      {'key': 'changing_rooms', 'label': 'Changing Rooms', 'icon': Icons.meeting_room_outlined},
      {'key': 'parking', 'label': 'Parking', 'icon': Icons.local_parking_rounded},
      {'key': 'cafeteria', 'label': 'Cafeteria', 'icon': Icons.coffee_rounded},
      {'key': 'water', 'label': 'Drinking Water', 'icon': Icons.water_drop_outlined},
    ];

    return GridView.builder(
      padding: const EdgeInsets.all(20),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 2.2,
      ),
      itemCount: items.length,
      itemBuilder: (context, i) {
        final item = items[i];
        final available = amenities[item['key']] == true;
        return Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            color: available
                ? AppConstants.primaryGreen.withOpacity(0.08)
                : AppConstants.surfaceCard,
            borderRadius: BorderRadius.circular(AppConstants.radiusMD),
            border: Border.all(
              color: available
                  ? AppConstants.primaryGreen.withOpacity(0.4)
                  : AppConstants.borderColor,
            ),
          ),
          child: Row(
            children: [
              Icon(item['icon'] as IconData,
                  color: available
                      ? AppConstants.primaryGreen
                      : AppConstants.textMuted,
                  size: 22),
              const SizedBox(width: 10),
              Expanded(
                child: Text(item['label'] as String,
                    style: TextStyle(
                      color: available
                          ? AppConstants.textPrimary
                          : AppConstants.textMuted,
                      fontSize: 13,
                      fontWeight: FontWeight.w500,
                    )),
              ),
              if (!available)
                Icon(Icons.close, color: AppConstants.textMuted, size: 14),
            ],
          ),
        );
      },
    );
  }

  Widget _buildBookNowBar() {
    final slot = _selectedSlot!;
    return Positioned(
      bottom: 0,
      left: 0,
      right: 0,
      child: Container(
        padding: const EdgeInsets.fromLTRB(20, 16, 20, 32),
        decoration: BoxDecoration(
          color: AppConstants.surfaceDark,
          border: Border(top: BorderSide(color: AppConstants.borderColor)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.4),
              blurRadius: 20,
              offset: const Offset(0, -8),
            ),
          ],
        ),
        child: Row(
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(slot.timeRangeLabel,
                    style: Theme.of(context).textTheme.titleMedium),
                Text('₹${slot.price.toInt()} · ${slot.durationLabel}',
                    style: TextStyle(
                      color: AppConstants.primaryGreen,
                      fontWeight: FontWeight.w700,
                      fontSize: 16,
                    )),
              ],
            ),
            const Spacer(),
            GestureDetector(
              onTap: () {
                context.push('/booking/${slot.id}', extra: {
                  'slot': slot,
                  'venue': _venue,
                });
              },
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 14),
                decoration: BoxDecoration(
                  gradient: AppConstants.primaryGradient,
                  borderRadius: BorderRadius.circular(AppConstants.radiusMD),
                  boxShadow: AppConstants.glowShadow,
                ),
                child: Text('Book Now',
                    style: TextStyle(
                      color: AppConstants.backgroundDark,
                      fontWeight: FontWeight.w800,
                      fontSize: 15,
                    )),
              ),
            ),
          ],
        ),
      ).animate().slideY(begin: 1, end: 0, duration: 300.ms, curve: Curves.easeOut),
    );
  }
}

class _PolicyCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final bool isWarning;

  const _PolicyCard({
    required this.icon,
    required this.title,
    required this.subtitle,
    this.isWarning = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: isWarning
            ? AppConstants.errorRed.withOpacity(0.08)
            : AppConstants.surfaceCard,
        borderRadius: BorderRadius.circular(AppConstants.radiusMD),
        border: Border.all(
          color: isWarning
              ? AppConstants.errorRed.withOpacity(0.3)
              : AppConstants.borderColor,
        ),
      ),
      child: Row(
        children: [
          Icon(icon,
              color: isWarning ? AppConstants.errorRed : AppConstants.primaryGreen,
              size: 20),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: Theme.of(context).textTheme.titleSmall?.copyWith(
                  color: AppConstants.textPrimary,
                )),
                Text(subtitle, style: Theme.of(context).textTheme.bodySmall),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
