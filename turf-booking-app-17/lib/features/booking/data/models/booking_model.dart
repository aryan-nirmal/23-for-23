class BookingModel {
  final String id;
  final String slotId;
  final String venueId;
  final String? playerId;
  final String playerName;
  final String playerPhone;
  final String? playerEmail;
  final String status; // pending, confirmed, cancelled, completed
  final double totalAmount;
  final String? paymentId;
  final String? razorpayOrderId;
  final String? razorpayPaymentId;
  final String? razorpaySignature;
  final DateTime? cancelledAt;
  final String? cancellationReason;
  final double? refundAmount;
  final DateTime createdAt;

  // Joined fields (not stored in bookings table)
  final SlotInfo? slot;
  final VenueInfo? venue;

  const BookingModel({
    required this.id,
    required this.slotId,
    required this.venueId,
    required this.playerName,
    required this.playerPhone,
    required this.status,
    required this.totalAmount,
    required this.createdAt,
    this.playerId,
    this.playerEmail,
    this.paymentId,
    this.razorpayOrderId,
    this.razorpayPaymentId,
    this.razorpaySignature,
    this.cancelledAt,
    this.cancellationReason,
    this.refundAmount,
    this.slot,
    this.venue,
  });

  bool get isConfirmed => status == 'confirmed';
  bool get isCancelled => status == 'cancelled';
  bool get isPending => status == 'pending';
  bool get isCompleted => status == 'completed';

  factory BookingModel.fromJson(Map<String, dynamic> json) {
    return BookingModel(
      id: json['id'] as String,
      slotId: json['slot_id'] as String,
      venueId: json['venue_id'] as String,
      playerId: json['player_id'] as String?,
      playerName: json['player_name'] as String,
      playerPhone: json['player_phone'] as String,
      playerEmail: json['player_email'] as String?,
      status: json['status'] as String? ?? 'pending',
      totalAmount: (json['total_amount'] as num).toDouble(),
      paymentId: json['payment_id'] as String?,
      razorpayOrderId: json['razorpay_order_id'] as String?,
      razorpayPaymentId: json['razorpay_payment_id'] as String?,
      razorpaySignature: json['razorpay_signature'] as String?,
      cancelledAt: json['cancelled_at'] != null ? DateTime.parse(json['cancelled_at'] as String) : null,
      cancellationReason: json['cancellation_reason'] as String?,
      refundAmount: (json['refund_amount'] as num?)?.toDouble(),
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'slot_id': slotId,
      'venue_id': venueId,
      'player_id': playerId,
      'player_name': playerName,
      'player_phone': playerPhone,
      'player_email': playerEmail,
      'status': status,
      'total_amount': totalAmount,
      'payment_id': paymentId,
      'razorpay_order_id': razorpayOrderId,
      'razorpay_payment_id': razorpayPaymentId,
      'razorpay_signature': razorpaySignature,
      'cancelled_at': cancelledAt?.toIso8601String(),
      'cancellation_reason': cancellationReason,
      'refund_amount': refundAmount,
      'created_at': createdAt.toIso8601String(),
    };
  }
}

class SlotInfo {
  final DateTime startAt;
  final DateTime endAt;
  final String? sportType;

  const SlotInfo({required this.startAt, required this.endAt, this.sportType});

  String get timeRangeLabel {
    String _fmt(DateTime dt) {
      final hour = dt.hour;
      final min = dt.minute;
      final ampm = hour >= 12 ? 'PM' : 'AM';
      final h = hour > 12 ? hour - 12 : (hour == 0 ? 12 : hour);
      final m = min.toString().padLeft(2, '0');
      return '$h:$m $ampm';
    }
    return '${_fmt(startAt)} – ${_fmt(endAt)}';
  }
}

class VenueInfo {
  final String name;
  final String city;
  final String address;
  final String? imageUrl;

  const VenueInfo({
    required this.name,
    required this.city,
    required this.address,
    this.imageUrl,
  });
}
