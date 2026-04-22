import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sendInquiryEmail } from "@/lib/email";

const schema = z.object({
  propertyId: z.string(),
  message: z.string().min(10),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as unknown;
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const property = await prisma.property.findUnique({
    where: { id: parsed.data.propertyId },
    include: { seller: { select: { name: true, email: true } } },
  });
  if (!property) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const inquiry = await prisma.inquiry.create({
    data: { buyerId: session.user.id, propertyId: parsed.data.propertyId, message: parsed.data.message },
    include: { buyer: { select: { name: true } } },
  });

  sendInquiryEmail(
    property.seller.name ?? "",
    property.seller.email,
    inquiry.buyer.name ?? "",
    property.title,
    parsed.data.message
  ).catch(() => {});

  return NextResponse.json(inquiry, { status: 201 });
}
