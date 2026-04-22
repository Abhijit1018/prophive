"use client";
import Image from "next/image";
import Link from "next/link";
import { assets, optimizedUrl } from "@/lib/assets";
import AnimatedSection from "./AnimatedSection";
import { StaggerContainer, StaggerChild } from "./AnimatedSection";

const cities = [
  {
    name: "Jaipur",
    image: assets.cities.jaipur,
    tagline: "The Pink City",
    properties: "5,200+",
  },
  {
    name: "Delhi",
    image: assets.cities.delhi,
    tagline: "The Capital",
    properties: "12,800+",
  },
  {
    name: "Gurugram",
    image: assets.cities.gurugram,
    tagline: "Millennium City",
    properties: "8,600+",
  },
];

const comingSoonCities = ["Mumbai", "Pune", "Bangalore", "Hyderabad", "Chennai"];

export default function CityExplorer() {
  return (
    <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900" id="cities-section">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="text-center mb-12">
          <span className="text-orange-600 text-sm font-semibold uppercase tracking-wider">
            Locations
          </span>
          <h2
            className="text-3xl md:text-4xl font-bold mt-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Explore by City
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-lg mx-auto">
            Discover premium properties in India&apos;s fastest-growing real estate markets
          </p>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {cities.map((city) => (
            <StaggerChild key={city.name}>
              <Link
                href={`/properties?city=${city.name}`}
                className="group block relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-lg"
              >
                <Image
                  src={optimizedUrl(city.image, 800)}
                  alt={city.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-all duration-300 group-hover:from-black/70" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-orange-400 text-sm font-medium mb-1">{city.tagline}</p>
                  <h3
                    className="text-3xl font-bold text-white mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {city.name}
                  </h3>
                  <p className="text-white/70 text-sm">{city.properties} properties</p>

                  {/* Hover arrow */}
                  <div className="flex items-center gap-2 mt-4 text-white/0 group-hover:text-white transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <span className="text-sm font-medium">Explore properties</span>
                    <span className="text-lg">→</span>
                  </div>
                </div>

                {/* Border glow on hover */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-orange-500/40 transition-colors duration-300" />
              </Link>
            </StaggerChild>
          ))}
        </StaggerContainer>

        {/* Coming soon */}
        <AnimatedSection delay={0.3} className="text-center">
          <div className="inline-flex flex-wrap items-center gap-2 justify-center">
            <span className="text-gray-400 text-sm">Coming soon:</span>
            {comingSoonCities.map((c) => (
              <Link
                key={c}
                href={`/coming-soon?city=${c}`}
                className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs hover:bg-orange-100 hover:text-orange-600 dark:hover:bg-orange-900/20 dark:hover:text-orange-400 transition-colors"
              >
                {c}
              </Link>
            ))}
            <Link
              href="/coming-soon"
              className="text-orange-600 text-xs hover:underline font-medium"
            >
              + more
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
