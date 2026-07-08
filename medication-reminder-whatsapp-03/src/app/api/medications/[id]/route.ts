import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { updateMedication } from "@/lib/services/patients";

const schema = z.object({
  name: z.string().min(2).optional(),
  doseText: z.string().min(1).optional(),
  instructions: z.string().optional(),
  active: z.boolean().optional(),
  reminderTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  graceMinutes: z.number().min(5).max(120).optional(),
});

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = schema.parse(await request.json());
  const updated = updateMedication({ medicationId: id, ...body });

  if (!updated) {
    return NextResponse.json({ error: "Medication not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}
