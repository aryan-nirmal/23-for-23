import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_constants.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with TickerProviderStateMixin {
  late AnimationController _rippleController;

  @override
  void initState() {
    super.initState();
    _rippleController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat();

    Timer(const Duration(seconds: 3), () {
      if (mounted) context.go('/onboarding');
    });
  }

  @override
  void dispose() {
    _rippleController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppConstants.backgroundDark,
      body: Stack(
        children: [
          // Animated background grid (turf pattern)
          Positioned.fill(child: _buildTurfPattern()),

          // Center content
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Logo with glow
                _buildLogo(),
                const SizedBox(height: 24),
                // App name
                Text(
                  'TurfBook',
                  style: Theme.of(context).textTheme.displayLarge?.copyWith(
                    color: AppConstants.textPrimary,
                    fontWeight: FontWeight.w800,
                    fontSize: 38,
                  ),
                )
                    .animate()
                    .fadeIn(delay: 400.ms, duration: 600.ms)
                    .slideY(begin: 0.2, end: 0),
                const SizedBox(height: 8),
                Text(
                  'Book. Play. Repeat.',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    color: AppConstants.primaryGreen,
                    letterSpacing: 2,
                  ),
                )
                    .animate()
                    .fadeIn(delay: 700.ms, duration: 600.ms),
                const SizedBox(height: 60),
                // Loading indicator
                SizedBox(
                  width: 40,
                  child: LinearProgressIndicator(
                    backgroundColor: AppConstants.borderColor,
                    color: AppConstants.primaryGreen,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ).animate().fadeIn(delay: 1000.ms),
              ],
            ),
          ),

          // Bottom version
          Positioned(
            bottom: 40,
            left: 0,
            right: 0,
            child: Text(
              'v1.0.0 MVP',
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.bodySmall,
            ).animate().fadeIn(delay: 1200.ms),
          ),
        ],
      ),
    );
  }

  Widget _buildLogo() {
    return AnimatedBuilder(
      animation: _rippleController,
      builder: (context, child) {
        return Stack(
          alignment: Alignment.center,
          children: [
            // Ripple rings
            for (int i = 0; i < 3; i++)
              Transform.scale(
                scale: 1.0 + (_rippleController.value + i * 0.33) % 1.0 * 0.8,
                child: Container(
                  width: 100,
                  height: 100,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: AppConstants.primaryGreen.withOpacity(
                        (1.0 - (_rippleController.value + i * 0.33) % 1.0) * 0.3,
                      ),
                      width: 1.5,
                    ),
                  ),
                ),
              ),
            // Logo circle
            Container(
              width: 90,
              height: 90,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: AppConstants.turfGradient,
                boxShadow: AppConstants.glowShadow,
              ),
              child: const Icon(
                Icons.sports_soccer,
                color: AppConstants.primaryGreen,
                size: 42,
              ),
            ),
          ],
        );
      },
    ).animate().fadeIn(duration: 600.ms).scale(begin: const Offset(0.5, 0.5));
  }

  Widget _buildTurfPattern() {
    return CustomPaint(
      painter: _TurfPatternPainter(),
    );
  }
}

class _TurfPatternPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFF003D1A).withOpacity(0.15)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1;

    const spacing = 40.0;
    for (double x = 0; x < size.width; x += spacing) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), paint);
    }
    for (double y = 0; y < size.height; y += spacing) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), paint);
    }
  }

  @override
  bool shouldRepaint(_TurfPatternPainter oldDelegate) => false;
}
