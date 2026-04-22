"use client";
import Image from "next/image";
import AnimatedSection from "./AnimatedSection";
import { assets, optimizedUrl } from "@/lib/assets";
import { Search, Shield, Zap } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Search & Discover",
    desc: "Browse thousands of verified listings across Jaipur, Delhi & Gurugram with powerful filters.",
    image: assets.lifestyle.search,
  },
  {
    icon: Shield,
    title: "Connect Directly",
    desc: "Subscribe to unlock verified seller contacts. No middlemen, no hidden fees.",
    image: assets.lifestyle.keys,
  },
  {
    icon: Zap,
    title: "Close the Deal",
    desc: "Finalize your dream property with transparent pricing and trusted sellers.",
    image: assets.lifestyle.handshake,
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-4 bg-white dark:bg-gray-950" id="howitworks-section">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <span className="text-orange-600 text-sm font-semibold uppercase tracking-wider">
            How It Works
          </span>
          <h2
            className="text-3xl md:text-4xl font-bold mt-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Your Journey to a New Home
          </h2>
        </AnimatedSection>

        <div className="space-y-20">
          {steps.map((step, i) => (
            <AnimatedSection
              key={step.title}
              direction={i % 2 === 0 ? "left" : "right"}
              delay={0.1}
            >
              <div
                className={`flex flex-col ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } items-center gap-10 md:gap-16`}
              >
                {/* Image */}
                <div className="w-full md:w-1/2 relative">
                  <div className="relative h-72 md:h-80 rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src={optimizedUrl(step.image, 800)}
                      alt={step.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                  {/* Step number */}
                  <div className="absolute -top-4 -left-4 md:-top-5 md:-left-5 h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-orange-500/30">
                    {i + 1}
                  </div>
                </div>

                {/* Text */}
                <div className="w-full md:w-1/2 space-y-4">
                  <div className="h-14 w-14 rounded-2xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                    <step.icon className="h-7 w-7 text-orange-600" />
                  </div>
                  <h3
                    className="text-2xl font-bold"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-lg">
                    {step.desc}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
