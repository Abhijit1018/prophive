import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  lat: z.coerce.number(),
  lng: z.coerce.number(),
  radiusKm: z.coerce.number().default(10),
});

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const parsed = schema.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) return NextResponse.json({ error: "Invalid params" }, { status: 400 });

  const { lat, lng, radiusKm } = parsed.data;
  const delta = radiusKm / 111;

  const properties = await prisma.property.findMany({
    where: {
      status: "ACTIVE",
      lat: { gte: lat - delta, lte: lat + delta },
      lng: { gte: lng - delta, lte: lng + delta },
    },
    include: { images: { where: { isPrimary: true }, take: 1 } },
  });

  const nearby = properties
    .filter((p) => p.lat != null && p.lng != null && haversineKm(lat, lng, p.lat, p.lng) <= radiusKm)
    .map((p) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      mode: p.mode,
      lat: p.lat!,
      lng: p.lng!,
      imageUrl: p.images[0]?.url ?? "/placeholder.jpg",
      distanceKm: haversineKm(lat, lng, p.lat!, p.lng!),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm);

  return NextResponse.json({ properties: nearby });
}
