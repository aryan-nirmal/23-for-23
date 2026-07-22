import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../shared/widgets/app_text_field.dart';
import '../../../../shared/widgets/gradient_button.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;
  bool _isLoading = false;
  bool _isOwner = false;

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _register() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isLoading = true);
    await Future.delayed(const Duration(seconds: 1));
    if (mounted) {
      setState(() => _isLoading = false);
      if (_isOwner) {
        context.go('/owner/dashboard');
      } else {
        context.go('/home');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppConstants.backgroundDark,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppConstants.spacingXL),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 20),

                GestureDetector(
                  onTap: () => context.go('/login'),
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
                ).animate().fadeIn(),

                const SizedBox(height: 32),

                Text('Create Account\n🏟️', style: Theme.of(context).textTheme.displaySmall?.copyWith(
                  fontWeight: FontWeight.w800, height: 1.3,
                )).animate().fadeIn(delay: 100.ms).slideY(begin: 0.2, end: 0),

                const SizedBox(height: 8),

                Text('Join thousands of players on TurfBook',
                    style: Theme.of(context).textTheme.bodyMedium
                ).animate().fadeIn(delay: 200.ms),

                const SizedBox(height: 32),

                // Account type toggle
                Container(
                  decoration: BoxDecoration(
                    color: AppConstants.surfaceCard,
                    borderRadius: BorderRadius.circular(AppConstants.radiusMD),
                    border: Border.all(color: AppConstants.borderColor),
                  ),
                  child: Row(
                    children: [
                      Expanded(child: _buildToggleTab('Player', Icons.sports_soccer, !_isOwner, () => setState(() => _isOwner = false))),
                      Expanded(child: _buildToggleTab('Turf Owner', Icons.store_rounded, _isOwner, () => setState(() => _isOwner = true))),
                    ],
                  ),
                ).animate().fadeIn(delay: 300.ms),

                const SizedBox(height: 24),

                AppTextField(
                  controller: _nameController,
                  label: 'Full Name',
                  hint: 'Nikhil Sharma',
                  prefixIcon: Icons.person_outline_rounded,
                  validator: (v) => v == null || v.isEmpty ? 'Required' : null,
                ).animate().fadeIn(delay: 350.ms),

                const SizedBox(height: 16),

                AppTextField(
                  controller: _phoneController,
                  label: 'Phone Number',
                  hint: '+91 9876543210',
                  prefixIcon: Icons.phone_outlined,
                  keyboardType: TextInputType.phone,
                  validator: (v) => v == null || v.length < 10 ? 'Enter valid phone' : null,
                ).animate().fadeIn(delay: 400.ms),

                const SizedBox(height: 16),

                AppTextField(
                  controller: _emailController,
                  label: 'Email',
                  hint: 'nikhil@example.com',
                  prefixIcon: Icons.alternate_email_rounded,
                  keyboardType: TextInputType.emailAddress,
                  validator: (v) => v == null || !v.contains('@') ? 'Enter valid email' : null,
                ).animate().fadeIn(delay: 450.ms),

                const SizedBox(height: 16),

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
                ).animate().fadeIn(delay: 500.ms),

                const SizedBox(height: 32),

                GradientButton(
                  label: _isOwner ? 'Create Owner Account' : 'Create Account',
                  isLoading: _isLoading,
                  onPressed: _register,
                ).animate().fadeIn(delay: 550.ms),

                const SizedBox(height: 24),

                Center(
                  child: RichText(
                    text: TextSpan(
                      text: 'Already have an account? ',
                      style: TextStyle(color: AppConstants.textSecondary),
                      children: [
                        WidgetSpan(
                          child: GestureDetector(
                            onTap: () => context.go('/login'),
                            child: Text('Log in', style: TextStyle(
                              color: AppConstants.primaryGreen, fontWeight: FontWeight.w700,
                            )),
                          ),
                        ),
                      ],
                    ),
                  ),
                ).animate().fadeIn(delay: 600.ms),

                const SizedBox(height: 20),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildToggleTab(String label, IconData icon, bool isActive, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: 300.ms,
        margin: const EdgeInsets.all(4),
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: isActive ? AppConstants.primaryGreen : Colors.transparent,
          borderRadius: BorderRadius.circular(AppConstants.radiusSM),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon,
                size: 16,
                color: isActive ? AppConstants.backgroundDark : AppConstants.textMuted),
            const SizedBox(width: 6),
            Text(label, style: TextStyle(
              color: isActive ? AppConstants.backgroundDark : AppConstants.textMuted,
              fontWeight: FontWeight.w600,
              fontSize: 13,
            )),
          ],
        ),
      ),
    );
  }
}
