import { NextResponse } from "next/server";
import { z } from "zod";
import { messagingProvider } from "@/lib/services/messaging";

const schema = z.object({
  eventId: z.string().min(2),
  replyText: z.string().min(1),
});

export async function POST(request: Request) {
  const body = schema.parse(await request.json());
  const event = messagingProvider.parseInboundReply(body.eventId, body.replyText);

  if (!event) {
    return NextResponse.json({ error: "Reminder event not found." }, { status: 404 });
  }

  return NextResponse.json({ message: "Inbound reply processed.", event });
}
