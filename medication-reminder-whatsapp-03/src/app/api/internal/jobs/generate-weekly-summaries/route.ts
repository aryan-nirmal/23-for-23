import { NextResponse } from "next/server";
import { runSummaryJob } from "@/lib/services/jobs";

export async function POST() {
  const result = runSummaryJob();
  return NextResponse.json({ message: `Generated ${result.summariesCreated} weekly summary record(s).`, ...result });
}
