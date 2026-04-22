import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET ?? "")
    .update(body)
    .digest("hex");

  if (expectedSignature !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body) as {
    event: string;
    payload?: {
      subscription?: {
        entity?: {
          id?: string;
          current_end?: number;
        };
      };
    };
  };

  const subId = event.payload?.subscription?.entity?.id;

  if (event.event === "payment.captured" && subId) {
    await prisma.subscription.updateMany({
      where: { razorpaySubId: subId },
      data: { status: "ACTIVE" },
    });
  }

  if ((event.event === "subscription.cancelled" || event.event === "subscription.completed") && subId) {
    await prisma.subscription.updateMany({
      where: { razorpaySubId: subId },
      data: { status: "CANCELLED" },
    });
  }

  if (event.event === "subscription.charged" && subId) {
    const currentEnd = event.payload?.subscription?.entity?.current_end;
    const endAt = currentEnd
      ? new Date(currentEnd * 1000)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await prisma.subscription.updateMany({
      where: { razorpaySubId: subId },
      data: { status: "ACTIVE", endAt },
    });
  }

  return NextResponse.json({ received: true });
}
