"use client";
import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { MapPin, Bell, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { assets, optimizedUrl } from "@/lib/assets";

function ComingSoonContent() {
  const params = useSearchParams();
  const city = params.get("city") ?? "your city";
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, city }),
    });
    setLoading(false);
    if (res.ok) {
      toast.success(`You're on the waitlist! We'll notify you when ${city} launches.`);
      setEmail("");
    } else {
      toast.error("Could not join waitlist. You may already be on it.");
    }
  }

  return (
    <div className="min-h-[80vh] relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={optimizedUrl(assets.cities.delhi, 1920)}
          alt="City skyline"
          fill
          className="object-cover opacity-20 dark:opacity-10"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white dark:from-gray-950/80 dark:via-gray-950/60 dark:to-gray-950" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-[80vh] px-4">
        <div className="max-w-lg w-full text-center space-y-8">
          {/* Back link */}
          <Link
            href="/properties"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to properties
          </Link>

          {/* Icon */}
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/20 dark:to-orange-900/10 flex items-center justify-center mx-auto">
            <MapPin className="h-10 w-10 text-orange-500" />
          </div>

          <div>
            <h1
              className="text-4xl md:text-5xl font-bold"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Coming to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                {city}
              </span>{" "}
              Soon
            </h1>
            <p className="text-gray-500 mt-4 text-lg">
              PropHive is expanding to {city}. Be the first to know when we launch.
            </p>
          </div>

          {/* Waitlist form */}
          <form onSubmit={handleSubmit} className="flex gap-3 max-w-sm mx-auto">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 rounded-xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
            />
            <Button
              type="submit"
              className="h-12 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold shadow-lg shadow-orange-500/20 flex-shrink-0"
              disabled={loading}
            >
              {loading ? "..." : (
                <span className="flex items-center gap-1.5">
                  <Bell className="h-4 w-4" /> Notify Me
                </span>
              )}
            </Button>
          </form>

          {/* Other cities */}
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {["Mumbai", "Pune", "Bangalore", "Hyderabad", "Chennai"].filter(c => c !== city).map((c) => (
              <Link
                key={c}
                href={`/coming-soon?city=${c}`}
                className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 text-xs hover:bg-orange-100 hover:text-orange-600 dark:hover:bg-orange-900/20 dark:hover:text-orange-400 transition-colors"
              >
                {c}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ComingSoonPage() {
  return (
    <Suspense>
      <ComingSoonContent />
    </Suspense>
  );
}
