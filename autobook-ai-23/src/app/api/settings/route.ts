import { NextRequest, NextResponse } from "next/server";
import { getSettings, updateSettings } from "@/lib/store";

export async function GET() {
  return NextResponse.json(getSettings());
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const settings = updateSettings(body);
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}