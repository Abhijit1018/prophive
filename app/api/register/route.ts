import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { generateEarlyCoupon } from "@/lib/coupon";
import { sendWelcomeEmail } from "@/lib/email";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["BUYER", "SELLER"]).default("BUYER"),
  phone: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { name, email, password, role, phone } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const userCount = await prisma.user.count();
  const userNumber = userCount + 1;

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role,
      phone,
      sellerProfile: role === "SELLER" ? { create: {} } : undefined,
      buyerProfile: role === "BUYER" ? { create: {} } : undefined,
    },
  });

  await generateEarlyCoupon(user.id, userNumber);

  sendWelcomeEmail(user.name ?? "", user.email).catch(() => {});

  return NextResponse.json({ success: true, userId: user.id }, { status: 201 });
}
