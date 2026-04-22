import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import PropertyCard from "@/components/PropertyCard";
import SearchBar from "./SearchBar";
import { PropertyCardSkeleton } from "@/components/PropertyCardSkeleton";
import { isComingSoonCity } from "@/lib/mapbox";
import { redirect } from "next/navigation";
import PropertiesWithMap from "./PropertiesWithMap";

type SearchParams = {
  city?: string;
  type?: string;
  mode?: string;
  bhk?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  keyword?: string;
  page?: string;
};

async function canViewContacts(userId?: string): Promise<boolean> {
  if (!userId) return false;
  const sub = await prisma.subscription.findFirst({
    where: { userId, status: "ACTIVE", endAt: { gt: new Date() }, planType: "BUYER" },
  });
  return !!sub;
}

async function PropertiesGrid({ searchParams }: { searchParams: SearchParams }) {
  const session = await auth();

  if (searchParams.city && isComingSoonCity(searchParams.city)) {
    redirect(`/coming-soon?city=${searchParams.city}`);
  }

  const where: Record<string, unknown> = { status: "ACTIVE", mode: "SALE" };
  if (searchParams.city) where.city = { equals: searchParams.city, mode: "insensitive" };
  if (searchParams.type) where.type = searchParams.type;
  if (searchParams.bhk) where.bhk = Number(searchParams.bhk);
  if (searchParams.minPrice || searchParams.maxPrice) {
    const priceFilter: Record<string, number> = {};
    if (searchParams.minPrice) priceFilter.gte = Number(searchParams.minPrice);
    if (searchParams.maxPrice) priceFilter.lte = Number(searchParams.maxPrice);
    where.price = priceFilter;
  }
  if (searchParams.keyword) {
    where.OR = [
      { title: { contains: searchParams.keyword, mode: "insensitive" } },
      { address: { contains: searchParams.keyword, mode: "insensitive" } },
    ];
  }

  const orderBy =
    searchParams.sort === "price_asc" ? { price: "asc" as const } :
    searchParams.sort === "price_desc" ? { price: "desc" as const } :
    searchParams.sort === "most_viewed" ? { viewCount: "desc" as const } :
    { createdAt: "desc" as const };

  const [properties, canView] = await Promise.all([
    prisma.property.findMany({
      where,
      orderBy,
      take: 12,
      skip: ((Number(searchParams.page) || 1) - 1) * 12,
      include: { images: { where: { isPrimary: true }, take: 1 } },
    }),
    canViewContacts(session?.user.id),
  ]);

  const mapProps = properties
    .filter((p) => p.lat != null && p.lng != null)
    .map((p) => ({ id: p.id, title: p.title, price: p.price, mode: p.mode, lat: p.lat!, lng: p.lng! }));

  return (
    <PropertiesWithMap initialMapProps={mapProps} city={searchParams.city}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((p) => (
          <PropertyCard
            key={p.id}
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
        ))}
        {properties.length === 0 && (
          <div className="col-span-3 text-center py-20 text-gray-400">
            No properties found. Try adjusting your filters.
          </div>
        )}
      </div>
    </PropertiesWithMap>
  );
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
        Properties for Sale
      </h1>
      <div className="mb-6">
        <Suspense>
          <SearchBar defaultMode="SALE" />
        </Suspense>
      </div>
      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <PropertiesGrid searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
