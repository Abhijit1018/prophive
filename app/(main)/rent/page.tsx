import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import PropertyCard from "@/components/PropertyCard";
import SearchBar from "../properties/SearchBar";
import { PropertyCardSkeleton } from "@/components/PropertyCardSkeleton";
import RentWithMap from "./RentWithMap";

type SearchParams = {
  city?: string;
  type?: string;
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

async function RentGrid({ searchParams }: { searchParams: SearchParams }) {
  const session = await auth();
  const where: Record<string, unknown> = { status: "ACTIVE", mode: "RENT" };
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

  const properties = await prisma.property.findMany({
    where,
    take: 12,
    skip: ((Number(searchParams.page) || 1) - 1) * 12,
    include: { images: { where: { isPrimary: true }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  const canView = await canViewContacts(session?.user.id);

  const mapProps = properties
    .filter((p) => p.lat != null && p.lng != null)
    .map((p) => ({ id: p.id, title: p.title, price: p.price, mode: p.mode, lat: p.lat!, lng: p.lng! }));

  return (
    <RentWithMap initialMapProps={mapProps} city={searchParams.city}>
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
          <div className="col-span-3 text-center py-20 text-gray-400">No rental properties found.</div>
        )}
      </div>
    </RentWithMap>
  );
}

export default async function RentPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
        Properties for Rent
      </h1>
      <div className="mb-6">
        <Suspense>
          <SearchBar defaultMode="RENT" />
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
        <RentGrid searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
