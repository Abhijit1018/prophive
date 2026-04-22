import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  code: z.string().min(3).toUpperCase(),
  userId: z.string(),
  discountPct: z.number().min(1).max(100),
  expiresAt: z.string().datetime(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const coupon = await prisma.coupon.create({
    data: { ...parsed.data, expiresAt: new Date(parsed.data.expiresAt) },
  });
  return NextResponse.json(coupon, { status: 201 });
}
