export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, properties);
  } else {
    // Fallback for local development
    console.log(`[Analytics Track] ${eventName}`, properties);
  }
}

export function trackBookingConversion(guestId: string, podcastName: string) {
  trackEvent('guest_booked', { guestId, podcastName });
}
