import { NextRequest, NextResponse } from "next/server";
import {
  generateProposalText,
  getAvailableSlots,
  getEmailById,
  updateEmail,
} from "@/lib/store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { emailId, slotStarts } = body as {
      emailId: string;
      slotStarts?: string[];
    };

    if (!emailId) {
      return NextResponse.json(
        { error: "emailId is required" },
        { status: 400 }
      );
    }

    const email = getEmailById(emailId);
    if (!email) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    let slots = getAvailableSlots(email.intent.durationMinutes, 5);

    if (slotStarts && slotStarts.length > 0) {
      slots = slots.filter((s) => slotStarts.includes(s.start));
      if (slots.length === 0) {
        slots = slotStarts.map((start) => ({
          start,
          end: new Date(
            new Date(start).getTime() + email.intent.durationMinutes * 60000
          ).toISOString(),
          available: true,
        }));
      }
    }

    const proposalText = generateProposalText(email, slots);
    const proposedSlotStarts = slots.map((s) => s.start);

    updateEmail(emailId, {
      status: "proposed",
      proposedSlots: proposedSlotStarts,
      proposalText,
    });

    return NextResponse.json({
      proposalText,
      slots: slots.map((s) => ({
        start: s.start,
        end: s.end,
        label: `${s.start}`,
      })),
      emailId,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate proposal" },
      { status: 500 }
    );
  }
}