import { getAuditLog } from "@/lib/store";
import { NextResponse } from "next/server";

export async function GET() {
  const auditLog = getAuditLog();
  return NextResponse.json(auditLog);
}