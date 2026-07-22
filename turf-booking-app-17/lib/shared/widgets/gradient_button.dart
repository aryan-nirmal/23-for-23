import 'package:flutter/material.dart';
import '../../core/constants/app_constants.dart';

class GradientButton extends StatelessWidget {
  final String label;
  final bool isLoading;
  final VoidCallback? onPressed;
  final IconData? icon;
  final double? width;

  const GradientButton({
    super.key,
    required this.label,
    this.isLoading = false,
    this.onPressed,
    this.icon,
    this.width,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: isLoading ? null : onPressed,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        width: width ?? double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 18),
        decoration: BoxDecoration(
          gradient: onPressed == null || isLoading
              ? LinearGradient(colors: [AppConstants.textMuted, AppConstants.textMuted])
              : AppConstants.primaryGradient,
          borderRadius: BorderRadius.circular(AppConstants.radiusMD),
          boxShadow: onPressed != null && !isLoading ? AppConstants.glowShadow : [],
        ),
        child: isLoading
            ? const Center(
                child: SizedBox(
                  width: 24,
                  height: 24,
                  child: CircularProgressIndicator(
                    color: Colors.white,
                    strokeWidth: 2,
                  ),
                ),
              )
            : Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  if (icon != null) ...[
                    Icon(icon, color: AppConstants.backgroundDark, size: 20),
                    const SizedBox(width: 8),
                  ],
                  Text(
                    label,
                    style: TextStyle(
                      color: AppConstants.backgroundDark,
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 0.3,
                    ),
                  ),
                ],
              ),
      ),
    );
  }
}
