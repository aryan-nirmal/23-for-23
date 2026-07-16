import { NextRequest, NextResponse } from "next/server";
import { validateGSTIN, normalizeGSTIN } from "@/lib/gstin";
import { generateMockSupplier } from "@/lib/mock-data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const gstin = body?.gstin;

    if (!gstin || typeof gstin !== "string") {
      return NextResponse.json(
        { error: "GSTIN is required" },
        { status: 400 }
      );
    }

    const validation = validateGSTIN(gstin);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const normalized = normalizeGSTIN(gstin);
    const supplier = generateMockSupplier(normalized);

    return NextResponse.json({ supplier });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}