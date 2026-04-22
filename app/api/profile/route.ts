import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET — return current user's profile data
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      sellerProfile: true,
      buyerProfile: true,
    },
  });

  return NextResponse.json(user);
}

// PUT — update profile
export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, phone, bio, agency, preferredCities, budgetMin, budgetMax } = body;

  // Update base user fields
  const updateData: Record<string, unknown> = {};
  if (name && typeof name === "string" && name.trim()) updateData.name = name.trim();
  if (typeof phone === "string") updateData.phone = phone.trim() || null;

  await prisma.user.update({
    where: { id: session.user.id },
    data: updateData,
  });

  // Update role-specific profile
  if (session.user.role === "SELLER") {
    await prisma.sellerProfile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        bio: bio || null,
        agency: agency || null,
      },
      update: {
        bio: bio || null,
        agency: agency || null,
      },
    });
  }

  if (session.user.role === "BUYER") {
    await prisma.buyerProfile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        preferredCities: preferredCities || "",
        budgetMin: budgetMin ? parseFloat(budgetMin) : null,
        budgetMax: budgetMax ? parseFloat(budgetMax) : null,
      },
      update: {
        preferredCities: preferredCities || "",
        budgetMin: budgetMin ? parseFloat(budgetMin) : null,
        budgetMax: budgetMax ? parseFloat(budgetMax) : null,
      },
    });
  }

  return NextResponse.json({ ok: true });
}
