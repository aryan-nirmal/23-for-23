import '../../features/venues/data/models/venue_model.dart';
import '../../features/booking/data/models/slot_model.dart';
import '../../features/booking/data/models/booking_model.dart';

/// Mock data provider for MVP demonstration
/// Replace with actual Supabase calls in production
class MockData {
  MockData._();

  static final List<Venue> venues = [
    Venue(
      id: 'venue-001',
      ownerId: 'owner-001',
      name: 'Grassroots Arena',
      city: 'Pune',
      address: 'Near Hinjewadi Phase 1, Pune, Maharashtra',
      description: 'Premium turf with flood lights, pro-quality synthetic grass, changing rooms, and parking for 50+ vehicles.',
      sportTypes: ['Football', 'Cricket'],
      imageUrls: [
        'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800',
        'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800',
      ],
      rating: 4.8,
      reviewCount: 124,
      status: 'active',
      basePrice: 1200,
      amenities: {
        'floodlights': true,
        'changing_rooms': true,
        'parking': true,
        'cafeteria': true,
        'water': true,
      },
      phone: '+91 9876543210',
      whatsapp: '919876543210',
      lat: 18.5908,
      lng: 73.7381,
      createdAt: DateTime(2024, 1, 1),
    ),
    Venue(
      id: 'venue-002',
      ownerId: 'owner-002',
      name: 'SportZone Kothrud',
      city: 'Pune',
      address: 'Karve Road, Kothrud, Pune, Maharashtra',
      description: 'State-of-the-art multi-sport complex with 2 turfs, a badminton hall, and a pro shop.',
      sportTypes: ['Football', 'Badminton', 'Basketball'],
      imageUrls: [
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
        'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=800',
      ],
      rating: 4.6,
      reviewCount: 89,
      status: 'active',
      basePrice: 900,
      amenities: {
        'floodlights': true,
        'changing_rooms': true,
        'parking': false,
        'cafeteria': false,
        'water': true,
      },
      phone: '+91 9876543211',
      whatsapp: '919876543211',
      lat: 18.5018,
      lng: 73.8231,
      createdAt: DateTime(2024, 2, 15),
    ),
    Venue(
      id: 'venue-003',
      ownerId: 'owner-001',
      name: 'Champion Grounds',
      city: 'Nashik',
      address: 'College Road, Nashik, Maharashtra',
      description: 'Premium turf in central Nashik, ideal for evening matches under brilliant floodlights.',
      sportTypes: ['Football', 'Cricket', 'Box Cricket'],
      imageUrls: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=800',
      ],
      rating: 4.5,
      reviewCount: 67,
      status: 'active',
      basePrice: 800,
      amenities: {
        'floodlights': true,
        'changing_rooms': false,
        'parking': true,
        'cafeteria': false,
        'water': true,
      },
      phone: '+91 9876543212',
      whatsapp: '919876543212',
      lat: 20.0059,
      lng: 73.7897,
      createdAt: DateTime(2024, 3, 10),
    ),
    Venue(
      id: 'venue-004',
      ownerId: 'owner-003',
      name: 'FC Elite Turf',
      city: 'Mumbai',
      address: 'Andheri West, Mumbai, Maharashtra',
      description: 'Mumbai\'s finest 5-a-side turf. Quick bookings, instant confirmation.',
      sportTypes: ['Football'],
      imageUrls: [
        'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      ],
      rating: 4.9,
      reviewCount: 203,
      status: 'active',
      basePrice: 1800,
      amenities: {
        'floodlights': true,
        'changing_rooms': true,
        'parking': true,
        'cafeteria': true,
        'water': true,
      },
      phone: '+91 9876543213',
      whatsapp: '919876543213',
      lat: 19.1136,
      lng: 72.8679,
      createdAt: DateTime(2024, 1, 20),
    ),
  ];

  static List<SlotModel> generateSlotsForVenue(String venueId, DateTime date) {
    final slots = <SlotModel>[];
    final statuses = ['available', 'available', 'available', 'booked', 'available', 'blocked', 'available', 'available', 'booked'];
    final prices = [800.0, 800.0, 1000.0, 1200.0, 1200.0, 1200.0, 1000.0, 800.0, 700.0];

    for (int i = 0; i < 9; i++) {
      final startHour = 7 + i;
      final startAt = DateTime(date.year, date.month, date.day, startHour, 0);
      final endAt = DateTime(date.year, date.month, date.day, startHour + 1, 0);
      slots.add(SlotModel(
        id: 'slot-$venueId-$i-${date.day}',
        venueId: venueId,
        startAt: startAt,
        endAt: endAt,
        price: prices[i],
        status: statuses[i % statuses.length],
        sportType: 'Football',
        createdAt: DateTime.now().subtract(const Duration(days: 7)),
      ));
    }
    return slots;
  }

  static final List<BookingModel> bookings = [
    BookingModel(
      id: 'booking-001',
      slotId: 'slot-venue-001-3-15',
      venueId: 'venue-001',
      playerName: 'Nikhil Sharma',
      playerPhone: '+91 9123456789',
      playerEmail: 'nikhil@example.com',
      status: 'confirmed',
      totalAmount: 1200,
      razorpayOrderId: 'order_test_MockOrder001',
      razorpayPaymentId: 'pay_test_MockPay001',
      createdAt: DateTime.now().subtract(const Duration(days: 2)),
      slot: SlotInfo(
        startAt: DateTime.now().add(const Duration(days: 1, hours: 3)),
        endAt: DateTime.now().add(const Duration(days: 1, hours: 4)),
        sportType: 'Football',
      ),
      venue: const VenueInfo(
        name: 'Grassroots Arena',
        city: 'Pune',
        address: 'Near Hinjewadi Phase 1, Pune',
        imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400',
      ),
    ),
    BookingModel(
      id: 'booking-002',
      slotId: 'slot-venue-002-5-20',
      venueId: 'venue-002',
      playerName: 'Nikhil Sharma',
      playerPhone: '+91 9123456789',
      playerEmail: 'nikhil@example.com',
      status: 'completed',
      totalAmount: 900,
      razorpayOrderId: 'order_test_MockOrder002',
      razorpayPaymentId: 'pay_test_MockPay002',
      createdAt: DateTime.now().subtract(const Duration(days: 10)),
      slot: SlotInfo(
        startAt: DateTime.now().subtract(const Duration(days: 3)),
        endAt: DateTime.now().subtract(const Duration(days: 3)).add(const Duration(hours: 1)),
        sportType: 'Badminton',
      ),
      venue: const VenueInfo(
        name: 'SportZone Kothrud',
        city: 'Pune',
        address: 'Karve Road, Kothrud, Pune',
        imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400',
      ),
    ),
  ];
}
