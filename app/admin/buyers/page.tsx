import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Heart, MessageSquare } from "lucide-react";

export default async function AdminBuyersPage() {
  const buyers = await prisma.user.findMany({
    where: { role: "BUYER" },
    include: {
      subscriptions: { where: { status: "ACTIVE", endAt: { gt: new Date() } }, take: 1 },
      inquiries: { select: { id: true } },
      savedProperties: { select: { propertyId: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalInquiries = buyers.reduce((n, b) => n + b.inquiries.length, 0);
  const totalSaved = buyers.reduce((n, b) => n + b.savedProperties.length, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
          Buyer Management
        </h1>
        <p className="text-sm text-gray-400 mt-1">{buyers.length} registered buyers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 flex items-center gap-3">
          <ShoppingBag className="h-5 w-5 text-purple-600" />
          <div>
            <p className="text-xl font-bold">{buyers.length}</p>
            <p className="text-xs text-gray-400">Total Buyers</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 flex items-center gap-3">
          <MessageSquare className="h-5 w-5 text-blue-600" />
          <div>
            <p className="text-xl font-bold">{totalInquiries}</p>
            <p className="text-xs text-gray-400">Total Inquiries</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 flex items-center gap-3">
          <Heart className="h-5 w-5 text-rose-600" />
          <div>
            <p className="text-xl font-bold">{totalSaved}</p>
            <p className="text-xs text-gray-400">Saved Properties</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left px-6 py-3 font-medium text-gray-400 text-xs uppercase tracking-wider">Buyer</th>
                <th className="text-left px-6 py-3 font-medium text-gray-400 text-xs uppercase tracking-wider">Plan</th>
                <th className="text-left px-6 py-3 font-medium text-gray-400 text-xs uppercase tracking-wider">Inquiries</th>
                <th className="text-left px-6 py-3 font-medium text-gray-400 text-xs uppercase tracking-wider">Saved</th>
                <th className="text-left px-6 py-3 font-medium text-gray-400 text-xs uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody>
              {buyers.map((b) => (
                <tr key={b.id} className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {b.name[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{b.name}</p>
                        <p className="text-xs text-gray-400">{b.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    {b.subscriptions[0] ? (
                      <Badge className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-0 text-xs">
                        {b.subscriptions[0].planName}
                      </Badge>
                    ) : <span className="text-gray-400 text-xs">Free</span>}
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="text-sm font-medium">{b.inquiries.length}</span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="text-sm font-medium">{b.savedProperties.length}</span>
                  </td>
                  <td className="px-6 py-3.5 text-gray-400 text-sm">
                    {new Date(b.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
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
