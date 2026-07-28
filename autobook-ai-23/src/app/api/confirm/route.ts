import { NextRequest, NextResponse } from "next/server";
import { confirmBooking } from "@/lib/store";
import { formatSlotRange } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { emailId, slotStart } = body as {
      emailId: string;
      slotStart: string;
    };

    if (!emailId || !slotStart) {
      return NextResponse.json(
        { error: "emailId and slotStart are required" },
        { status: 400 }
      );
    }

    const result = confirmBooking(emailId, slotStart);
    if (!result) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    const { email, event } = result;
    const confirmationText = `Great news! Your meeting with ${email.intent.attendeeName} is confirmed for ${formatSlotRange(event.start, event.end)}. A calendar invite has been sent.`;

    return NextResponse.json({
      success: true,
      email,
      event,
      confirmationText,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to confirm booking" },
      { status: 500 }
    );
  }
}