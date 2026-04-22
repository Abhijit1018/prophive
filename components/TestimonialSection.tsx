"use client";
import AnimatedSection from "./AnimatedSection";
import { StaggerContainer, StaggerChild } from "./AnimatedSection";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Home Buyer, Jaipur",
    quote:
      "PropHive made finding our dream home effortless. The verified listings and transparent pricing saved us weeks of house hunting. Absolutely recommend!",
    rating: 5,
    initials: "PS",
  },
  {
    name: "Rajesh Kumar",
    role: "Property Seller, Delhi",
    quote:
      "As a seller, the platform is incredible. I listed my property and received genuine inquiries within 48 hours. The featured listing feature really boosted visibility.",
    rating: 5,
    initials: "RK",
  },
  {
    name: "Anita Verma",
    role: "Tenant, Gurugram",
    quote:
      "Found a beautiful 2BHK in Gurugram within a week. The map feature helped me find properties close to my office. The process was smooth and hassle-free.",
    rating: 4,
    initials: "AV",
  },
];

export default function TestimonialSection() {
  return (
    <section className="py-20 px-4 bg-white dark:bg-gray-950" id="testimonials-section">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="text-center mb-14">
          <span className="text-orange-600 text-sm font-semibold uppercase tracking-wider">
            Testimonials
          </span>
          <h2
            className="text-3xl md:text-4xl font-bold mt-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            What Our Customers Say
          </h2>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6" staggerDelay={0.15}>
          {testimonials.map((t) => (
            <StaggerChild key={t.name}>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300 h-full flex flex-col">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < t.rating ? "text-orange-400 fill-orange-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed flex-1 text-sm">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                  <div className="h-11 w-11 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            </StaggerChild>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
