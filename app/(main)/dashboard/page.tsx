import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      sellerProfile: true,
      buyerProfile: true,
      properties: {
        include: {
          images: { where: { isPrimary: true }, take: 1 },
          inquiries: {
            include: { buyer: { select: { name: true, email: true } } },
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      subscriptions: {
        orderBy: { startAt: "desc" },
        take: 5,
      },
      coupons: {
        where: { isUsed: false, expiresAt: { gt: new Date() } },
        take: 1,
      },
      savedProperties: {
        include: {
          property: {
            include: { images: { where: { isPrimary: true }, take: 1 } },
          },
        },
      },
      inquiries: {
        include: {
          property: {
            include: { images: { where: { isPrimary: true }, take: 1 } },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!user) redirect("/login");

  // Serialize dates for client component
  const serialized = JSON.parse(JSON.stringify(user));

  return (
    <DashboardClient
      user={serialized}
      role={session.user.role}
    />
  );
}
