import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import CreateCouponForm from "./CreateCouponForm";
import { Tag, TicketPercent, CheckCircle2 } from "lucide-react";

export default async function AdminCouponsPage() {
  const [coupons, users] = await Promise.all([
    prisma.coupon.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { expiresAt: "desc" },
    }),
    prisma.user.findMany({ select: { id: true, name: true, email: true }, orderBy: { name: "asc" } }),
  ]);

  const activeCoupons = coupons.filter(c => !c.isUsed && new Date(c.expiresAt) > new Date()).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
          Coupon Management
        </h1>
        <p className="text-sm text-gray-400 mt-1">{coupons.length} total coupons · {activeCoupons} active</p>
      </div>

      {/* Create form */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 mb-5">
          <div className="h-9 w-9 rounded-xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
            <TicketPercent className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Create Custom Coupon</h2>
            <p className="text-xs text-gray-400">Assign a discount coupon to a user</p>
          </div>
        </div>
        <CreateCouponForm users={users} />
      </div>

      {/* Coupons table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left px-6 py-3 font-medium text-gray-400 text-xs uppercase tracking-wider">Code</th>
                <th className="text-left px-6 py-3 font-medium text-gray-400 text-xs uppercase tracking-wider">User</th>
                <th className="text-left px-6 py-3 font-medium text-gray-400 text-xs uppercase tracking-wider">Discount</th>
                <th className="text-left px-6 py-3 font-medium text-gray-400 text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 font-medium text-gray-400 text-xs uppercase tracking-wider">Expires</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => {
                const isExpired = new Date(c.expiresAt) < new Date();
                return (
                  <tr key={c.id} className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <Tag className="h-3.5 w-3.5 text-orange-500" />
                        <span className="font-mono font-bold text-orange-600 tracking-wider">{c.code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-300 flex-shrink-0">
                          {c.user.name[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{c.user.name}</p>
                          <p className="text-xs text-gray-400">{c.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="text-lg font-bold text-orange-600">{c.discountPct}%</span>
                    </td>
                    <td className="px-6 py-3.5">
                      {c.isUsed ? (
                        <Badge className="bg-gray-100 dark:bg-gray-800 text-gray-500 border-0 text-xs flex items-center gap-1 w-fit">
                          <CheckCircle2 className="h-3 w-3" /> Used
                        </Badge>
                      ) : isExpired ? (
                        <Badge className="bg-red-50 dark:bg-red-900/10 text-red-600 border-0 text-xs">Expired</Badge>
                      ) : (
                        <Badge className="bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 border-0 text-xs">Active</Badge>
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-gray-400 text-sm">
                      {new Date(c.expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
