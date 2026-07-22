import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:uuid/uuid.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/utils/mock_data.dart';
import '../../../../shared/widgets/app_text_field.dart';
import '../../../../shared/widgets/gradient_button.dart';
import '../../data/models/slot_model.dart';
import '../../../venues/data/models/venue_model.dart';

class BookingScreen extends StatefulWidget {
  final String slotId;
  final Map<String, dynamic>? extra;

  const BookingScreen({super.key, required this.slotId, this.extra});

  @override
  State<BookingScreen> createState() => _BookingScreenState();
}

class _BookingScreenState extends State<BookingScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController(text: 'Nikhil Sharma');
  final _phoneController = TextEditingController(text: '+91 9123456789');
  final _emailController = TextEditingController(text: 'nikhil@example.com');
  bool _isProcessing = false;
  bool _agreeToTerms = true;

  SlotModel? get _slot => widget.extra?['slot'] as SlotModel?;
  Venue? get _venue => widget.extra?['venue'] as Venue?;

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _emailController.dispose();
    super.dispose();
  }

  void _initiatePayment() async {
    if (!_formKey.currentState!.validate()) return;
    if (!_agreeToTerms) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Please agree to the cancellation policy')),
      );
      return;
    }

    setState(() => _isProcessing = true);

    // Simulate Razorpay payment flow (Mock MVP)
    await Future.delayed(const Duration(seconds: 2));

    // Mock successful payment
    final bookingId = const Uuid().v4();

    if (mounted) {
      setState(() => _isProcessing = false);
      context.pushReplacement('/booking-confirmation/$bookingId');
    }
  }

  @override
  Widget build(BuildContext context) {
    final slot = _slot;
    final venue = _venue;

    return Scaffold(
      backgroundColor: AppConstants.backgroundDark,
      appBar: AppBar(
        leading: GestureDetector(
          onTap: () => context.pop(),
          child: const Icon(Icons.close),
        ),
        title: const Text('Confirm Booking'),
      ),
      body: Stack(
        children: [
          SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Booking Summary Card
                  if (slot != null && venue != null) _buildSummaryCard(slot, venue),

                  const SizedBox(height: 24),

                  Text('Your Details',
                      style: Theme.of(context).textTheme.headlineSmall),
                  const SizedBox(height: 16),

                  AppTextField(
                    controller: _nameController,
                    label: 'Full Name',
                    hint: 'Nikhil Sharma',
                    prefixIcon: Icons.person_outline_rounded,
                    validator: (v) => v == null || v.isEmpty ? 'Required' : null,
                  ).animate().fadeIn(delay: 200.ms),

                  const SizedBox(height: 14),

                  AppTextField(
                    controller: _phoneController,
                    label: 'Phone Number',
                    hint: '+91 9876543210',
                    prefixIcon: Icons.phone_outlined,
                    keyboardType: TextInputType.phone,
                    validator: (v) => v == null || v.length < 10 ? 'Enter valid phone' : null,
                  ).animate().fadeIn(delay: 300.ms),

                  const SizedBox(height: 14),

                  AppTextField(
                    controller: _emailController,
                    label: 'Email (optional)',
                    hint: 'nikhil@example.com',
                    prefixIcon: Icons.email_outlined,
                    keyboardType: TextInputType.emailAddress,
                  ).animate().fadeIn(delay: 400.ms),

                  const SizedBox(height: 24),

                  // Payment Breakdown
                  _buildPaymentBreakdown(slot),

                  const SizedBox(height: 20),

                  // Razorpay banner
                  _buildRazorpayBanner(),

                  const SizedBox(height: 16),

                  // Terms
                  GestureDetector(
                    onTap: () => setState(() => _agreeToTerms = !_agreeToTerms),
                    child: Row(
                      children: [
                        AnimatedContainer(
                          duration: 200.ms,
                          width: 22,
                          height: 22,
                          decoration: BoxDecoration(
                            color: _agreeToTerms
                                ? AppConstants.primaryGreen
                                : AppConstants.surfaceCard,
                            borderRadius: BorderRadius.circular(4),
                            border: Border.all(
                              color: _agreeToTerms
                                  ? AppConstants.primaryGreen
                                  : AppConstants.borderColor,
                            ),
                          ),
                          child: _agreeToTerms
                              ? Icon(Icons.check,
                                  color: AppConstants.backgroundDark, size: 14)
                              : null,
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            'I agree to the cancellation policy and terms of use',
                            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              color: AppConstants.textSecondary,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),

                  GradientButton(
                    label: _isProcessing
                        ? 'Processing...'
                        : 'Pay ₹${slot?.price.toInt() ?? 0} via Razorpay',
                    isLoading: _isProcessing,
                    icon: Icons.payment_rounded,
                    onPressed: _initiatePayment,
                  ),

                  const SizedBox(height: 12),

                  Center(
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.lock_outline,
                            size: 12, color: AppConstants.textMuted),
                        const SizedBox(width: 4),
                        Text('256-bit SSL encrypted payment',
                            style: Theme.of(context).textTheme.bodySmall),
                      ],
                    ),
                  ),

                  const SizedBox(height: 40),
                ],
              ),
            ),
          ),
          if (_isProcessing) _buildProcessingOverlay(),
        ],
      ),
    );
  }

  Widget _buildSummaryCard(SlotModel slot, Venue venue) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: AppConstants.turfGradient,
        borderRadius: BorderRadius.circular(AppConstants.radiusLG),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: AppConstants.primaryGreen.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.sports_soccer,
                    color: AppConstants.primaryGreen),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(venue.name,
                        style: Theme.of(context).textTheme.titleLarge),
                    Text(venue.city,
                        style: TextStyle(
                            color: AppConstants.textSecondary, fontSize: 13)),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Divider(color: AppConstants.primaryGreen.withOpacity(0.2)),
          const SizedBox(height: 12),
          _SummaryRow(
            label: 'Date',
            value: _formatDate(slot.startAt),
            icon: Icons.calendar_today_rounded,
          ),
          const SizedBox(height: 8),
          _SummaryRow(
            label: 'Time',
            value: slot.timeRangeLabel,
            icon: Icons.access_time_rounded,
          ),
          const SizedBox(height: 8),
          _SummaryRow(
            label: 'Duration',
            value: slot.durationLabel,
            icon: Icons.timer_outlined,
          ),
          if (slot.sportType != null) ...[
            const SizedBox(height: 8),
            _SummaryRow(
              label: 'Sport',
              value: '${AppConstants.sportIcons[slot.sportType!] ?? ''} ${slot.sportType!}',
              icon: Icons.sports_rounded,
            ),
          ],
        ],
      ),
    ).animate().fadeIn(duration: 400.ms);
  }

  Widget _buildPaymentBreakdown(SlotModel? slot) {
    final amount = slot?.price ?? 0;
    final tax = (amount * 0.18).round();
    final total = amount + tax;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppConstants.surfaceCard,
        borderRadius: BorderRadius.circular(AppConstants.radiusLG),
        border: Border.all(color: AppConstants.borderColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Payment Breakdown',
              style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 12),
          _BillRow(label: 'Slot fee', amount: '₹${amount.toInt()}'),
          const SizedBox(height: 6),
          _BillRow(label: 'GST (18%)', amount: '₹$tax'),
          const SizedBox(height: 12),
          Divider(color: AppConstants.borderColor),
          const SizedBox(height: 12),
          _BillRow(
            label: 'Total',
            amount: '₹$total',
            isTotal: true,
          ),
        ],
      ),
    );
  }

  Widget _buildRazorpayBanner() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFF072654).withOpacity(0.5),
        borderRadius: BorderRadius.circular(AppConstants.radiusMD),
        border: Border.all(color: const Color(0xFF072654)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(4),
            ),
            child: Text('Razorpay',
                style: TextStyle(
                  color: const Color(0xFF072654),
                  fontWeight: FontWeight.w900,
                  fontSize: 12,
                )),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Powered by Razorpay',
                    style: Theme.of(context).textTheme.titleSmall?.copyWith(
                        color: AppConstants.textPrimary)),
                Text('TEST MODE – No real charges',
                    style: TextStyle(
                      color: AppConstants.warningAmber,
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                    )),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProcessingOverlay() {
    return Positioned.fill(
      child: Container(
        color: Colors.black.withOpacity(0.7),
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const SizedBox(
                width: 60,
                height: 60,
                child: CircularProgressIndicator(
                  color: AppConstants.primaryGreen,
                  strokeWidth: 3,
                ),
              ),
              const SizedBox(height: 24),
              Text('Processing payment...',
                  style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 8),
              Text('Please wait',
                  style: Theme.of(context)
                      .textTheme
                      .bodyMedium
                      ?.copyWith(color: AppConstants.textSecondary)),
            ],
          ),
        ),
      ),
    );
  }

  String _formatDate(DateTime dt) {
    final months = [
      '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    final days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return '${days[dt.weekday - 1]}, ${dt.day} ${months[dt.month]} ${dt.year}';
  }
}

class _SummaryRow extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;

  const _SummaryRow({
    required this.label,
    required this.value,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, size: 14, color: AppConstants.textSecondary),
        const SizedBox(width: 8),
        Text('$label:', style: TextStyle(color: AppConstants.textSecondary, fontSize: 13)),
        const Spacer(),
        Text(value,
            style: TextStyle(
                color: AppConstants.textPrimary,
                fontSize: 13,
                fontWeight: FontWeight.w600)),
      ],
    );
  }
}

class _BillRow extends StatelessWidget {
  final String label;
  final String amount;
  final bool isTotal;

  const _BillRow({
    required this.label,
    required this.amount,
    this.isTotal = false,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label,
            style: isTotal
                ? Theme.of(context).textTheme.titleMedium
                : TextStyle(color: AppConstants.textSecondary, fontSize: 14)),
        Text(amount,
            style: isTotal
                ? Theme.of(context).textTheme.titleLarge?.copyWith(
                    color: AppConstants.primaryGreen, fontWeight: FontWeight.w800)
                : TextStyle(color: AppConstants.textPrimary, fontSize: 14)),
      ],
    );
  }
}
