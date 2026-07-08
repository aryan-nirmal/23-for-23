import { NextResponse } from "next/server";
import { runEscalationJob } from "@/lib/services/jobs";

export async function POST() {
  const result = runEscalationJob();
  return NextResponse.json({ message: `Escalated ${result.escalated} overdue reminder(s).`, ...result });
}
