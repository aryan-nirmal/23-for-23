import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/utils/mock_data.dart';
import '../../data/models/venue_model.dart';

class VenueListScreen extends StatefulWidget {
  const VenueListScreen({super.key});

  @override
  State<VenueListScreen> createState() => _VenueListScreenState();
}

class _VenueListScreenState extends State<VenueListScreen> {
  String _search = '';
  String _selectedSport = 'All';
  String _selectedCity = 'All';

  List<Venue> get _filtered {
    return MockData.venues.where((v) {
      final matchSearch = _search.isEmpty ||
          v.name.toLowerCase().contains(_search.toLowerCase()) ||
          v.city.toLowerCase().contains(_search.toLowerCase());
      final matchSport =
          _selectedSport == 'All' || v.sportTypes.contains(_selectedSport);
      final matchCity = _selectedCity == 'All' || v.city == _selectedCity;
      return matchSearch && matchSport && matchCity;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppConstants.backgroundDark,
      body: SafeArea(
        child: Column(
          children: [
            _buildHeader(),
            _buildFilters(),
            Expanded(
              child: _filtered.isEmpty
                  ? _buildEmpty()
                  : ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: _filtered.length,
                      itemBuilder: (context, i) => _VenueListCard(
                        venue: _filtered[i],
                        index: i,
                      ),
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Explore Turfs',
              style: Theme.of(context).textTheme.headlineLarge),
          const SizedBox(height: 12),
          TextField(
            onChanged: (v) => setState(() => _search = v),
            style: TextStyle(color: AppConstants.textPrimary),
            decoration: InputDecoration(
              hintText: 'Search turfs, cities...',
              prefixIcon: Icon(Icons.search_rounded,
                  color: AppConstants.textMuted, size: 20),
              suffixIcon: _search.isNotEmpty
                  ? IconButton(
                      icon:
                          Icon(Icons.clear, color: AppConstants.textMuted, size: 18),
                      onPressed: () => setState(() => _search = ''),
                    )
                  : null,
            ),
          ),
          const SizedBox(height: 12),
        ],
      ),
    );
  }

  Widget _buildFilters() {
    final sports = ['All', ...AppConstants.sportTypes];
    final cities = ['All', ...AppConstants.cities];

    return Column(
      children: [
        SizedBox(
          height: 36,
          child: ListView.separated(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            scrollDirection: Axis.horizontal,
            itemCount: sports.length,
            separatorBuilder: (_, __) => const SizedBox(width: 8),
            itemBuilder: (context, i) {
              final s = sports[i];
              final isSelected = s == _selectedSport;
              return GestureDetector(
                onTap: () => setState(() => _selectedSport = s),
                child: AnimatedContainer(
                  duration: 200.ms,
                  padding: const EdgeInsets.symmetric(horizontal: 14),
                  decoration: BoxDecoration(
                    color: isSelected
                        ? AppConstants.primaryGreen
                        : AppConstants.surfaceCard,
                    borderRadius:
                        BorderRadius.circular(AppConstants.radiusCircle),
                    border: Border.all(
                        color: isSelected
                            ? AppConstants.primaryGreen
                            : AppConstants.borderColor),
                  ),
                  child: Center(
                    child: Text(
                      '${AppConstants.sportIcons[s] ?? ''} $s'.trim(),
                      style: TextStyle(
                        color: isSelected
                            ? AppConstants.backgroundDark
                            : AppConstants.textSecondary,
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
              );
            },
          ),
        ),
        const SizedBox(height: 8),
        SizedBox(
          height: 34,
          child: ListView.separated(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            scrollDirection: Axis.horizontal,
            itemCount: cities.length,
            separatorBuilder: (_, __) => const SizedBox(width: 8),
            itemBuilder: (context, i) {
              final c = cities[i];
              final isSelected = c == _selectedCity;
              return GestureDetector(
                onTap: () => setState(() => _selectedCity = c),
                child: AnimatedContainer(
                  duration: 200.ms,
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  decoration: BoxDecoration(
                    color: isSelected
                        ? AppConstants.primaryGreen.withOpacity(0.15)
                        : Colors.transparent,
                    borderRadius:
                        BorderRadius.circular(AppConstants.radiusCircle),
                    border: Border.all(
                        color: isSelected
                            ? AppConstants.primaryGreen
                            : AppConstants.borderColor),
                  ),
                  child: Center(
                    child: Text(c,
                        style: TextStyle(
                          color: isSelected
                              ? AppConstants.primaryGreen
                              : AppConstants.textMuted,
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                        )),
                  ),
                ),
              );
            },
          ),
        ),
        const SizedBox(height: 8),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Row(
            children: [
              Text('${_filtered.length} venues found',
                  style: Theme.of(context).textTheme.bodySmall),
            ],
          ),
        ),
        const SizedBox(height: 4),
      ],
    );
  }

  Widget _buildEmpty() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Text('🏟️', style: TextStyle(fontSize: 60)),
          const SizedBox(height: 16),
          Text('No turfs found', style: Theme.of(context).textTheme.headlineSmall),
          const SizedBox(height: 8),
          Text('Try a different city or sport',
              style: Theme.of(context).textTheme.bodyMedium),
        ],
      ),
    );
  }
}

class _VenueListCard extends StatelessWidget {
  final Venue venue;
  final int index;

  const _VenueListCard({required this.venue, required this.index});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => context.push('/venue/${venue.id}'),
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        decoration: BoxDecoration(
          color: AppConstants.surfaceCard,
          borderRadius: BorderRadius.circular(AppConstants.radiusLG),
          border: Border.all(color: AppConstants.borderColor),
          boxShadow: AppConstants.cardShadow,
        ),
        child: Row(
          children: [
            // Image
            ClipRRect(
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(AppConstants.radiusLG),
                bottomLeft: Radius.circular(AppConstants.radiusLG),
              ),
              child: SizedBox(
                width: 110,
                height: 120,
                child: Image.network(
                  venue.imageUrls.first,
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => Container(
                    color: AppConstants.surfaceDark,
                    child: const Icon(Icons.sports_soccer,
                        color: AppConstants.primaryGreen, size: 32),
                  ),
                ),
              ),
            ),

            // Info
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(venue.name,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: Theme.of(context).textTheme.titleLarge),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Icon(Icons.location_on_rounded,
                            size: 12, color: AppConstants.textMuted),
                        const SizedBox(width: 2),
                        Expanded(
                          child: Text(venue.city,
                              style: TextStyle(
                                  color: AppConstants.textSecondary,
                                  fontSize: 12)),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    // Sports chips
                    Wrap(
                      spacing: 4,
                      runSpacing: 4,
                      children: venue.sportTypes.take(2).map((s) {
                        return Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: AppConstants.primaryGreen.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(4),
                            border: Border.all(
                                color:
                                    AppConstants.primaryGreen.withOpacity(0.3)),
                          ),
                          child: Text(
                            '${AppConstants.sportIcons[s] ?? ''} $s',
                            style: TextStyle(
                              color: AppConstants.primaryGreen,
                              fontSize: 10,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('₹${venue.basePrice.toInt()}/hr',
                            style: TextStyle(
                              color: AppConstants.primaryGreen,
                              fontWeight: FontWeight.w700,
                              fontSize: 15,
                            )),
                        Row(
                          children: [
                            const Text('⭐', style: TextStyle(fontSize: 12)),
                            const SizedBox(width: 2),
                            Text('${venue.rating}',
                                style: TextStyle(
                                  color: AppConstants.textPrimary,
                                  fontWeight: FontWeight.w600,
                                  fontSize: 13,
                                )),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      )
          .animate()
          .fadeIn(delay: Duration(milliseconds: 80 * index))
          .slideX(begin: 0.05, end: 0),
    );
  }
}
