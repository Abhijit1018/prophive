import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().email(),
  city: z.string().min(2),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  try {
    await prisma.cityWaitlist.create({ data: parsed.data });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Already on waitlist" }, { status: 409 });
  }
}
