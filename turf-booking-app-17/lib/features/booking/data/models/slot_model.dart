class SlotModel {
  final String id;
  final String venueId;
  final DateTime startAt;
  final DateTime endAt;
  final double price;
  final String status; // available, booked, locked, blocked
  final String? sportType;
  final DateTime? lockedAt;
  final String? lockedBy;
  final DateTime createdAt;

  const SlotModel({
    required this.id,
    required this.venueId,
    required this.startAt,
    required this.endAt,
    required this.price,
    required this.status,
    required this.createdAt,
    this.sportType,
    this.lockedAt,
    this.lockedBy,
  });

  bool get isAvailable => status == 'available';
  bool get isBooked => status == 'booked';
  bool get isBlocked => status == 'blocked';
  bool get isLocked => status == 'locked';

  String get durationLabel {
    final duration = endAt.difference(startAt);
    final hours = duration.inHours;
    final minutes = duration.inMinutes % 60;
    if (minutes == 0) return '${hours}h';
    return '${hours}h ${minutes}m';
  }

  String get timeRangeLabel {
    final startHour = startAt.hour;
    final endHour = endAt.hour;
    final startPeriod = startHour >= 12 ? 'PM' : 'AM';
    final endPeriod = endHour >= 12 ? 'PM' : 'AM';
    final startHour12 = startHour > 12 ? startHour - 12 : (startHour == 0 ? 12 : startHour);
    final endHour12 = endHour > 12 ? endHour - 12 : (endHour == 0 ? 12 : endHour);
    final startMin = startAt.minute.toString().padLeft(2, '0');
    final endMin = endAt.minute.toString().padLeft(2, '0');
    return '$startHour12:$startMin $startPeriod – $endHour12:$endMin $endPeriod';
  }

  factory SlotModel.fromJson(Map<String, dynamic> json) {
    return SlotModel(
      id: json['id'] as String,
      venueId: json['venue_id'] as String,
      startAt: DateTime.parse(json['start_at'] as String),
      endAt: DateTime.parse(json['end_at'] as String),
      price: (json['price'] as num).toDouble(),
      status: json['status'] as String? ?? 'available',
      sportType: json['sport_type'] as String?,
      lockedAt: json['locked_at'] != null ? DateTime.parse(json['locked_at'] as String) : null,
      lockedBy: json['locked_by'] as String?,
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'venue_id': venueId,
      'start_at': startAt.toIso8601String(),
      'end_at': endAt.toIso8601String(),
      'price': price,
      'status': status,
      'sport_type': sportType,
      'locked_at': lockedAt?.toIso8601String(),
      'locked_by': lockedBy,
      'created_at': createdAt.toIso8601String(),
    };
  }

  SlotModel copyWith({
    String? id,
    String? venueId,
    DateTime? startAt,
    DateTime? endAt,
    double? price,
    String? status,
    String? sportType,
    DateTime? lockedAt,
    String? lockedBy,
    DateTime? createdAt,
  }) {
    return SlotModel(
      id: id ?? this.id,
      venueId: venueId ?? this.venueId,
      startAt: startAt ?? this.startAt,
      endAt: endAt ?? this.endAt,
      price: price ?? this.price,
      status: status ?? this.status,
      sportType: sportType ?? this.sportType,
      lockedAt: lockedAt ?? this.lockedAt,
      lockedBy: lockedBy ?? this.lockedBy,
      createdAt: createdAt ?? this.createdAt,
    );
  }
}
