import { NextResponse } from "next/server";
import { mockScan } from "@/lib/mock-scanner";
import { saveScan } from "@/lib/store";
import { isValidUrl, normalizeUrl } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawUrl = body?.url;

    if (!rawUrl || typeof rawUrl !== "string") {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    const url = normalizeUrl(rawUrl);

    if (!isValidUrl(url)) {
      return NextResponse.json(
        { error: "Invalid URL. Please enter a valid http or https URL." },
        { status: 400 }
      );
    }

    const scan = mockScan(url);
    saveScan(scan);

    return NextResponse.json(scan, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}