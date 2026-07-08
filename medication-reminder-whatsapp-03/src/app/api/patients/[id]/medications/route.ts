import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { createMedication } from "@/lib/services/patients";

const schema = z.object({
  name: z.string().min(2),
  doseText: z.string().min(1),
  instructions: z.string().optional().default(""),
  reminderTime: z.string().regex(/^\d{2}:\d{2}$/),
  graceMinutes: z.number().min(5).max(120),
});

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  const { id } = await context.params;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = schema.parse(await request.json());
  const record = createMedication({ patientId: id, ...body });
  return NextResponse.json(record);
}
