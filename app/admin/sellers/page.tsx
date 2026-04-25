import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Store, Building2, CheckCircle2, Clock } from "lucide-react";

export default async function AdminSellersPage() {
  const sellers = await prisma.user.findMany({
    where: { role: "SELLER" },
    include: {
      sellerProfile: true,
      properties: { select: { id: true, status: true } },
      subscriptions: { where: { status: "ACTIVE", endAt: { gt: new Date() } }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalActive = sellers.reduce((n, s) => n + s.properties.filter(p => p.status === "ACTIVE").length, 0);
  const totalPending = sellers.reduce((n, s) => n + s.properties.filter(p => p.status === "PENDING").length, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
          Seller Management
        </h1>
        <p className="text-sm text-gray-400 mt-1">{sellers.length} registered sellers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 flex items-center gap-3">
          <Store className="h-5 w-5 text-emerald-600" />
          <div>
            <p className="text-xl font-bold">{sellers.length}</p>
            <p className="text-xs text-gray-400">Total Sellers</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-blue-600" />
          <div>
            <p className="text-xl font-bold">{totalActive}</p>
            <p className="text-xs text-gray-400">Active Listings</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 flex items-center gap-3">
          <Clock className="h-5 w-5 text-amber-600" />
          <div>
            <p className="text-xl font-bold">{totalPending}</p>
            <p className="text-xs text-gray-400">Pending Review</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left px-6 py-3 font-medium text-gray-400 text-xs uppercase tracking-wider">Seller</th>
                <th className="text-left px-6 py-3 font-medium text-gray-400 text-xs uppercase tracking-wider">Agency</th>
                <th className="text-left px-6 py-3 font-medium text-gray-400 text-xs uppercase tracking-wider">Listings</th>
                <th className="text-left px-6 py-3 font-medium text-gray-400 text-xs uppercase tracking-wider">Plan</th>
                <th className="text-left px-6 py-3 font-medium text-gray-400 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((s) => (
                <tr key={s.id} className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {s.name[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{s.name}</p>
                        <p className="text-xs text-gray-400">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-gray-400" />
                      <span className="text-sm">{s.sellerProfile?.agency ?? <span className="text-gray-400 italic">—</span>}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex gap-1.5 flex-wrap">
                      <span className="text-xs bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full font-medium">
                        {s.properties.filter((p) => p.status === "ACTIVE").length} Active
                      </span>
                      {s.properties.filter((p) => p.status === "PENDING").length > 0 && (
                        <span className="text-xs bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full font-medium">
                          {s.properties.filter((p) => p.status === "PENDING").length} Pending
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    {s.subscriptions[0] ? (
                      <Badge className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-0 text-xs">
                        {s.subscriptions[0].planName}
                      </Badge>
                    ) : <span className="text-gray-400 text-xs">Free</span>}
                  </td>
                  <td className="px-6 py-3.5">
                    <Link href={`/admin/sellers/${s.id}`} className="text-orange-600 hover:underline text-xs font-medium">
                      View Details →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
