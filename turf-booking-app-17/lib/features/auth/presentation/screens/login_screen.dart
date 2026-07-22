import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../shared/widgets/app_text_field.dart';
import '../../../../shared/widgets/gradient_button.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;
  bool _isLoading = false;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _login() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isLoading = true);

    // Mock login - always succeeds for MVP
    await Future.delayed(const Duration(seconds: 1));
    if (mounted) {
      setState(() => _isLoading = false);
      context.go('/home');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppConstants.backgroundDark,
      body: Stack(
        children: [
          // Background
          Positioned.fill(child: _buildBackground()),

          // Content
          SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(AppConstants.spacingXL),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 20),

                    // Back button
                    GestureDetector(
                      onTap: () => context.go('/onboarding'),
                      child: Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: AppConstants.surfaceCard,
                          borderRadius: BorderRadius.circular(AppConstants.radiusMD),
                          border: Border.all(color: AppConstants.borderColor),
                        ),
                        child: Icon(Icons.arrow_back_ios_new_rounded,
                            color: AppConstants.textPrimary, size: 16),
                      ),
                    ).animate().fadeIn(duration: 400.ms),

                    const SizedBox(height: 40),

                    // Header
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            gradient: AppConstants.turfGradient,
                            borderRadius: BorderRadius.circular(AppConstants.radiusMD),
                          ),
                          child: const Icon(Icons.sports_soccer,
                              color: AppConstants.primaryGreen, size: 28),
                        ),
                        const SizedBox(width: 12),
                        Text(
                          'TurfBook',
                          style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                            color: AppConstants.primaryGreen,
                          ),
                        ),
                      ],
                    ).animate().fadeIn(delay: 100.ms).slideX(begin: -0.2, end: 0),

                    const SizedBox(height: 32),

                    Text(
                      'Welcome back\nChampion! 👋',
                      style: Theme.of(context).textTheme.displaySmall?.copyWith(
                        height: 1.3,
                        fontWeight: FontWeight.w800,
                      ),
                    ).animate().fadeIn(delay: 200.ms).slideY(begin: 0.2, end: 0),

                    const SizedBox(height: 8),

                    Text(
                      'Log in to book your favorite turf',
                      style: Theme.of(context).textTheme.bodyMedium,
                    ).animate().fadeIn(delay: 300.ms),

                    const SizedBox(height: 40),

                    // Email field
                    AppTextField(
                      controller: _emailController,
                      label: 'Email or Phone',
                      hint: 'nikhil@example.com',
                      prefixIcon: Icons.alternate_email_rounded,
                      keyboardType: TextInputType.emailAddress,
                      validator: (v) => v == null || v.isEmpty ? 'Required' : null,
                    ).animate().fadeIn(delay: 400.ms).slideY(begin: 0.1, end: 0),

                    const SizedBox(height: 16),

                    // Password field
                    AppTextField(
                      controller: _passwordController,
                      label: 'Password',
                      hint: '••••••••',
                      prefixIcon: Icons.lock_outline_rounded,
                      obscureText: _obscurePassword,
                      suffixIcon: IconButton(
                        icon: Icon(
                          _obscurePassword ? Icons.visibility_off_rounded : Icons.visibility_rounded,
                          color: AppConstants.textMuted,
                        ),
                        onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                      ),
                      validator: (v) => v == null || v.length < 6 ? 'Min 6 characters' : null,
                    ).animate().fadeIn(delay: 500.ms).slideY(begin: 0.1, end: 0),

                    const SizedBox(height: 12),

                    // Forgot password
                    Align(
                      alignment: Alignment.centerRight,
                      child: TextButton(
                        onPressed: () {},
                        child: Text('Forgot password?',
                            style: TextStyle(color: AppConstants.primaryGreen)),
                      ),
                    ).animate().fadeIn(delay: 550.ms),

                    const SizedBox(height: 24),

                    // Login button
                    GradientButton(
                      label: 'Log In',
                      isLoading: _isLoading,
                      onPressed: _login,
                    ).animate().fadeIn(delay: 600.ms).slideY(begin: 0.1, end: 0),

                    const SizedBox(height: 16),

                    // Divider
                    Row(
                      children: [
                        Expanded(child: Divider(color: AppConstants.borderColor)),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          child: Text('or continue as', style: Theme.of(context).textTheme.bodySmall),
                        ),
                        Expanded(child: Divider(color: AppConstants.borderColor)),
                      ],
                    ).animate().fadeIn(delay: 700.ms),

                    const SizedBox(height: 16),

                    // Owner login
                    SizedBox(
                      width: double.infinity,
                      child: OutlinedButton.icon(
                        onPressed: () => context.go('/owner/dashboard'),
                        icon: const Icon(Icons.manage_accounts_rounded),
                        label: const Text('Turf Owner Dashboard'),
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 16),
                        ),
                      ),
                    ).animate().fadeIn(delay: 750.ms),

                    const SizedBox(height: 32),

                    // Register link
                    Center(
                      child: RichText(
                        text: TextSpan(
                          text: 'Don\'t have an account? ',
                          style: TextStyle(color: AppConstants.textSecondary),
                          children: [
                            WidgetSpan(
                              child: GestureDetector(
                                onTap: () => context.go('/register'),
                                child: Text(
                                  'Sign up',
                                  style: TextStyle(
                                    color: AppConstants.primaryGreen,
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ).animate().fadeIn(delay: 800.ms),

                    const SizedBox(height: 20),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBackground() {
    return Stack(
      children: [
        Positioned(
          top: -100,
          right: -80,
          child: Container(
            width: 300,
            height: 300,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: RadialGradient(
                colors: [
                  AppConstants.primaryGreen.withOpacity(0.08),
                  Colors.transparent,
                ],
              ),
            ),
          ),
        ),
        Positioned(
          bottom: 100,
          left: -100,
          child: Container(
            width: 250,
            height: 250,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: RadialGradient(
                colors: [
                  AppConstants.accentGreen.withOpacity(0.06),
                  Colors.transparent,
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}
