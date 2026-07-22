class Venue {
  final String id;
  final String ownerId;
  final String name;
  final String city;
  final String address;
  final String description;
  final List<String> sportTypes;
  final List<String> imageUrls;
  final double rating;
  final int reviewCount;
  final String status; // active, inactive, pending
  final double basePrice;
  final Map<String, dynamic>? amenities;
  final double? lat;
  final double? lng;
  final String? phone;
  final String? whatsapp;
  final DateTime createdAt;

  const Venue({
    required this.id,
    required this.ownerId,
    required this.name,
    required this.city,
    required this.address,
    required this.description,
    required this.sportTypes,
    required this.imageUrls,
    required this.rating,
    required this.reviewCount,
    required this.status,
    required this.basePrice,
    required this.createdAt,
    this.amenities,
    this.lat,
    this.lng,
    this.phone,
    this.whatsapp,
  });

  factory Venue.fromJson(Map<String, dynamic> json) {
    return Venue(
      id: json['id'] as String,
      ownerId: json['owner_id'] as String,
      name: json['name'] as String,
      city: json['city'] as String,
      address: json['address'] as String,
      description: json['description'] as String? ?? '',
      sportTypes: List<String>.from(json['sport_types'] ?? []),
      imageUrls: List<String>.from(json['image_urls'] ?? []),
      rating: (json['rating'] as num?)?.toDouble() ?? 4.0,
      reviewCount: json['review_count'] as int? ?? 0,
      status: json['status'] as String? ?? 'active',
      basePrice: (json['base_price'] as num?)?.toDouble() ?? 0,
      amenities: json['amenities'] as Map<String, dynamic>?,
      lat: (json['lat'] as num?)?.toDouble(),
      lng: (json['lng'] as num?)?.toDouble(),
      phone: json['phone'] as String?,
      whatsapp: json['whatsapp'] as String?,
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'owner_id': ownerId,
      'name': name,
      'city': city,
      'address': address,
      'description': description,
      'sport_types': sportTypes,
      'image_urls': imageUrls,
      'rating': rating,
      'review_count': reviewCount,
      'status': status,
      'base_price': basePrice,
      'amenities': amenities,
      'lat': lat,
      'lng': lng,
      'phone': phone,
      'whatsapp': whatsapp,
      'created_at': createdAt.toIso8601String(),
    };
  }

  Venue copyWith({
    String? id,
    String? ownerId,
    String? name,
    String? city,
    String? address,
    String? description,
    List<String>? sportTypes,
    List<String>? imageUrls,
    double? rating,
    int? reviewCount,
    String? status,
    double? basePrice,
    Map<String, dynamic>? amenities,
    double? lat,
    double? lng,
    String? phone,
    String? whatsapp,
    DateTime? createdAt,
  }) {
    return Venue(
      id: id ?? this.id,
      ownerId: ownerId ?? this.ownerId,
      name: name ?? this.name,
      city: city ?? this.city,
      address: address ?? this.address,
      description: description ?? this.description,
      sportTypes: sportTypes ?? this.sportTypes,
      imageUrls: imageUrls ?? this.imageUrls,
      rating: rating ?? this.rating,
      reviewCount: reviewCount ?? this.reviewCount,
      status: status ?? this.status,
      basePrice: basePrice ?? this.basePrice,
      amenities: amenities ?? this.amenities,
      lat: lat ?? this.lat,
      lng: lng ?? this.lng,
      phone: phone ?? this.phone,
      whatsapp: whatsapp ?? this.whatsapp,
      createdAt: createdAt ?? this.createdAt,
    );
  }
}
