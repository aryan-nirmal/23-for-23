import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_constants.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppConstants.backgroundDark,
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(child: _buildHeader(context)),
          SliverPadding(
            padding: const EdgeInsets.all(20),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                _buildStats(context),
                const SizedBox(height: 24),
                _buildMenuSection(context, 'Account', [
                  _MenuItem(Icons.person_outline_rounded, 'Edit Profile', () {}),
                  _MenuItem(Icons.notifications_outlined, 'Notifications', () {}),
                  _MenuItem(Icons.payment_rounded, 'Payment Methods', () {}),
                ]),
                const SizedBox(height: 16),
                _buildMenuSection(context, 'More', [
                  _MenuItem(Icons.help_outline_rounded, 'Help & Support', () {}),
                  _MenuItem(Icons.privacy_tip_outlined, 'Privacy Policy', () {}),
                  _MenuItem(Icons.star_outline_rounded, 'Rate the App', () {}),
                  _MenuItem(Icons.share_outlined, 'Share TurfBook', () {}),
                ]),
                const SizedBox(height: 16),
                _buildMenuSection(context, 'Owner', [
                  _MenuItem(Icons.manage_accounts_rounded, 'Owner Dashboard',
                      () => context.push('/owner/dashboard'),
                      color: AppConstants.primaryGreen),
                ]),
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton.icon(
                    onPressed: () => context.go('/login'),
                    icon: Icon(Icons.logout_rounded, color: AppConstants.errorRed),
                    label: Text('Log Out',
                        style: TextStyle(color: AppConstants.errorRed)),
                    style: OutlinedButton.styleFrom(
                      side: BorderSide(color: AppConstants.errorRed.withOpacity(0.4)),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                    ),
                  ),
                ),
                const SizedBox(height: 40),
              ]),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(20, 60, 20, 24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [const Color(0xFF001A0D), AppConstants.backgroundDark],
        ),
      ),
      child: Column(
        children: [
          // Avatar
          Container(
            width: 90,
            height: 90,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: AppConstants.primaryGradient,
              boxShadow: AppConstants.glowShadow,
            ),
            child: Center(
              child: Text('N',
                  style: TextStyle(
                    color: AppConstants.backgroundDark,
                    fontSize: 36,
                    fontWeight: FontWeight.w900,
                  )),
            ),
          ).animate().scale(begin: const Offset(0.5, 0.5), duration: 500.ms,
              curve: Curves.elasticOut),

          const SizedBox(height: 16),

          Text('Nikhil Sharma',
              style: Theme.of(context).textTheme.headlineMedium)
              .animate().fadeIn(delay: 200.ms),

          Text('+91 9123456789',
              style: Theme.of(context).textTheme.bodyMedium)
              .animate().fadeIn(delay: 300.ms),

          const SizedBox(height: 12),

          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
            decoration: BoxDecoration(
              color: AppConstants.primaryGreen.withOpacity(0.15),
              borderRadius: BorderRadius.circular(AppConstants.radiusCircle),
              border: Border.all(
                  color: AppConstants.primaryGreen.withOpacity(0.4)),
            ),
            child: Text('⚽ Football Enthusiast',
                style: TextStyle(
                    color: AppConstants.primaryGreen,
                    fontWeight: FontWeight.w600,
                    fontSize: 12)),
          ).animate().fadeIn(delay: 400.ms),
        ],
      ),
    );
  }

  Widget _buildStats(BuildContext context) {
    return Row(
      children: [
        Expanded(child: _StatCard(value: '12', label: 'Matches Played')),
        const SizedBox(width: 12),
        Expanded(child: _StatCard(value: '8', label: 'Venues Visited')),
        const SizedBox(width: 12),
        Expanded(child: _StatCard(value: '4.9', label: 'Avg Rating')),
      ],
    ).animate().fadeIn(delay: 200.ms);
  }

  Widget _buildMenuSection(
      BuildContext context, String title, List<_MenuItem> items) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title,
            style: Theme.of(context)
                .textTheme
                .labelMedium
                ?.copyWith(letterSpacing: 1.5)),
        const SizedBox(height: 8),
        Container(
          decoration: BoxDecoration(
            color: AppConstants.surfaceCard,
            borderRadius: BorderRadius.circular(AppConstants.radiusLG),
            border: Border.all(color: AppConstants.borderColor),
          ),
          child: Column(
            children: items.asMap().entries.map((e) {
              final item = e.value;
              final isLast = e.key == items.length - 1;
              return Column(
                children: [
                  ListTile(
                    onTap: item.onTap,
                    leading: Icon(item.icon,
                        color: item.color ?? AppConstants.textSecondary,
                        size: 20),
                    title: Text(item.label,
                        style: TextStyle(
                          color: item.color ?? AppConstants.textPrimary,
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                        )),
                    trailing: Icon(Icons.chevron_right,
                        color: AppConstants.textMuted, size: 18),
                  ),
                  if (!isLast)
                    Divider(
                        color: AppConstants.borderColor,
                        height: 1,
                        indent: 52),
                ],
              );
            }).toList(),
          ),
        ),
      ],
    );
  }
}

class _MenuItem {
  final IconData icon;
  final String label;
  final VoidCallback onTap;
  final Color? color;

  _MenuItem(this.icon, this.label, this.onTap, {this.color});
}

class _StatCard extends StatelessWidget {
  final String value;
  final String label;

  const _StatCard({required this.value, required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16),
      decoration: BoxDecoration(
        color: AppConstants.surfaceCard,
        borderRadius: BorderRadius.circular(AppConstants.radiusMD),
        border: Border.all(color: AppConstants.borderColor),
      ),
      child: Column(
        children: [
          Text(value,
              style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                color: AppConstants.primaryGreen,
                fontWeight: FontWeight.w800,
              )),
          const SizedBox(height: 4),
          Text(label,
              textAlign: TextAlign.center,
              style: TextStyle(color: AppConstants.textSecondary, fontSize: 11)),
        ],
      ),
    );
  }
}
