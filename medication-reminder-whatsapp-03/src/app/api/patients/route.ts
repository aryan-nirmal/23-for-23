import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { createPatient } from "@/lib/services/patients";

const schema = z.object({
  caregiverName: z.string().min(2),
  caregiverPhone: z.string().min(6),
  patientName: z.string().min(2),
  patientPhone: z.string().min(6),
  timezone: z.string().min(2),
  preferredLanguage: z.string().min(2),
  patientConsent: z.boolean(),
  caregiverConsent: z.boolean(),
});

export async function POST(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = schema.parse(await request.json());
  const patient = createPatient({ session, ...body });
  return NextResponse.json({ patient });
}
