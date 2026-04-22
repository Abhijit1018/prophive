import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { razorpay, PLANS, RAZORPAY_PLAN_IDS } from "@/lib/razorpay";
import { z } from "zod";

const schema = z.object({
  planKey: z.enum(["buyer_basic", "buyer_pro", "seller_starter", "seller_pro"]),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as unknown;
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

  const { planKey } = parsed.data;
  const planId = RAZORPAY_PLAN_IDS[planKey];

  if (!planId) {
    return NextResponse.json({
      error: `Plan not configured. Add RAZORPAY_PLAN_${planKey.toUpperCase()} to .env.local`,
    }, { status: 500 });
  }

  const plan = PLANS[planKey];

  const subscription = await razorpay.subscriptions.create({
    plan_id: planId,
    total_count: 12,
    quantity: 1,
    notes: { userId: session.user.id, planName: plan.name },
  } as Parameters<typeof razorpay.subscriptions.create>[0]);

  return NextResponse.json({ razorpaySubId: subscription.id });
}
