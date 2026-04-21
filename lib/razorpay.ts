import Razorpay from "razorpay";

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const PLANS = {
  buyer_basic: {
    name: "Buyer Basic",
    amount: 49900,
    planType: "BUYER" as const,
    razorpayPlanId: process.env.RAZORPAY_PLAN_BUYER_BASIC!,
  },
  buyer_pro: {
    name: "Buyer Pro",
    amount: 99900,
    planType: "BUYER" as const,
    razorpayPlanId: process.env.RAZORPAY_PLAN_BUYER_PRO!,
  },
  seller_starter: {
    name: "Seller Starter",
    amount: 79900,
    planType: "SELLER" as const,
    razorpayPlanId: process.env.RAZORPAY_PLAN_SELLER_STARTER!,
  },
  seller_pro: {
    name: "Seller Pro",
    amount: 149900,
    planType: "SELLER" as const,
    razorpayPlanId: process.env.RAZORPAY_PLAN_SELLER_PRO!,
  },
} as const;

export type PlanKey = keyof typeof PLANS;
