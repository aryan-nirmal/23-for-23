import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/utils/mock_data.dart';
import '../../data/models/booking_model.dart';

class MyBookingsScreen extends StatefulWidget {
  const MyBookingsScreen({super.key});

  @override
  State<MyBookingsScreen> createState() => _MyBookingsScreenState();
}

class _MyBookingsScreenState extends State<MyBookingsScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final upcoming = MockData.bookings
        .where((b) => b.isConfirmed || b.isPending)
        .toList();
    final past = MockData.bookings
        .where((b) => b.isCompleted || b.isCancelled)
        .toList();

    return Scaffold(
      backgroundColor: AppConstants.backgroundDark,
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('My Bookings',
                      style: Theme.of(context).textTheme.headlineLarge),
                  Icon(Icons.filter_list_rounded,
                      color: AppConstants.textSecondary),
                ],
              ),
            ),
            TabBar(
              controller: _tabController,
              labelColor: AppConstants.primaryGreen,
              unselectedLabelColor: AppConstants.textMuted,
              indicatorColor: AppConstants.primaryGreen,
              tabs: [
                Tab(text: 'Upcoming (${upcoming.length})'),
                Tab(text: 'Past (${past.length})'),
              ],
            ),
            Expanded(
              child: TabBarView(
                controller: _tabController,
                children: [
                  _buildList(upcoming, isUpcoming: true),
                  _buildList(past, isUpcoming: false),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildList(List<BookingModel> bookings, {required bool isUpcoming}) {
    if (bookings.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('📅', style: TextStyle(fontSize: 60)),
            const SizedBox(height: 16),
            Text(
              isUpcoming ? 'No upcoming bookings' : 'No past bookings',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 8),
            Text(
              isUpcoming ? 'Book a turf and come back!' : 'Play your first match!',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            const SizedBox(height: 24),
            if (isUpcoming)
              ElevatedButton(
                onPressed: () => context.go('/venues'),
                child: const Text('Explore Turfs'),
              ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: bookings.length,
      itemBuilder: (context, i) => _BookingCard(booking: bookings[i], index: i),
    );
  }
}

class _BookingCard extends StatelessWidget {
  final BookingModel booking;
  final int index;

  const _BookingCard({required this.booking, required this.index});

  Color get _statusColor {
    switch (booking.status) {
      case 'confirmed':
        return AppConstants.primaryGreen;
      case 'pending':
        return AppConstants.warningAmber;
      case 'cancelled':
        return AppConstants.errorRed;
      case 'completed':
        return AppConstants.textSecondary;
      default:
        return AppConstants.textMuted;
    }
  }

  IconData get _statusIcon {
    switch (booking.status) {
      case 'confirmed':
        return Icons.check_circle_rounded;
      case 'pending':
        return Icons.schedule_rounded;
      case 'cancelled':
        return Icons.cancel_rounded;
      case 'completed':
        return Icons.done_all_rounded;
      default:
        return Icons.circle;
    }
  }

  @override
  Widget build(BuildContext context) {
    final venue = booking.venue;
    final slot = booking.slot;

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: AppConstants.surfaceCard,
        borderRadius: BorderRadius.circular(AppConstants.radiusLG),
        border: Border.all(color: AppConstants.borderColor),
      ),
      child: Column(
        children: [
          // Image header
          if (venue?.imageUrl != null)
            ClipRRect(
              borderRadius: const BorderRadius.vertical(
                top: Radius.circular(AppConstants.radiusLG),
              ),
              child: SizedBox(
                height: 100,
                width: double.infinity,
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    Image.network(
                      venue!.imageUrl!,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) =>
                          Container(color: AppConstants.surfaceDark),
                    ),
                    Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            Colors.transparent,
                            Colors.black.withOpacity(0.7)
                          ],
                        ),
                      ),
                    ),
                    Positioned(
                      top: 12,
                      right: 12,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 10, vertical: 5),
                        decoration: BoxDecoration(
                          color: _statusColor.withOpacity(0.9),
                          borderRadius: BorderRadius.circular(
                              AppConstants.radiusCircle),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(_statusIcon, size: 12, color: Colors.white),
                            const SizedBox(width: 4),
                            Text(
                              booking.status.capitalize(),
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.w700,
                                fontSize: 11,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (venue != null) ...[
                  Text(venue.name,
                      style: Theme.of(context).textTheme.titleLarge),
                  Text(venue.city,
                      style: TextStyle(
                          color: AppConstants.textSecondary, fontSize: 13)),
                  const SizedBox(height: 12),
                ],
                if (slot != null) ...[
                  Row(
                    children: [
                      _InfoChip(
                          icon: Icons.calendar_today_rounded,
                          text: _formatDate(slot.startAt)),
                      const SizedBox(width: 8),
                      _InfoChip(
                          icon: Icons.access_time_rounded,
                          text: slot.timeRangeLabel),
                    ],
                  ),
                  const SizedBox(height: 10),
                ],
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('₹${booking.totalAmount.toInt()}',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          color: AppConstants.primaryGreen,
                          fontWeight: FontWeight.w800,
                        )),
                    if (booking.isConfirmed)
                      GestureDetector(
                        onTap: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text('Cancellation feature coming soon'),
                              backgroundColor: AppConstants.surfaceCard,
                            ),
                          );
                        },
                        child: Text('Cancel',
                            style: TextStyle(
                              color: AppConstants.errorRed,
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                            )),
                      ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    )
        .animate()
        .fadeIn(delay: Duration(milliseconds: 100 * index))
        .slideY(begin: 0.05, end: 0);
  }

  String _formatDate(DateTime dt) {
    final months = [
      '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return '${dt.day} ${months[dt.month]}';
  }
}

class _InfoChip extends StatelessWidget {
  final IconData icon;
  final String text;

  const _InfoChip({required this.icon, required this.text});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: AppConstants.surfaceDark,
        borderRadius: BorderRadius.circular(AppConstants.radiusSM),
        border: Border.all(color: AppConstants.borderColor),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 12, color: AppConstants.textSecondary),
          const SizedBox(width: 4),
          Text(text,
              style: TextStyle(
                  color: AppConstants.textSecondary,
                  fontSize: 12,
                  fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }
}

extension StringExtension on String {
  String capitalize() {
    if (isEmpty) return this;
    return '${this[0].toUpperCase()}${substring(1)}';
  }
}
