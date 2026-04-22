import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PLANS } from "@/lib/razorpay";
import crypto from "crypto";
import { z } from "zod";
import { sendSubscriptionConfirmationEmail } from "@/lib/email";

const schema = z.object({
  razorpay_payment_id: z.string(),
  razorpay_subscription_id: z.string(),
  razorpay_signature: z.string(),
  planKey: z.enum(["buyer_basic", "buyer_pro", "seller_starter", "seller_pro"]),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as unknown;
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature, planKey } = parsed.data;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET ?? "")
    .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const plan = PLANS[planKey];
  const endAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await prisma.subscription.create({
    data: {
      userId: session.user.id,
      planName: plan.name,
      planType: plan.planType,
      razorpaySubId: razorpay_subscription_id,
      status: "ACTIVE",
      endAt,
      amount: plan.amount / 100,
    },
  });

  const userForEmail = await prisma.user.findUnique({ where: { id: session.user.id }, select: { name: true, email: true } });
  if (userForEmail) sendSubscriptionConfirmationEmail(userForEmail.name ?? "", userForEmail.email, plan.name).catch(() => {});

  return NextResponse.json({ success: true });
}
