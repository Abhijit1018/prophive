import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({ propertyId: z.string() });

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as unknown;
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const existing = await prisma.savedProperty.findUnique({
    where: { userId_propertyId: { userId: session.user.id, propertyId: parsed.data.propertyId } },
  });

  if (existing) {
    await prisma.savedProperty.delete({
      where: { userId_propertyId: { userId: session.user.id, propertyId: parsed.data.propertyId } },
    });
    return NextResponse.json({ saved: false });
  }

  await prisma.savedProperty.create({
    data: { userId: session.user.id, propertyId: parsed.data.propertyId },
  });
  return NextResponse.json({ saved: true });
}
