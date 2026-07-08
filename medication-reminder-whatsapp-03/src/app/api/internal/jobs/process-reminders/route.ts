import { NextResponse } from "next/server";
import { runReminderJob } from "@/lib/services/jobs";

export async function POST() {
  const result = runReminderJob();
  return NextResponse.json({ message: `Created ${result.created} reminder event(s).`, ...result });
}
