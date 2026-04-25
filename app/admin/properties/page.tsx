import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import PropertyModerationActions from "./PropertyModerationActions";
import Link from "next/link";
import { Home, AlertCircle, Building2 } from "lucide-react";

export default async function AdminPropertiesPage() {
  const [pending, all, totalCount] = await Promise.all([
    prisma.property.findMany({
      where: { status: "PENDING" },
      include: {
        seller: { select: { name: true, email: true } },
        images: { where: { isPrimary: true }, take: 1 },
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.property.findMany({
      include: {
        seller: { select: { name: true } },
        images: { where: { isPrimary: true }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.property.count(),
  ]);

  const statusStyles: Record<string, string> = {
    ACTIVE: "border-emerald-500 text-emerald-600",
    PENDING: "border-amber-500 text-amber-600",
    REJECTED: "border-red-500 text-red-600",
    SOLD: "border-blue-500 text-blue-600",
    RENTED: "border-purple-500 text-purple-600",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
          Property Moderation
        </h1>
        <p className="text-sm text-gray-400 mt-1">{totalCount} properties on the platform</p>
      </div>

      {/* Pending section */}
      {pending.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-200 dark:border-amber-800/30 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <h2 className="font-semibold text-lg text-amber-800 dark:text-amber-400">
              Pending Approval ({pending.length})
            </h2>
          </div>
          <div className="space-y-3">
            {pending.map((p) => (
              <div key={p.id} className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-amber-100 dark:border-amber-800/20">
                <div className="flex items-center gap-4">
                  {p.images[0] ? (
                    <img src={p.images[0].url} alt={p.title} className="h-12 w-16 rounded-lg object-cover flex-shrink-0" />
                  ) : (
                    <div className="h-12 w-16 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <Link href={`/property/${p.id}`} className="font-semibold hover:text-orange-600 transition-colors truncate block">{p.title}</Link>
                    <p className="text-sm text-gray-400">{p.city} · ₹{p.price.toLocaleString("en-IN")} · by {p.seller.name}</p>
                  </div>
                  <div className="flex-shrink-0 hidden sm:block">
                    <PropertyModerationActions propertyId={p.id} currentStatus={p.status} />
                  </div>
                </div>
                <div className="sm:hidden mt-3 pt-3 border-t border-amber-100 dark:border-amber-800/20 flex justify-end">
                  <PropertyModerationActions propertyId={p.id} currentStatus={p.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All properties */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-semibold text-lg">All Properties (recent 50)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left px-6 py-3 font-medium text-gray-400 text-xs uppercase tracking-wider">Property</th>
                <th className="text-left px-6 py-3 font-medium text-gray-400 text-xs uppercase tracking-wider">Seller</th>
                <th className="text-left px-6 py-3 font-medium text-gray-400 text-xs uppercase tracking-wider">City</th>
                <th className="text-left px-6 py-3 font-medium text-gray-400 text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 font-medium text-gray-400 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {all.map((p) => (
                <tr key={p.id} className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      {p.images[0] ? (
                        <img src={p.images[0].url} alt={p.title} className="h-8 w-12 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="h-8 w-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                          <Home className="h-3 w-3 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <Link href={`/property/${p.id}`} className="font-medium hover:text-orange-600 transition-colors truncate block max-w-[200px]">{p.title}</Link>
                        <p className="text-xs text-gray-400">₹{p.price.toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-gray-500">{p.seller.name}</td>
                  <td className="px-6 py-3.5">{p.city}</td>
                  <td className="px-6 py-3.5">
                    <Badge variant="outline" className={`text-xs ${statusStyles[p.status] ?? ""}`}>
                      {p.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-3.5">
                    <PropertyModerationActions propertyId={p.id} currentStatus={p.status} />
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
