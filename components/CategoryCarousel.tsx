"use client";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { assets, optimizedUrl } from "@/lib/assets";
import AnimatedSection from "./AnimatedSection";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback } from "react";

const categories = [
  { key: "apartment", label: "Apartments", image: assets.categories.apartment, description: "Modern city living" },
  { key: "villa", label: "Villas", image: assets.categories.villa, description: "Luxury independent homes" },
  { key: "plot", label: "Plots", image: assets.categories.plot, description: "Build your dream" },
  { key: "commercial", label: "Commercial", image: assets.categories.commercial, description: "Office & retail spaces" },
  { key: "pg_hostel", label: "PG / Hostel", image: assets.categories.pg_hostel, description: "Affordable co-living" },
];

export default function CategoryCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", skipSnaps: false, dragFree: true },
    [Autoplay({ delay: 3000, stopOnInteraction: true })]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="py-20 px-4 bg-white dark:bg-gray-950" id="categories-section">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection>
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-orange-600 text-sm font-semibold uppercase tracking-wider">Explore</span>
              <h2
                className="text-3xl md:text-4xl font-bold mt-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Browse by Category
              </h2>
            </div>
            <div className="hidden sm:flex gap-2">
              <button
                onClick={scrollPrev}
                className="h-10 w-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors"
                aria-label="Previous category"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={scrollNext}
                className="h-10 w-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors"
                aria-label="Next category"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-5">
              {categories.map((cat) => (
                <Link
                  key={cat.key}
                  href={`/properties?type=${cat.key.toUpperCase()}`}
                  className="flex-shrink-0 w-[280px] md:w-[320px] group"
                >
                  <div className="relative h-80 rounded-2xl overflow-hidden shadow-md">
                    <Image
                      src={optimizedUrl(cat.image, 640)}
                      alt={cat.label}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="320px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl font-bold text-white mb-1">{cat.label}</h3>
                      <p className="text-white/70 text-sm">{cat.description}</p>
                    </div>
                    {/* Hover glow */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-orange-500/50 transition-colors duration-300" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
