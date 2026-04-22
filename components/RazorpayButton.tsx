"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Props = {
  planKey: string;
  planName: string;
  amount: number;
};

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void };
  }
}

export default function RazorpayButton({ planKey, planName, amount }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && window.Razorpay) { resolve(true); return; }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  async function handleSubscribe() {
    if (!session) { router.push("/login"); return; }
    setLoading(true);

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert("Failed to load payment gateway. Please try again.");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/subscription/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planKey }),
    });

    const data = await res.json() as { razorpaySubId?: string; error?: string };
    if (!res.ok || !data.razorpaySubId) {
      alert(data.error || "Could not create subscription. Please add Razorpay plan IDs to .env.local");
      setLoading(false);
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      subscription_id: data.razorpaySubId,
      name: "PropHive",
      description: planName,
      handler: async function (response: { razorpay_payment_id: string; razorpay_subscription_id: string; razorpay_signature: string }) {
        await fetch("/api/subscription/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_subscription_id: response.razorpay_subscription_id,
            razorpay_signature: response.razorpay_signature,
            planKey,
          }),
        });
        router.push("/dashboard?subscribed=1");
        router.refresh();
      },
      prefill: { name: session.user.name ?? "", email: session.user.email ?? "" },
      theme: { color: "#ea580c" },
    };

    const rz = new window.Razorpay(options);
    rz.open();
    setLoading(false);
  }

  return (
    <Button
      onClick={handleSubscribe}
      disabled={loading}
      className="w-full bg-orange-600 hover:bg-orange-700 text-white"
    >
      {loading ? "Loading..." : `Subscribe — ₹${(amount / 100).toLocaleString("en-IN")}/mo`}
    </Button>
  );
}
