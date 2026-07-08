import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getPatientAdherence } from "@/lib/services/patients";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const { searchParams } = new URL(request.url);
  const summary = getPatientAdherence(id, searchParams.get("from") ?? undefined, searchParams.get("to") ?? undefined);
  return NextResponse.json(summary);
}
