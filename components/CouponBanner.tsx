import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Tag } from "lucide-react";

export default async function CouponBanner() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const coupon = await prisma.coupon.findFirst({
    where: { userId: session.user.id, isUsed: false, expiresAt: { gt: new Date() } },
  });
  if (!coupon) return null;

  return (
    <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-2xl p-4 flex items-start gap-3">
      <Tag className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-orange-700 dark:text-orange-300">
          You&apos;re one of our first 100 users!
        </p>
        <p className="text-sm text-orange-600 dark:text-orange-400">
          Use code{" "}
          <strong className="font-mono bg-orange-100 dark:bg-orange-800 px-1.5 py-0.5 rounded">
            {coupon.code}
          </strong>{" "}
          for <strong>30% off</strong> your first subscription. Expires{" "}
          {new Date(coupon.expiresAt).toLocaleDateString("en-IN")}.
        </p>
      </div>
    </div>
  );
}
