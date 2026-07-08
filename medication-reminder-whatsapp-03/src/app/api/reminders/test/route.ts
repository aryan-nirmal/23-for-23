import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { getStore } from "@/lib/mock/store";
import { messagingProvider } from "@/lib/services/messaging";
import { createReminderEvent } from "@/lib/services/reminders";

const schema = z.object({
  patientId: z.string().min(2),
});

export async function POST(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = schema.parse(await request.json());
  const store = getStore();
  const medication = store.medications.find((item) => item.patientId === body.patientId);
  const schedule = store.medicationSchedules.find((item) => item.medicationId === medication?.id);

  if (!medication || !schedule) {
    return NextResponse.json({ error: "Patient needs at least one medication schedule." }, { status: 400 });
  }

  const event = createReminderEvent({
    patientId: body.patientId,
    medicationId: medication.id,
    scheduleId: schedule.id,
    localDateKey: `manual-${Date.now()}`,
  });

  messagingProvider.sendReminder(event.id);
  return NextResponse.json({ message: "Manual reminder sent.", event });
}
