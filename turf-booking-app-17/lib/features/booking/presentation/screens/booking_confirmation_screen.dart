import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_constants.dart';

class BookingConfirmationScreen extends StatefulWidget {
  final String bookingId;

  const BookingConfirmationScreen({super.key, required this.bookingId});

  @override
  State<BookingConfirmationScreen> createState() =>
      _BookingConfirmationScreenState();
}

class _BookingConfirmationScreenState extends State<BookingConfirmationScreen>
    with TickerProviderStateMixin {
  late AnimationController _checkController;
  late AnimationController _rippleController;

  @override
  void initState() {
    super.initState();
    _checkController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    )..forward();
    _rippleController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat();
  }

  @override
  void dispose() {
    _checkController.dispose();
    _rippleController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppConstants.backgroundDark,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              const SizedBox(height: 40),

              // Success animation
              _buildSuccessAnimation(),

              const SizedBox(height: 32),

              Text('Booking Confirmed!',
                  style: Theme.of(context).textTheme.displaySmall?.copyWith(
                    fontWeight: FontWeight.w800,
                    color: AppConstants.textPrimary,
                  )).animate().fadeIn(delay: 400.ms).slideY(begin: 0.2, end: 0),

              const SizedBox(height: 8),

              Text('You\'re all set to play! 🎉',
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    color: AppConstants.textSecondary,
                  )).animate().fadeIn(delay: 500.ms),

              const SizedBox(height: 32),

              // Booking details card
              _buildBookingCard(),

              const SizedBox(height: 24),

              // Notification banner
              _buildNotificationBanner(),

              const SizedBox(height: 32),

              // Actions
              _buildActions(),

              const SizedBox(height: 24),

              // Booking ID
              Text('Booking ID: ${widget.bookingId.substring(0, 8).toUpperCase()}',
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    fontFamily: 'monospace',
                  )).animate().fadeIn(delay: 800.ms),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSuccessAnimation() {
    return AnimatedBuilder(
      animation: _rippleController,
      builder: (context, child) {
        return Stack(
          alignment: Alignment.center,
          children: [
            for (int i = 0; i < 3; i++)
              Transform.scale(
                scale: 1.0 + (_rippleController.value + i * 0.33) % 1.0,
                child: Container(
                  width: 120,
                  height: 120,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: AppConstants.primaryGreen.withOpacity(
                        (1.0 - (_rippleController.value + i * 0.33) % 1.0) * 0.4,
                      ),
                      width: 2,
                    ),
                  ),
                ),
              ),
            Container(
              width: 100,
              height: 100,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: AppConstants.primaryGradient,
                boxShadow: AppConstants.glowShadow,
              ),
              child: const Icon(Icons.check_rounded, color: Colors.white, size: 50),
            ),
          ],
        );
      },
    ).animate().scale(
          begin: const Offset(0, 0),
          end: const Offset(1, 1),
          duration: 500.ms,
          curve: Curves.elasticOut,
        );
  }

  Widget _buildBookingCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppConstants.surfaceCard,
        borderRadius: BorderRadius.circular(AppConstants.radiusXL),
        border: Border.all(color: AppConstants.primaryGreen.withOpacity(0.3)),
      ),
      child: Column(
        children: [
          _DetailRow(
            label: '📅 Date',
            value: 'Tomorrow, Apr 30 2026',
          ),
          const SizedBox(height: 12),
          _DetailRow(
            label: '⏰ Time',
            value: '7:00 PM – 8:00 PM',
          ),
          const SizedBox(height: 12),
          _DetailRow(
            label: '🏟️ Venue',
            value: 'Grassroots Arena, Pune',
          ),
          const SizedBox(height: 12),
          _DetailRow(
            label: '⚽ Sport',
            value: 'Football',
          ),
          const SizedBox(height: 12),
          Divider(color: AppConstants.borderColor),
          const SizedBox(height: 12),
          _DetailRow(
            label: '💳 Payment',
            value: 'Paid via Razorpay (TEST)',
            valueColor: AppConstants.primaryGreen,
          ),
          const SizedBox(height: 4),
          _DetailRow(
            label: '💰 Amount',
            value: '₹1,416',
            valueColor: AppConstants.primaryGreen,
          ),
        ],
      ),
    ).animate().fadeIn(delay: 600.ms).slideY(begin: 0.1, end: 0);
  }

  Widget _buildNotificationBanner() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFF075E54).withOpacity(0.2),
        borderRadius: BorderRadius.circular(AppConstants.radiusMD),
        border: Border.all(color: const Color(0xFF25D366).withOpacity(0.4)),
      ),
      child: Row(
        children: [
          const Text('📱', style: TextStyle(fontSize: 24)),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Confirmation sent via WhatsApp & Email',
                    style: TextStyle(
                      color: AppConstants.textPrimary,
                      fontWeight: FontWeight.w600,
                      fontSize: 13,
                    )),
                Text('You\'ll receive a reminder 1 hour before your slot',
                    style: TextStyle(
                        color: AppConstants.textSecondary, fontSize: 12)),
              ],
            ),
          ),
        ],
      ),
    ).animate().fadeIn(delay: 700.ms);
  }

  Widget _buildActions() {
    return Column(
      children: [
        SizedBox(
          width: double.infinity,
          child: ElevatedButton.icon(
            onPressed: () => context.go('/bookings'),
            icon: const Icon(Icons.calendar_month_rounded),
            label: const Text('View My Bookings'),
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 16),
            ),
          ),
        ).animate().fadeIn(delay: 800.ms),
        const SizedBox(height: 12),
        SizedBox(
          width: double.infinity,
          child: OutlinedButton.icon(
            onPressed: () => context.go('/home'),
            icon: const Icon(Icons.home_rounded),
            label: const Text('Back to Home'),
            style: OutlinedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 16),
            ),
          ),
        ).animate().fadeIn(delay: 900.ms),
      ],
    );
  }
}

class _DetailRow extends StatelessWidget {
  final String label;
  final String value;
  final Color? valueColor;

  const _DetailRow({
    required this.label,
    required this.value,
    this.valueColor,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: TextStyle(color: AppConstants.textSecondary, fontSize: 13)),
        Flexible(
          child: Text(
            value,
            textAlign: TextAlign.right,
            style: TextStyle(
              color: valueColor ?? AppConstants.textPrimary,
              fontWeight: FontWeight.w600,
              fontSize: 13,
            ),
          ),
        ),
      ],
    );
  }
}
