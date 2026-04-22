"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

const CITIES = ["Jaipur", "Delhi", "Gurugram"];
const TYPES = ["APARTMENT", "VILLA", "PLOT", "COMMERCIAL", "PG_HOSTEL"];
const BHK_OPTIONS = [1, 2, 3, 4, 5];

export default function SearchBar({ defaultMode }: { defaultMode?: "SALE" | "RENT" }) {
  const router = useRouter();
  const params = useSearchParams();

  const [keyword, setKeyword] = useState(params.get("keyword") ?? "");
  const [city, setCity] = useState(params.get("city") ?? "");
  const [type, setType] = useState(params.get("type") ?? "");
  const [bhk, setBhk] = useState(params.get("bhk") ?? "");
  const [minPrice, setMinPrice] = useState(params.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(params.get("maxPrice") ?? "");
  const [sort, setSort] = useState(params.get("sort") ?? "newest");

  function handleSearch() {
    const p = new URLSearchParams();
    if (keyword) p.set("keyword", keyword);
    if (city) p.set("city", city);
    if (type) p.set("type", type);
    if (bhk) p.set("bhk", bhk);
    if (minPrice) p.set("minPrice", minPrice);
    if (maxPrice) p.set("maxPrice", maxPrice);
    if (sort) p.set("sort", sort);
    if (defaultMode) p.set("mode", defaultMode);
    router.push(`?${p.toString()}`);
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 border border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        <Input
          placeholder="Search keyword..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Select value={city} onValueChange={(v) => setCity(v ?? "")}>
          <SelectTrigger>
            <SelectValue placeholder="City" />
          </SelectTrigger>
          <SelectContent>
            {CITIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={type} onValueChange={(v) => setType(v ?? "")}>
          <SelectTrigger>
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent>
            {TYPES.map((t) => (
              <SelectItem key={t} value={t}>{t.replace("_", " ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={bhk} onValueChange={(v) => setBhk(v ?? "")}>
          <SelectTrigger>
            <SelectValue placeholder="BHK" />
          </SelectTrigger>
          <SelectContent>
            {BHK_OPTIONS.map((b) => (
              <SelectItem key={b} value={String(b)}>{b} BHK</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-wrap gap-3 items-center">
        <Input
          className="w-36"
          placeholder="Min Price (₹)"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <Input
          className="w-36"
          placeholder="Max Price (₹)"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <Select value={sort} onValueChange={(v) => setSort(v ?? "newest")}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price_asc">Price: Low → High</SelectItem>
            <SelectItem value="price_desc">Price: High → Low</SelectItem>
            <SelectItem value="most_viewed">Most Viewed</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={handleSearch}
          className="bg-orange-600 hover:bg-orange-700 text-white ml-auto"
        >
          <Search className="h-4 w-4 mr-2" /> Search
        </Button>
      </div>
    </div>
  );
}
