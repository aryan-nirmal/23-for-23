import 'package:flutter_test/flutter_test.dart';
import 'package:turf_booking/main.dart';

void main() {
  testWidgets('TurfBookingApp smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const TurfBookingApp());
    expect(find.byType(TurfBookingApp), findsOneWidget);
  });
}
