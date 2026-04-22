import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const querySchema = z.object({
  city: z.string().optional(),
  type: z.string().optional(),
  mode: z.enum(["SALE", "RENT"]).optional(),
  bhk: z.coerce.number().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  minArea: z.coerce.number().optional(),
  maxArea: z.coerce.number().optional(),
  keyword: z.string().optional(),
  sort: z.enum(["price_asc", "price_desc", "newest", "most_viewed"]).optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(12),
});

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const params = Object.fromEntries(url.searchParams);
  const parsed = querySchema.safeParse(params);
  if (!parsed.success) return NextResponse.json({ error: "Invalid params" }, { status: 400 });

  const { city, type, mode, bhk, minPrice, maxPrice, minArea, maxArea, keyword, sort, page, limit } = parsed.data;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { status: "ACTIVE" };
  if (city) where.city = { equals: city, mode: "insensitive" };
  if (type) where.type = type;
  if (mode) where.mode = mode;
  if (bhk) where.bhk = bhk;
  if (minPrice || maxPrice) {
    const priceFilter: Record<string, number> = {};
    if (minPrice) priceFilter.gte = minPrice;
    if (maxPrice) priceFilter.lte = maxPrice;
    where.price = priceFilter;
  }
  if (minArea || maxArea) {
    const areaFilter: Record<string, number> = {};
    if (minArea) areaFilter.gte = minArea;
    if (maxArea) areaFilter.lte = maxArea;
    where.area = areaFilter;
  }
  if (keyword) {
    where.OR = [
      { title: { contains: keyword, mode: "insensitive" } },
      { description: { contains: keyword, mode: "insensitive" } },
      { address: { contains: keyword, mode: "insensitive" } },
    ];
  }

  const orderBy =
    sort === "price_asc" ? { price: "asc" as const } :
    sort === "price_desc" ? { price: "desc" as const } :
    sort === "most_viewed" ? { viewCount: "desc" as const } :
    { createdAt: "desc" as const };

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: { images: { where: { isPrimary: true }, take: 1 } },
    }),
    prisma.property.count({ where }),
  ]);

  return NextResponse.json({
    properties: properties.map((p) => ({
      ...p,
      imageUrl: p.images[0]?.url ?? "/placeholder.jpg",
    })),
    total,
    pages: Math.ceil(total / limit),
  });
}

const createSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  type: z.enum(["APARTMENT", "VILLA", "PLOT", "COMMERCIAL", "PG_HOSTEL"]),
  mode: z.enum(["SALE", "RENT"]),
  price: z.number().positive(),
  area: z.number().positive(),
  bhk: z.number().optional(),
  furnishing: z.enum(["FURNISHED", "SEMI_FURNISHED", "UNFURNISHED"]).optional(),
  city: z.string(),
  address: z.string(),
  pincode: z.string(),
  landmark: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  images: z
    .array(z.object({ url: z.string().url(), isPrimary: z.boolean() }))
    .optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "SELLER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { images, ...data } = parsed.data;

  const property = await prisma.property.create({
    data: {
      ...data,
      sellerId: session.user.id,
      status: "PENDING",
      images: images ? { create: images } : undefined,
    },
  });

  return NextResponse.json(property, { status: 201 });
}
