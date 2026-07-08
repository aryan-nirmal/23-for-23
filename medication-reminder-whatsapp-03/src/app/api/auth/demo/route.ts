import { NextResponse } from "next/server";
import { z } from "zod";
import { setSessionCookie } from "@/lib/auth";
import { ensureDemoAccount } from "@/lib/services/patients";

const schema = z.object({
  ownerName: z.string().min(2),
  email: z.string().email(),
  accountType: z.enum(["family", "clinic"]),
});

export async function POST(request: Request) {
  const body = schema.parse(await request.json());
  const { session } = ensureDemoAccount(body);
  await setSessionCookie(session);
  return NextResponse.json({ ok: true, session });
}
