export const FEATURE_FLAGS = {
  ENABLE_ADVANCED_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ADVANCED_ANALYTICS === 'true',
  ENABLE_SMS_REMINDERS: process.env.NEXT_PUBLIC_ENABLE_SMS_REMINDERS === 'true',
  ENABLE_CALENDAR_V2: true, // Rolled out to 100%
};

export function isFeatureEnabled(feature: keyof typeof FEATURE_FLAGS): boolean {
  return FEATURE_FLAGS[feature] ?? false;
}
