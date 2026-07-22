import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';
import '../../../../core/constants/app_constants.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _controller = PageController();
  int _currentPage = 0;

  final List<_OnboardingData> _pages = [
    _OnboardingData(
      icon: Icons.search_rounded,
      emoji: '⚽',
      title: 'Find Your\nPerfect Turf',
      subtitle: 'Discover top-rated turfs near you. Football, cricket, badminton — we\'ve got them all.',
      gradientStart: const Color(0xFF003D1A),
      gradientEnd: const Color(0xFF00521F),
    ),
    _OnboardingData(
      icon: Icons.calendar_month_rounded,
      emoji: '📅',
      title: 'Book in\nSeconds',
      subtitle: 'Real-time availability, instant confirmation. No more back-and-forth on WhatsApp.',
      gradientStart: const Color(0xFF003025),
      gradientEnd: const Color(0xFF004D35),
    ),
    _OnboardingData(
      icon: Icons.payment_rounded,
      emoji: '💳',
      title: 'Pay Safe,\nPlay Happy',
      subtitle: 'Secure payments via Razorpay. Full refund within policy. Zero hassle.',
      gradientStart: const Color(0xFF001A30),
      gradientEnd: const Color(0xFF002B4A),
    ),
  ];

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _next() {
    if (_currentPage < _pages.length - 1) {
      _controller.nextPage(duration: 400.ms, curve: Curves.easeInOut);
    } else {
      context.go('/login');
    }
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;

    return Scaffold(
      backgroundColor: AppConstants.backgroundDark,
      body: Stack(
        children: [
          // Page view
          PageView.builder(
            controller: _controller,
            onPageChanged: (i) => setState(() => _currentPage = i),
            itemCount: _pages.length,
            itemBuilder: (context, index) {
              return _buildPage(_pages[index], size, index);
            },
          ),

          // Skip button
          SafeArea(
            child: Align(
              alignment: Alignment.topRight,
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: TextButton(
                  onPressed: () => context.go('/login'),
                  child: Text(
                    'Skip',
                    style: TextStyle(color: AppConstants.textSecondary),
                  ),
                ),
              ),
            ),
          ),

          // Bottom controls
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: _buildBottomControls(),
          ),
        ],
      ),
    );
  }

  Widget _buildPage(_OnboardingData data, Size size, int index) {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [data.gradientStart, data.gradientEnd, AppConstants.backgroundDark],
          stops: const [0, 0.4, 1],
        ),
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(AppConstants.spacingXL),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Spacer(),
              // Illustration
              Container(
                width: 180,
                height: 180,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppConstants.primaryGreen.withOpacity(0.08),
                  border: Border.all(
                    color: AppConstants.primaryGreen.withOpacity(0.2),
                    width: 2,
                  ),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(data.emoji, style: const TextStyle(fontSize: 60)),
                    const SizedBox(height: 8),
                    Icon(data.icon, color: AppConstants.primaryGreen, size: 32),
                  ],
                ),
              )
                  .animate(key: ValueKey(index))
                  .fadeIn(duration: 500.ms)
                  .scale(begin: const Offset(0.7, 0.7), duration: 500.ms, curve: Curves.elasticOut),

              const SizedBox(height: 48),

              Text(
                data.title,
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.displayMedium?.copyWith(
                  height: 1.2,
                  fontWeight: FontWeight.w800,
                ),
              )
                  .animate(key: ValueKey('title-$index'))
                  .fadeIn(delay: 200.ms, duration: 500.ms)
                  .slideY(begin: 0.3, end: 0),

              const SizedBox(height: 16),

              Text(
                data.subtitle,
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  color: AppConstants.textSecondary,
                  height: 1.6,
                ),
              )
                  .animate(key: ValueKey('sub-$index'))
                  .fadeIn(delay: 350.ms, duration: 500.ms),

              const Spacer(),
              const SizedBox(height: 120),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBottomControls() {
    return Container(
      padding: const EdgeInsets.fromLTRB(24, 20, 24, 40),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            AppConstants.backgroundDark.withOpacity(0),
            AppConstants.backgroundDark,
          ],
        ),
      ),
      child: Column(
        children: [
          SmoothPageIndicator(
            controller: _controller,
            count: _pages.length,
            effect: ExpandingDotsEffect(
              activeDotColor: AppConstants.primaryGreen,
              dotColor: AppConstants.borderColor,
              dotHeight: 8,
              dotWidth: 8,
              expansionFactor: 3,
            ),
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: _next,
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 18),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(AppConstants.radiusMD),
                ),
              ),
              child: Text(
                _currentPage == _pages.length - 1 ? 'Get Started →' : 'Next →',
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
              ),
            ),
          ),
          const SizedBox(height: 12),
          if (_currentPage == _pages.length - 1)
            TextButton(
              onPressed: () => context.go('/register'),
              child: Text(
                'Create an account',
                style: TextStyle(color: AppConstants.textSecondary),
              ),
            ),
        ],
      ),
    );
  }
}

class _OnboardingData {
  final IconData icon;
  final String emoji;
  final String title;
  final String subtitle;
  final Color gradientStart;
  final Color gradientEnd;

  _OnboardingData({
    required this.icon,
    required this.emoji,
    required this.title,
    required this.subtitle,
    required this.gradientStart,
    required this.gradientEnd,
  });
}
