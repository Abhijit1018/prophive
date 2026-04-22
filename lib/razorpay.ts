import Razorpay from "razorpay";

let _razorpay: Razorpay | null = null;

export function getRazorpay(): Razorpay {
  if (!_razorpay) {
    _razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID ?? "",
      key_secret: process.env.RAZORPAY_KEY_SECRET ?? "",
    });
  }
  return _razorpay;
}

/** @deprecated Use getRazorpay() — kept for compatibility */
export const razorpay = new Proxy({} as Razorpay, {
  get(_target, prop) {
    return getRazorpay()[prop as keyof Razorpay];
  },
});

export const RAZORPAY_PLAN_IDS: Record<string, string> = {
  buyer_basic: process.env.RAZORPAY_PLAN_BUYER_BASIC ?? "",
  buyer_pro: process.env.RAZORPAY_PLAN_BUYER_PRO ?? "",
  seller_starter: process.env.RAZORPAY_PLAN_SELLER_STARTER ?? "",
  seller_pro: process.env.RAZORPAY_PLAN_SELLER_PRO ?? "",
};

export const PLANS: Record<string, { name: string; amount: number; planType: "BUYER" | "SELLER" }> = {
  buyer_basic: { name: "Buyer Basic", amount: 49900, planType: "BUYER" },
  buyer_pro: { name: "Buyer Pro", amount: 99900, planType: "BUYER" },
  seller_starter: { name: "Seller Starter", amount: 79900, planType: "SELLER" },
  seller_pro: { name: "Seller Pro", amount: 149900, planType: "SELLER" },
};

export type PlanKey = keyof typeof PLANS;
