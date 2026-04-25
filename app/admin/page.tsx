import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import RevenueChart from "./RevenueChart";
import {
  Users, Store, ShoppingBag, IndianRupee, TrendingUp, Building2,
  Eye, ArrowUpRight, Clock, AlertCircle, CheckCircle2, ChevronRight
} from "lucide-react";

async function getStats() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [
    totalUsers, activeSellers, activeBuyers,
    monthlyRevenue, totalProperties, pendingProperties,
    activeProperties, totalInquiries,
    recentSignups, recentProperties, revRows
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "SELLER" } }),
    prisma.user.count({ where: { role: "BUYER" } }),
    prisma.subscription.aggregate({
      where: { status: "ACTIVE", startAt: { gte: startOfMonth } },
      _sum: { amount: true },
    }),
    prisma.property.count(),
    prisma.property.count({ where: { status: "PENDING" } }),
    prisma.property.count({ where: { status: "ACTIVE" } }),
    prisma.inquiry.count(),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    }),
    prisma.property.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        seller: { select: { name: true } },
        images: { where: { isPrimary: true }, take: 1 },
      },
    }),
    prisma.subscription.findMany({
      where: { startAt: { gte: sixMonthsAgo } },
      select: { startAt: true, amount: true },
    }),
  ]);

  const monthlyData: Record<string, number> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthlyData[d.toLocaleString("en-IN", { month: "short", year: "2-digit" })] = 0;
  }
  for (const row of revRows) {
    const key = new Date(row.startAt).toLocaleString("en-IN", { month: "short", year: "2-digit" });
    if (key in monthlyData) monthlyData[key] += row.amount;
  }

  return {
    totalUsers, activeSellers, activeBuyers,
    monthlyRevenue: monthlyRevenue._sum.amount ?? 0,
    totalProperties, pendingProperties, activeProperties, totalInquiries,
    recentSignups, recentProperties,
    revenueChart: Object.entries(monthlyData).map(([month, revenue]) => ({ month, revenue })),
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "from-blue-500 to-blue-600", href: "/admin/users" },
    { label: "Active Sellers", value: stats.activeSellers, icon: Store, color: "from-emerald-500 to-emerald-600", href: "/admin/sellers" },
    { label: "Active Buyers", value: stats.activeBuyers, icon: ShoppingBag, color: "from-purple-500 to-purple-600", href: "/admin/buyers" },
    { label: "Revenue (month)", value: `₹${stats.monthlyRevenue.toLocaleString("en-IN")}`, icon: IndianRupee, color: "from-orange-500 to-orange-600", href: "/admin/subscriptions" },
  ];

  const overviewCards = [
    { label: "Total Properties", value: stats.totalProperties, icon: Building2 },
    { label: "Active Listings", value: stats.activeProperties, icon: CheckCircle2 },
    { label: "Pending Approval", value: stats.pendingProperties, icon: Clock, alert: stats.pendingProperties > 0 },
    { label: "Total Inquiries", value: stats.totalInquiries, icon: Eye },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            Admin Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Overview of your platform&apos;s performance
          </p>
        </div>
        <div className="hidden sm:block text-sm text-gray-400 text-right flex-shrink-0">
          {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </div>
      </div>

      {/* Pending alert */}
      {stats.pendingProperties > 0 && (
        <Link
          href="/admin/properties"
          className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl p-4 hover:bg-amber-100 dark:hover:bg-amber-900/20 transition-colors"
        >
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-400">
              {stats.pendingProperties} {stats.pendingProperties === 1 ? "property" : "properties"} awaiting approval
            </p>
            <p className="text-xs text-amber-600/70 dark:text-amber-400/50">Click to review and moderate</p>
          </div>
          <ChevronRight className="h-4 w-4 text-amber-600" />
        </Link>
      )}

      {/* Main stat cards — gradient icons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map(({ label, value, icon: Icon, color, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors" />
            </div>
            <p className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
              {typeof value === "number" ? value.toLocaleString("en-IN") : value}
            </p>
            <p className="text-sm text-gray-400 mt-1">{label}</p>
          </Link>
        ))}
      </div>

      {/* Overview mini-stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewCards.map(({ label, value, icon: Icon, alert }) => (
          <div
            key={label}
            className={`rounded-xl p-4 border ${
              alert
                ? "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/30"
                : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon className={`h-5 w-5 ${alert ? "text-amber-600" : "text-gray-400"}`} />
              <div>
                <p className="text-xl font-bold">{value.toLocaleString("en-IN")}</p>
                <p className="text-xs text-gray-400">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue chart + Recent properties = 2 col grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue chart — 2/3 width */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-lg">Revenue Overview</h2>
              <p className="text-xs text-gray-400 mt-0.5">Last 6 months performance</p>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10 px-2.5 py-1 rounded-lg">
              <TrendingUp className="h-3.5 w-3.5" />
              Active
            </div>
          </div>
          <RevenueChart data={stats.revenueChart} />
        </div>

        {/* Recent properties — 1/3 width */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-lg">Recent Listings</h2>
            <Link href="/admin/properties" className="text-xs text-orange-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {stats.recentProperties.map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                {p.images[0] ? (
                  <img
                    src={p.images[0].url}
                    alt={p.title}
                    className="h-10 w-14 rounded-lg object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="h-10 w-14 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-4 w-4 text-gray-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.title}</p>
                  <p className="text-xs text-gray-400">{p.city} · by {p.seller.name}</p>
                </div>
                <Badge
                  variant="outline"
                  className={`text-[10px] px-1.5 py-0 ${
                    p.status === "ACTIVE" ? "border-emerald-500 text-emerald-600" :
                    p.status === "PENDING" ? "border-amber-500 text-amber-600" :
                    "border-gray-400 text-gray-500"
                  }`}
                >
                  {p.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent signups table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="font-semibold text-lg">Recent Signups</h2>
            <p className="text-xs text-gray-400 mt-0.5">Latest platform registrations</p>
          </div>
          <Link href="/admin/users" className="text-xs text-orange-600 hover:underline">
            View all users
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left px-6 py-3 font-medium text-gray-400 text-xs uppercase tracking-wider">User</th>
                <th className="text-left px-6 py-3 font-medium text-gray-400 text-xs uppercase tracking-wider">Role</th>
                <th className="text-left px-6 py-3 font-medium text-gray-400 text-xs uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentSignups.map((u) => (
                <tr key={u.id} className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300 flex-shrink-0">
                        {u.name[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{u.name}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        u.role === "SELLER" ? "border-emerald-500 text-emerald-600" :
                        u.role === "ADMIN" ? "border-orange-500 text-orange-600" :
                        "border-blue-500 text-blue-600"
                      }`}
                    >
                      {u.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-3.5 text-gray-400 text-sm">
                    {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
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
