import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/utils/mock_data.dart';

class OwnerDashboardScreen extends StatelessWidget {
  const OwnerDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final ownerVenues = MockData.venues.where((v) => v.ownerId == 'owner-001').toList();
    final now = DateTime.now();

    return Scaffold(
      backgroundColor: AppConstants.backgroundDark,
      body: CustomScrollView(
        slivers: [
          _buildHeader(context),
          SliverPadding(
            padding: const EdgeInsets.all(20),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                // Stats row
                _buildStatsRow(context),
                const SizedBox(height: 24),

                // Quick actions
                Text('Quick Actions',
                    style: Theme.of(context).textTheme.headlineSmall),
                const SizedBox(height: 12),
                _buildQuickActions(context),
                const SizedBox(height: 24),

                // My venues
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('My Venues',
                        style: Theme.of(context).textTheme.headlineSmall),
                    TextButton.icon(
                      onPressed: () {},
                      icon: const Icon(Icons.add_rounded, size: 18),
                      label: const Text('Add'),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                ...ownerVenues.asMap().entries.map(
                      (e) => _OwnerVenueCard(
                    venue: e.value,
                    index: e.key,
                  ).animate().fadeIn(
                    delay: Duration(milliseconds: 100 * e.key),
                  ),
                ),

                const SizedBox(height: 24),

                // Today's bookings
                Text('Today\'s Bookings',
                    style: Theme.of(context).textTheme.headlineSmall),
                const SizedBox(height: 12),
                _buildTodaysBookings(context),

                const SizedBox(height: 40),

                // Switch to player view
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppConstants.surfaceCard,
                    borderRadius: BorderRadius.circular(AppConstants.radiusLG),
                    border: Border.all(color: AppConstants.borderColor),
                  ),
                  child: Row(
                    children: [
                      Icon(Icons.swap_horiz_rounded,
                          color: AppConstants.textSecondary),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text('Switch to Player View',
                            style: Theme.of(context).textTheme.titleMedium),
                      ),
                      TextButton(
                        onPressed: () => context.go('/home'),
                        child: const Text('Switch'),
                      ),
                    ],
                  ),
                ),
              ]),
            ),
          ),
        ],
      ),
    );
  }

  SliverAppBar _buildHeader(BuildContext context) {
    return SliverAppBar(
      expandedHeight: 0,
      floating: true,
      backgroundColor: AppConstants.backgroundDark,
      pinned: true,
      leading: GestureDetector(
        onTap: () => context.go('/home'),
        child: const Icon(Icons.arrow_back_ios_new_rounded),
      ),
      title: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(
              gradient: AppConstants.turfGradient,
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(Icons.manage_accounts_rounded,
                color: AppConstants.primaryGreen, size: 20),
          ),
          const SizedBox(width: 8),
          const Text('Owner Dashboard'),
        ],
      ),
      actions: [
        IconButton(
          onPressed: () {},
          icon: const Icon(Icons.notifications_outlined),
        ),
      ],
    );
  }

  Widget _buildStatsRow(BuildContext context) {
    final stats = [
      _StatData(label: 'Venues', value: '2', icon: Icons.store_rounded,
          color: AppConstants.primaryGreen),
      _StatData(label: 'Today\'s\nBookings', value: '5', icon: Icons.calendar_today_rounded,
          color: AppConstants.accentGreen),
      _StatData(label: 'Revenue\nThis Month', value: '₹42k', icon: Icons.currency_rupee_rounded,
          color: AppConstants.warningAmber),
      _StatData(label: 'Avg Rating', value: '4.7⭐', icon: Icons.star_rounded,
          color: AppConstants.warningAmber),
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 1.6,
      ),
      itemCount: stats.length,
      itemBuilder: (context, i) {
        final stat = stats[i];
        return Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: stat.color.withOpacity(0.08),
            borderRadius: BorderRadius.circular(AppConstants.radiusLG),
            border: Border.all(color: stat.color.withOpacity(0.3)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Icon(stat.icon, color: stat.color, size: 22),
              const Spacer(),
              Text(stat.value,
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                    fontWeight: FontWeight.w800,
                    color: stat.color,
                  )),
              Text(stat.label,
                  style: TextStyle(
                      color: AppConstants.textSecondary, fontSize: 11)),
            ],
          ),
        ).animate().fadeIn(delay: Duration(milliseconds: 100 * i));
      },
    );
  }

  Widget _buildQuickActions(BuildContext context) {
    final actions = [
      _ActionData('Manage Slots', Icons.grid_view_rounded,
          () => context.push('/owner/slots/venue-001')),
      _ActionData('View Venue', Icons.visibility_rounded,
          () => context.push('/venue/venue-001')),
      _ActionData('Analytics', Icons.bar_chart_rounded, () {}),
      _ActionData('Settings', Icons.settings_outlined, () {}),
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 4,
        crossAxisSpacing: 10,
        mainAxisSpacing: 10,
        childAspectRatio: 0.85,
      ),
      itemCount: actions.length,
      itemBuilder: (context, i) {
        final action = actions[i];
        return GestureDetector(
          onTap: action.onTap,
          child: Column(
            children: [
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppConstants.surfaceCard,
                  borderRadius: BorderRadius.circular(AppConstants.radiusMD),
                  border: Border.all(color: AppConstants.borderColor),
                ),
                child: Icon(action.icon,
                    color: AppConstants.primaryGreen, size: 22),
              ),
              const SizedBox(height: 6),
              Text(action.label,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                      color: AppConstants.textSecondary, fontSize: 11)),
            ],
          ),
        ).animate().fadeIn(delay: Duration(milliseconds: 80 * i));
      },
    );
  }

  Widget _buildTodaysBookings(BuildContext context) {
    final mock = [
      {'name': 'Rohan Mehta', 'time': '7:00–8:00 PM', 'sport': '⚽ Football', 'amount': '₹1,416'},
      {'name': 'Team FC Warriors', 'time': '8:00–9:00 PM', 'sport': '⚽ Football', 'amount': '₹1,416'},
      {'name': 'Priya Singh', 'time': '9:00–10:00 PM', 'sport': '🏸 Badminton', 'amount': '₹1,062'},
    ];

    return Column(
      children: mock.asMap().entries.map((e) {
        final b = e.value;
        return Container(
          margin: const EdgeInsets.only(bottom: 10),
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: AppConstants.surfaceCard,
            borderRadius: BorderRadius.circular(AppConstants.radiusMD),
            border: Border.all(color: AppConstants.borderColor),
          ),
          child: Row(
            children: [
              CircleAvatar(
                radius: 20,
                backgroundColor: AppConstants.primaryGreen.withOpacity(0.2),
                child: Text(
                  (b['name'] as String)[0],
                  style: TextStyle(
                    color: AppConstants.primaryGreen,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(b['name'] as String,
                        style: Theme.of(context).textTheme.titleSmall?.copyWith(
                          color: AppConstants.textPrimary,
                        )),
                    Text('${b['time']} · ${b['sport']}',
                        style: TextStyle(
                            color: AppConstants.textSecondary, fontSize: 12)),
                  ],
                ),
              ),
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(
                  color: AppConstants.primaryGreen.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(AppConstants.radiusSM),
                ),
                child: Text(b['amount'] as String,
                    style: TextStyle(
                      color: AppConstants.primaryGreen,
                      fontWeight: FontWeight.w700,
                      fontSize: 12,
                    )),
              ),
            ],
          ),
        ).animate().fadeIn(delay: Duration(milliseconds: 100 * e.key));
      }).toList(),
    );
  }
}

class _OwnerVenueCard extends StatelessWidget {
  final venue;
  final int index;

  const _OwnerVenueCard({required this.venue, required this.index});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: AppConstants.surfaceCard,
        borderRadius: BorderRadius.circular(AppConstants.radiusLG),
        border: Border.all(color: AppConstants.borderColor),
      ),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: const BorderRadius.only(
              topLeft: Radius.circular(AppConstants.radiusLG),
              bottomLeft: Radius.circular(AppConstants.radiusLG),
            ),
            child: SizedBox(
              width: 80,
              height: 80,
              child: Image.network(
                venue.imageUrls.first,
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) =>
                    Container(color: AppConstants.surfaceDark),
              ),
            ),
          ),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(venue.name,
                      style: Theme.of(context).textTheme.titleMedium),
                  Text(venue.city,
                      style: TextStyle(
                          color: AppConstants.textSecondary, fontSize: 12)),
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: AppConstants.primaryGreen.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text('Active',
                            style: TextStyle(
                              color: AppConstants.primaryGreen,
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                            )),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              children: [
                GestureDetector(
                  onTap: () => context.push('/owner/slots/${venue.id}'),
                  child: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: AppConstants.primaryGreen.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Icon(Icons.grid_view_rounded,
                        color: AppConstants.primaryGreen, size: 18),
                  ),
                ),
                const SizedBox(height: 8),
                GestureDetector(
                  onTap: () => context.push('/venue/${venue.id}'),
                  child: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: AppConstants.surfaceDark,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: AppConstants.borderColor),
                    ),
                    child: Icon(Icons.visibility_outlined,
                        color: AppConstants.textSecondary, size: 18),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _StatData {
  final String label;
  final String value;
  final IconData icon;
  final Color color;

  _StatData(
      {required this.label,
      required this.value,
      required this.icon,
      required this.color});
}

class _ActionData {
  final String label;
  final IconData icon;
  final VoidCallback onTap;

  _ActionData(this.label, this.icon, this.onTap);
}
