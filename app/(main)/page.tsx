import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import PropertyCard from "@/components/PropertyCard";
import HeroSection from "@/components/HeroSection";
import CategoryCarousel from "@/components/CategoryCarousel";
import CityExplorer from "@/components/CityExplorer";
import HowItWorks from "@/components/HowItWorks";
import StatsCounter from "@/components/StatsCounter";
import TestimonialSection from "@/components/TestimonialSection";
import VideoShowcase from "@/components/VideoShowcase";
import AnimatedSection, { StaggerContainer, StaggerChild } from "@/components/AnimatedSection";
import Link from "next/link";

async function canViewContacts(userId?: string): Promise<boolean> {
  if (!userId) return false;
  const sub = await prisma.subscription.findFirst({
    where: { userId, status: "ACTIVE", endAt: { gt: new Date() }, planType: "BUYER" },
  });
  return !!sub;
}

export default async function HomePage() {
  const session = await auth();

  const [properties, canView] = await Promise.all([
    prisma.property.findMany({
      where: { status: "ACTIVE" },
      take: 6,
      include: { images: { where: { isPrimary: true }, take: 1 } },
      orderBy: { createdAt: "desc" },
    }),
    canViewContacts(session?.user.id),
  ]);

  return (
    <div>
      {/* 1. Cinematic Hero */}
      <HeroSection />

      {/* 2. Category Carousel */}
      <CategoryCarousel />

      {/* 3. Featured Properties */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900" id="featured-section">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-orange-600 text-sm font-semibold uppercase tracking-wider">
                  Featured
                </span>
                <h2
                  className="text-3xl md:text-4xl font-bold mt-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Latest Properties
                </h2>
              </div>
              <Link
                href="/properties"
                className="hidden sm:inline-flex items-center gap-1 text-orange-600 hover:text-orange-700 text-sm font-medium transition-colors"
              >
                View all properties →
              </Link>
            </div>
          </AnimatedSection>

          <StaggerContainer
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            staggerDelay={0.1}
          >
            {properties.map((p) => (
              <StaggerChild key={p.id}>
                <PropertyCard
                  id={p.id}
                  title={p.title}
                  price={p.price}
                  mode={p.mode}
                  type={p.type}
                  city={p.city}
                  address={p.address}
                  bhk={p.bhk}
                  area={p.area}
                  imageUrl={p.images[0]?.url ?? "/placeholder.jpg"}
                  isFeatured={p.isFeatured}
                  canViewContact={canView}
                />
              </StaggerChild>
            ))}
          </StaggerContainer>

          <Link
            href="/properties"
            className="sm:hidden block text-center mt-8 text-orange-600 hover:text-orange-700 font-medium"
          >
            View all properties →
          </Link>
        </div>
      </section>

      {/* 4. How It Works */}
      <HowItWorks />

      {/* 5. Video Showcase */}
      <VideoShowcase />

      {/* 6. City Explorer */}
      <CityExplorer />

      {/* 7. Stats Counter */}
      <StatsCounter />

      {/* 8. Testimonials */}
      <TestimonialSection />
    </div>
  );
}
