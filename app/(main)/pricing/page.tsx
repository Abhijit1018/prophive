import { Suspense } from "react";
import CouponBanner from "@/components/CouponBanner";
import RazorpayButton from "@/components/RazorpayButton";
import { Check, Sparkles } from "lucide-react";

const PLANS = [
  {
    key: "free",
    name: "Free",
    priceLabel: "₹0",
    amount: 0,
    forType: "Buyers",
    perks: ["Browse all listings", "Save to wishlist", "Contact details hidden"],
    cta: null as string | null,
  },
  {
    key: "buyer_basic",
    name: "Buyer Basic",
    priceLabel: "₹499",
    period: "/mo",
    amount: 49900,
    forType: "Buyers",
    perks: ["View seller contacts", "50 contact views/day", "Saved searches"],
    cta: "buyer_basic" as string | null,
    popular: false,
  },
  {
    key: "buyer_pro",
    name: "Buyer Pro",
    priceLabel: "₹999",
    period: "/mo",
    amount: 99900,
    forType: "Buyers",
    perks: ["Unlimited contact views", "Near Me recommendations", "Priority support"],
    cta: "buyer_pro" as string | null,
    popular: true,
  },
  {
    key: "seller_starter",
    name: "Seller Starter",
    priceLabel: "₹799",
    period: "/mo",
    amount: 79900,
    forType: "Sellers",
    perks: ["List up to 5 properties", "Basic analytics", "Inquiry management"],
    cta: "seller_starter" as string | null,
    popular: false,
  },
  {
    key: "seller_pro",
    name: "Seller Pro",
    priceLabel: "₹1,499",
    period: "/mo",
    amount: 149900,
    forType: "Sellers",
    perks: ["Unlimited listings", "Featured slots", "Advanced analytics", "Priority placement"],
    cta: "seller_pro" as string | null,
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-orange-500/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-[128px]" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm text-orange-400 mb-4">
            Simple Pricing
          </span>
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Choose Your Plan
          </h1>
          <p className="text-gray-400 text-lg">
            Transparent pricing, no hidden fees. Upgrade or cancel anytime.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="max-w-7xl mx-auto px-4 -mt-8 pb-20 relative z-10">
        <Suspense fallback={null}>
          <div className="mb-8 max-w-2xl mx-auto">
            <CouponBanner />
          </div>
        </Suspense>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {PLANS.map((plan) => (
            <div
              key={plan.key}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl p-6 border flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                "popular" in plan && plan.popular
                  ? "border-orange-500 shadow-lg shadow-orange-500/10 ring-1 ring-orange-500/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-800"
              }`}
            >
              {"popular" in plan && plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-semibold px-4 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-orange-500/25">
                  <Sparkles className="h-3 w-3" />
                  Most Popular
                </div>
              )}
              <div className="mb-5">
                <h3 className="font-semibold text-lg">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span
                    className="text-3xl font-bold text-orange-600"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {plan.priceLabel}
                  </span>
                  {"period" in plan && (
                    <span className="text-gray-400 text-sm">{plan.period}</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">For {plan.forType}</p>
              </div>
              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2.5 text-sm">
                    <div className="h-5 w-5 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-orange-600" />
                    </div>
                    <span className="text-gray-600 dark:text-gray-300">{perk}</span>
                  </li>
                ))}
              </ul>
              {plan.cta ? (
                <RazorpayButton planKey={plan.cta} planName={plan.name} amount={plan.amount} />
              ) : (
                <div className="h-10 flex items-center justify-center text-sm text-gray-400 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                  Free Plan
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
