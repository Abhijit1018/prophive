"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { assets, optimizedUrl } from "@/lib/assets";
import { Search, MapPin, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const stats = [
  { icon: TrendingUp, value: "10,000+", label: "Properties Listed" },
  { icon: MapPin, value: "3", label: "Active Cities" },
  { icon: Users, value: "5,000+", label: "Happy Customers" },
];

export default function HeroSection() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [city, setCity] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (city) params.set("city", city);
    router.push(`/properties?${params.toString()}`);
  }

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden" id="hero-section">
      {/* Background image with parallax */}
      <div className="absolute inset-0 z-0">
        <Image
          src={optimizedUrl(assets.hero.main, 1920)}
          alt="Luxury property"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 w-full py-20">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm text-white/90 mb-6">
              🏆 India&apos;s Most Trusted Property Platform
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Find Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-300">
              Dream Home
            </span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed max-w-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Buy, sell, or rent premium properties across Jaipur, Delhi &amp; Gurugram.
            Verified listings, transparent pricing.
          </motion.p>

          {/* Search Bar - Glassmorphism */}
          <motion.form
            onSubmit={handleSearch}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-3 border border-white/20 shadow-2xl flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
          >
            <div className="flex-1 flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3">
              <Search className="h-5 w-5 text-white/60 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search by location, project, or keyword..."
                className="w-full bg-transparent text-white placeholder:text-white/50 outline-none text-sm"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <select
              className="bg-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none appearance-none cursor-pointer min-w-[140px]"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="" className="text-gray-900">All Cities</option>
              <option value="Jaipur" className="text-gray-900">Jaipur</option>
              <option value="Delhi" className="text-gray-900">Delhi</option>
              <option value="Gurugram" className="text-gray-900">Gurugram</option>
            </select>
            <button
              type="submit"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-xl font-semibold text-sm transition-all hover:shadow-lg hover:shadow-orange-500/25 active:scale-95"
            >
              Search
            </button>
          </motion.form>

          {/* Quick links */}
          <motion.div
            className="flex flex-wrap gap-2 mt-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <span className="text-white/50 text-sm">Popular:</span>
            {["2 BHK in Jaipur", "Villas in Gurugram", "Rent in Delhi"].map((q) => (
              <Link
                key={q}
                href={`/properties?keyword=${encodeURIComponent(q)}`}
                className="text-sm text-white/70 hover:text-orange-400 transition-colors"
              >
                {q}
              </Link>
            ))}
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          className="mt-16 flex flex-wrap gap-6 md:gap-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                <Icon className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-white/60">{label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-gray-950 to-transparent z-10" />
    </section>
  );
}
