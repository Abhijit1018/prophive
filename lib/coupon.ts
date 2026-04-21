import { prisma } from "@/lib/prisma";

export async function generateEarlyCoupon(userId: string, userNumber: number) {
  if (userNumber > 100) return null;

  const code = `EARLY${userNumber}`;
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  return prisma.coupon.create({
    data: { code, userId, discountPct: 30, expiresAt },
  });
}

export async function getUserCoupon(userId: string) {
  return prisma.coupon.findFirst({
    where: { userId, isUsed: false, expiresAt: { gt: new Date() } },
  });
}

export async function markCouponUsed(code: string) {
  return prisma.coupon.update({ where: { code }, data: { isUsed: true } });
}
