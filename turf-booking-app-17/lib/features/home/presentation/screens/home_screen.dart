import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/utils/mock_data.dart';
import '../../../../features/venues/data/models/venue_model.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String _selectedCity = 'Pune';
  String _selectedSport = 'All';

  List<Venue> get _filteredVenues {
    return MockData.venues.where((v) {
      final cityMatch = v.city == _selectedCity;
      final sportMatch = _selectedSport == 'All' || v.sportTypes.contains(_selectedSport);
      return cityMatch && sportMatch;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppConstants.backgroundDark,
      body: CustomScrollView(
        slivers: [
          _buildHeroHeader(),
          _buildCitySelector(),
          _buildSportFilters(),
          _buildFeaturedVenuesBanner(),
          _buildSectionTitle('Top Venues Near You'),
          _buildVenueGrid(),
          _buildQuickStats(),
          const SliverPadding(padding: EdgeInsets.only(bottom: 24)),
        ],
      ),
    );
  }

  SliverToBoxAdapter _buildHeroHeader() {
    return SliverToBoxAdapter(
      child: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              const Color(0xFF001A0D),
              const Color(0xFF003D1A),
              AppConstants.backgroundDark,
            ],
          ),
        ),
        child: SafeArea(
          bottom: false,
          child: Padding(
            padding: const EdgeInsets.fromLTRB(20, 16, 20, 28),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Top bar
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            gradient: AppConstants.turfGradient,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Icon(Icons.sports_soccer,
                              color: AppConstants.primaryGreen, size: 20),
                        ),
                        const SizedBox(width: 8),
                        Text('TurfBook',
                            style: TextStyle(
                              color: AppConstants.primaryGreen,
                              fontSize: 18,
                              fontWeight: FontWeight.w800,
                            )),
                      ],
                    ).animate().fadeIn(duration: 500.ms),
                    Row(
                      children: [
                        _IconButton(icon: Icons.notifications_outlined,
                            onTap: () {}),
                        const SizedBox(width: 8),
                        Container(
                          width: 38,
                          height: 38,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            gradient: AppConstants.primaryGradient,
                          ),
                          child: const Center(
                            child: Text('N', style: TextStyle(
                              color: AppConstants.backgroundDark,
                              fontWeight: FontWeight.w800,
                              fontSize: 16,
                            )),
                          ),
                        ),
                      ],
                    ).animate().fadeIn(duration: 500.ms),
                  ],
                ),

                const SizedBox(height: 24),

                Text('Hey Nikhil! 👋',
                    style: TextStyle(
                        color: AppConstants.textSecondary, fontSize: 14))
                    .animate().fadeIn(delay: 200.ms),
                const SizedBox(height: 4),
                Text('Ready to play today?',
                    style: Theme.of(context).textTheme.displaySmall?.copyWith(
                      fontWeight: FontWeight.w800,
                    )).animate().fadeIn(delay: 300.ms).slideY(begin: 0.2, end: 0),

                const SizedBox(height: 20),

                // Search bar
                GestureDetector(
                  onTap: () => context.go('/venues'),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                    decoration: BoxDecoration(
                      color: AppConstants.surfaceCard.withOpacity(0.8),
                      borderRadius: BorderRadius.circular(AppConstants.radiusMD),
                      border: Border.all(color: AppConstants.borderColor),
                    ),
                    child: Row(
                      children: [
                        Icon(Icons.search_rounded,
                            color: AppConstants.textMuted, size: 20),
                        const SizedBox(width: 10),
                        Text('Search turfs, sports, cities...',
                            style: TextStyle(
                                color: AppConstants.textMuted, fontSize: 14)),
                        const Spacer(),
                        Container(
                          padding: const EdgeInsets.all(6),
                          decoration: BoxDecoration(
                            color: AppConstants.primaryGreen.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Icon(Icons.tune_rounded,
                              color: AppConstants.primaryGreen, size: 16),
                        ),
                      ],
                    ),
                  ),
                ).animate().fadeIn(delay: 400.ms).slideY(begin: 0.1, end: 0),
              ],
            ),
          ),
        ),
      ),
    );
  }

  SliverToBoxAdapter _buildCitySelector() {
    return SliverToBoxAdapter(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(20, 16, 0, 0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Select City',
                style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 12),
            SizedBox(
              height: 40,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.only(right: 20),
                itemCount: AppConstants.cities.length,
                separatorBuilder: (_, __) => const SizedBox(width: 8),
                itemBuilder: (context, i) {
                  final city = AppConstants.cities[i];
                  final isSelected = city == _selectedCity;
                  return GestureDetector(
                    onTap: () => setState(() => _selectedCity = city),
                    child: AnimatedContainer(
                      duration: 200.ms,
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      decoration: BoxDecoration(
                        color: isSelected
                            ? AppConstants.primaryGreen
                            : AppConstants.surfaceCard,
                        borderRadius: BorderRadius.circular(AppConstants.radiusCircle),
                        border: Border.all(
                          color: isSelected
                              ? AppConstants.primaryGreen
                              : AppConstants.borderColor,
                        ),
                      ),
                      child: Text(city,
                          style: TextStyle(
                            color: isSelected
                                ? AppConstants.backgroundDark
                                : AppConstants.textSecondary,
                            fontWeight: FontWeight.w600,
                            fontSize: 13,
                          )),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  SliverToBoxAdapter _buildSportFilters() {
    final sports = ['All', ...AppConstants.sportTypes];
    return SliverToBoxAdapter(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(20, 16, 0, 0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Sport', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 12),
            SizedBox(
              height: 68,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.only(right: 20),
                itemCount: sports.length,
                separatorBuilder: (_, __) => const SizedBox(width: 8),
                itemBuilder: (context, i) {
                  final sport = sports[i];
                  final isSelected = sport == _selectedSport;
                  final emoji = AppConstants.sportIcons[sport] ?? '🏟️';
                  return GestureDetector(
                    onTap: () => setState(() => _selectedSport = sport),
                    child: AnimatedContainer(
                      duration: 200.ms,
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      decoration: BoxDecoration(
                        color: isSelected
                            ? AppConstants.primaryGreen.withOpacity(0.15)
                            : AppConstants.surfaceCard,
                        borderRadius: BorderRadius.circular(AppConstants.radiusMD),
                        border: Border.all(
                          color: isSelected
                              ? AppConstants.primaryGreen
                              : AppConstants.borderColor,
                          width: isSelected ? 1.5 : 1,
                        ),
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(emoji, style: const TextStyle(fontSize: 22)),
                          const SizedBox(height: 4),
                          Text(sport,
                              style: TextStyle(
                                color: isSelected
                                    ? AppConstants.primaryGreen
                                    : AppConstants.textSecondary,
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                              )),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  SliverToBoxAdapter _buildFeaturedVenuesBanner() {
    final featured = MockData.venues.first;
    return SliverToBoxAdapter(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
        child: GestureDetector(
          onTap: () => context.push('/venue/${featured.id}'),
          child: Container(
            height: 160,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(AppConstants.radiusXL),
              image: DecorationImage(
                image: NetworkImage(featured.imageUrls.first),
                fit: BoxFit.cover,
              ),
            ),
            child: Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(AppConstants.radiusXL),
                gradient: LinearGradient(
                  begin: Alignment.centerLeft,
                  end: Alignment.centerRight,
                  colors: [
                    Colors.black.withOpacity(0.75),
                    Colors.transparent,
                  ],
                ),
              ),
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppConstants.primaryGreen,
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text('⭐ FEATURED',
                        style: TextStyle(
                          color: AppConstants.backgroundDark,
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 1,
                        )),
                  ),
                  const SizedBox(height: 8),
                  Text(featured.name,
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.w800,
                        shadows: [Shadow(color: Colors.black, blurRadius: 8)],
                      )),
                  Text(featured.city,
                      style: TextStyle(
                          color: AppConstants.textSecondary, fontSize: 13)),
                ],
              ),
            ),
          ),
        ).animate().fadeIn(delay: 200.ms),
      ),
    );
  }

  SliverToBoxAdapter _buildSectionTitle(String title) {
    return SliverToBoxAdapter(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(20, 24, 20, 12),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(title, style: Theme.of(context).textTheme.headlineSmall),
            TextButton(
              onPressed: () => context.go('/venues'),
              child: Text('See all →'),
            ),
          ],
        ),
      ),
    );
  }

  SliverPadding _buildVenueGrid() {
    final venues = _filteredVenues;
    return SliverPadding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      sliver: SliverGrid(
        delegate: SliverChildBuilderDelegate(
          (context, i) {
            final venue = venues[i];
            return _VenueCard(venue: venue, index: i);
          },
          childCount: venues.length,
        ),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          crossAxisSpacing: 12,
          mainAxisSpacing: 12,
          childAspectRatio: 0.8,
        ),
      ),
    );
  }

  SliverToBoxAdapter _buildQuickStats() {
    return SliverToBoxAdapter(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(20, 28, 20, 0),
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: AppConstants.turfGradient,
            borderRadius: BorderRadius.circular(AppConstants.radiusXL),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Icon(Icons.emoji_events_rounded,
                      color: AppConstants.primaryGreen),
                  const SizedBox(width: 8),
                  Text('Your Stats',
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          color: AppConstants.primaryGreen)),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _StatItem(value: '12', label: 'Matches'),
                  _StatItem(value: '8', label: 'Venues'),
                  _StatItem(value: '4.9⭐', label: 'Rating'),
                ],
              ),
            ],
          ),
        ).animate().fadeIn(delay: 400.ms),
      ),
    );
  }
}

class _VenueCard extends StatelessWidget {
  final Venue venue;
  final int index;

  const _VenueCard({required this.venue, required this.index});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => context.push('/venue/${venue.id}'),
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(AppConstants.radiusLG),
          boxShadow: AppConstants.cardShadow,
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(AppConstants.radiusLG),
          child: Stack(
            children: [
              // Image
              Positioned.fill(
                child: Image.network(
                  venue.imageUrls.first,
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => Container(
                    color: AppConstants.surfaceCard,
                    child: const Icon(Icons.sports_soccer,
                        color: AppConstants.primaryGreen, size: 40),
                  ),
                ),
              ),
              // Gradient overlay
              Positioned.fill(
                child: Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [Colors.transparent, Colors.black.withOpacity(0.85)],
                      stops: const [0.3, 1.0],
                    ),
                  ),
                ),
              ),
              // Content
              Positioned(
                bottom: 0,
                left: 0,
                right: 0,
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Sport chips
                      Wrap(
                        spacing: 4,
                        children: venue.sportTypes.take(2).map((s) {
                          return Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: AppConstants.primaryGreen.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(4),
                              border: Border.all(
                                  color: AppConstants.primaryGreen.withOpacity(0.4)),
                            ),
                            child: Text(AppConstants.sportIcons[s] ?? s,
                                style: const TextStyle(fontSize: 10)),
                          );
                        }).toList(),
                      ),
                      const SizedBox(height: 6),
                      Text(venue.name,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.w700,
                          )),
                      const SizedBox(height: 2),
                      Row(
                        children: [
                          Icon(Icons.location_on_rounded,
                              size: 10, color: AppConstants.textSecondary),
                          const SizedBox(width: 2),
                          Expanded(
                            child: Text(venue.city,
                                style: TextStyle(
                                    color: AppConstants.textSecondary, fontSize: 11)),
                          ),
                          Text('⭐ ${venue.rating}',
                              style: TextStyle(
                                color: AppConstants.warningAmber,
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                              )),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Text('From ₹${venue.basePrice.toInt()}/hr',
                          style: TextStyle(
                            color: AppConstants.primaryGreen,
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                          )),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      )
          .animate()
          .fadeIn(delay: Duration(milliseconds: 100 * index))
          .slideY(begin: 0.1, end: 0),
    );
  }
}

class _StatItem extends StatelessWidget {
  final String value;
  final String label;

  const _StatItem({required this.value, required this.label});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(value,
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
              color: AppConstants.textPrimary,
              fontWeight: FontWeight.w800,
            )),
        Text(label,
            style: TextStyle(color: AppConstants.textSecondary, fontSize: 12)),
      ],
    );
  }
}

class _IconButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;

  const _IconButton({required this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 38,
        height: 38,
        decoration: BoxDecoration(
          color: AppConstants.surfaceCard,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: AppConstants.borderColor),
        ),
        child: Icon(icon, color: AppConstants.textSecondary, size: 18),
      ),
    );
  }
}
