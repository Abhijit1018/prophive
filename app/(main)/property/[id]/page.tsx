import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import SubscriptionGate from "@/components/SubscriptionGate";
import PropertyCard from "@/components/PropertyCard";
import PropertyGallery from "@/components/PropertyGallery";
import { auth } from "@/lib/auth";
import { BedDouble, Maximize2, MapPin, Calendar, Eye, Sparkles } from "lucide-react";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

async function canViewContacts(userId?: string): Promise<boolean> {
  if (!userId) return false;
  const sub = await prisma.subscription.findFirst({
    where: { userId, status: "ACTIVE", endAt: { gt: new Date() }, planType: "BUYER" },
  });
  return !!sub;
}

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const [property, session] = await Promise.all([
    prisma.property.findUnique({
      where: { id: params.id },
      include: {
        images: true,
        seller: { select: { id: true, name: true, email: true, phone: true } },
      },
    }),
    auth(),
  ]);

  if (!property || property.status !== "ACTIVE") notFound();

  await prisma.property.update({
    where: { id: params.id },
    data: { viewCount: { increment: 1 } },
  });

  const similar = await prisma.property.findMany({
    where: {
      city: property.city,
      type: property.type,
      status: "ACTIVE",
      NOT: { id: property.id },
    },
    take: 3,
    include: { images: { where: { isPrimary: true }, take: 1 } },
  });

  const canView = await canViewContacts(session?.user.id);

  const formattedPrice =
    property.mode === "RENT"
      ? `₹${property.price.toLocaleString("en-IN")}/mo`
      : `₹${(property.price / 100000).toFixed(1)}L`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gallery Carousel */}
          <PropertyGallery images={property.images} title={property.title} />

          {/* Title + price */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-0">
                {property.type.replace("_", " ")}
              </Badge>
              <Badge variant="outline">
                {property.mode === "SALE" ? "For Sale" : "For Rent"}
              </Badge>
              {property.isFeatured && (
                <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
            <h1
              className="text-3xl md:text-4xl font-bold"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {property.title}
            </h1>
            <p
              className="text-3xl font-bold text-orange-600 mt-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {formattedPrice}
            </p>
            <div className="flex items-center gap-1.5 mt-3 text-gray-500">
              <MapPin className="h-4 w-4 text-orange-400" />
              <span>
                {property.address}, {property.city} - {property.pincode}
              </span>
            </div>
          </div>

          <Separator />

          {/* Specs */}
          <div>
            <h2 className="font-semibold text-lg mb-4">Property Details</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {property.bhk && (
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                  <BedDouble className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-xs text-gray-400">BHK</p>
                    <p className="font-semibold">{property.bhk} BHK</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                <Maximize2 className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-xs text-gray-400">Area</p>
                  <p className="font-semibold">{property.area} sq.ft</p>
                </div>
              </div>
              {property.furnishing && (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                  <p className="text-xs text-gray-400">Furnishing</p>
                  <p className="font-semibold">{property.furnishing.replace("_", " ")}</p>
                </div>
              )}
              <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                <Calendar className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-xs text-gray-400">Listed</p>
                  <p className="font-semibold">
                    {new Date(property.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                <Eye className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-xs text-gray-400">Views</p>
                  <p className="font-semibold">{property.viewCount}</p>
                </div>
              </div>
              {property.landmark && (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                  <p className="text-xs text-gray-400">Landmark</p>
                  <p className="font-semibold">{property.landmark}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h2 className="font-semibold text-lg mb-2">Description</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {property.description}
            </p>
          </div>

          {/* Map */}
          {property.lat && property.lng && (
            <div>
              <h2 className="font-semibold text-lg mb-4">Location</h2>
              <div className="rounded-2xl overflow-hidden">
                <MapView
                  properties={[]}
                  singlePin={{ lat: property.lat, lng: property.lng, title: property.address }}
                />
              </div>
              <p className="text-sm text-gray-400 mt-2 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {property.address}, {property.city}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div
            id="contact"
            className="bg-white dark:bg-gray-800/80 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50 sticky top-24"
          >
            <h2 className="font-semibold text-lg mb-4">Contact Seller</h2>
            <SubscriptionGate
              phone={property.seller.phone}
              email={property.seller.email}
              name={property.seller.name}
            />
          </div>
        </div>
      </div>

      {/* Similar properties */}
      {similar.length > 0 && (
        <div className="mt-16">
          <h2
            className="text-2xl font-bold mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Similar Properties
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similar.map((p) => (
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
          </div>
        </div>
      )}
    </div>
  );
}
