import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/utils/mock_data.dart';

class OwnerVenueScreen extends StatelessWidget {
  final String venueId;
  const OwnerVenueScreen({super.key, required this.venueId});

  @override
  Widget build(BuildContext context) {
    final venue = MockData.venues.firstWhere(
      (v) => v.id == venueId,
      orElse: () => MockData.venues.first,
    );

    return Scaffold(
      backgroundColor: AppConstants.backgroundDark,
      appBar: AppBar(
        leading: GestureDetector(
          onTap: () => context.pop(),
          child: const Icon(Icons.arrow_back_ios_new_rounded),
        ),
        title: Text(venue.name),
        actions: [
          IconButton(
            onPressed: () {},
            icon: const Icon(Icons.edit_outlined),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(AppConstants.radiusLG),
              child: Image.network(
                venue.imageUrls.first,
                height: 180,
                width: double.infinity,
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => Container(
                  height: 180,
                  color: AppConstants.surfaceCard,
                  child: const Icon(Icons.sports_soccer,
                      color: AppConstants.primaryGreen, size: 60),
                ),
              ),
            ),
            const SizedBox(height: 20),
            Text(venue.name, style: Theme.of(context).textTheme.headlineLarge),
            Text(venue.address, style: Theme.of(context).textTheme.bodyMedium),
            const SizedBox(height: 20),
            ElevatedButton.icon(
              onPressed: () => context.push('/owner/slots/${venue.id}'),
              icon: const Icon(Icons.grid_view_rounded),
              label: const Text('Manage Slots'),
              style: ElevatedButton.styleFrom(
                minimumSize: const Size(double.infinity, 48),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
