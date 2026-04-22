import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Maximize2, BedDouble, Lock, Sparkles } from "lucide-react";

type PropertyCardProps = {
  id: string;
  title: string;
  price: number;
  mode: string;
  type: string;
  city: string;
  address: string;
  bhk: number | null;
  area: number;
  imageUrl: string;
  isFeatured: boolean;
  canViewContact: boolean;
};

export default function PropertyCard({
  id, title, price, mode, city, address,
  bhk, area, imageUrl, isFeatured, canViewContact,
}: PropertyCardProps) {
  const formattedPrice =
    mode === "RENT"
      ? `₹${price.toLocaleString("en-IN")}/mo`
      : `₹${(price / 100000).toFixed(1)}L`;

  return (
    <div className="group bg-white dark:bg-gray-800/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-500 border border-gray-100 dark:border-gray-700/50 hover:-translate-y-1">
      <Link href={`/property/${id}`} className="block relative h-56 overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {isFeatured && (
            <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-md shadow-orange-500/25">
              <Sparkles className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>
        <Badge className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-800 dark:text-gray-200 font-semibold border-0 shadow-md">
          {mode === "SALE" ? "Buy" : "Rent"}
        </Badge>

        {/* Bottom info on hover */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <p className="text-white text-sm font-medium truncate drop-shadow-lg">
            View Details →
          </p>
        </div>
      </Link>

      <div className="p-5">
        <p
          className="text-2xl font-bold text-orange-600 mb-1"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {formattedPrice}
        </p>
        <Link href={`/property/${id}`}>
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 hover:text-orange-600 transition-colors line-clamp-1 text-base">
            {title}
          </h3>
        </Link>
        <div className="flex items-center gap-3 mt-3 text-sm text-gray-500 dark:text-gray-400">
          {bhk && (
            <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-700/50 px-2.5 py-1 rounded-lg">
              <BedDouble className="h-3.5 w-3.5 text-orange-500" /> {bhk} BHK
            </span>
          )}
          <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-700/50 px-2.5 py-1 rounded-lg">
            <Maximize2 className="h-3.5 w-3.5 text-orange-500" /> {area} sq.ft
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-3 text-sm text-gray-400">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-orange-400" />
          <span className="line-clamp-1">{city} · {address}</span>
        </div>
        <div className="mt-4">
          {canViewContact ? (
            <Button
              asChild
              size="sm"
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 transition-all"
            >
              <Link href={`/property/${id}#contact`}>View Contact</Link>
            </Button>
          ) : (
            <Button size="sm" variant="outline" className="w-full border-gray-200 dark:border-gray-700 hover:border-orange-500 hover:text-orange-600 transition-all" asChild>
              <Link href="/pricing">
                <Lock className="h-3.5 w-3.5 mr-1.5" /> Unlock Contact
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
