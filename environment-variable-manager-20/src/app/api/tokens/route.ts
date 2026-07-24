import { getTokens } from "@/lib/store";
import { NextResponse } from "next/server";

export async function GET() {
  const tokens = getTokens();
  return NextResponse.json(tokens);
}