import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import RevenueChart from "../RevenueChart";
import { CreditCard, TrendingUp, IndianRupee } from "lucide-react";

async function getRevenueChart() {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const rows = await prisma.subscription.findMany({
    where: { startAt: { gte: sixMonthsAgo } },
    select: { startAt: true, amount: true },
  });
  const monthlyData: Record<string, number> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthlyData[d.toLocaleString("en-IN", { month: "short", year: "2-digit" })] = 0;
  }
  for (const r of rows) {
    const key = new Date(r.startAt).toLocaleString("en-IN", { month: "short", year: "2-digit" });
    if (key in monthlyData) monthlyData[key] += r.amount;
  }
  return Object.entries(monthlyData).map(([month, revenue]) => ({ month, revenue }));
}

export default async function AdminSubscriptionsPage() {
  const [subscriptions, chartData] = await Promise.all([
    prisma.subscription.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { startAt: "desc" },
      take: 100,
    }),
    getRevenueChart(),
  ]);

  const active = subscriptions.filter(s => s.status === "ACTIVE").length;
  const totalRevenue = subscriptions.reduce((n, s) => n + s.amount, 0);

  const statusStyles: Record<string, string> = {
    ACTIVE: "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 border-0",
    CANCELLED: "bg-gray-100 dark:bg-gray-800 text-gray-500 border-0",
    EXPIRED: "bg-gray-100 dark:bg-gray-800 text-gray-500 border-0",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
          Subscription Management
        </h1>
        <p className="text-sm text-gray-400 mt-1">{subscriptions.length} total subscriptions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 flex items-center gap-3">
          <CreditCard className="h-5 w-5 text-emerald-600" />
          <div>
            <p className="text-xl font-bold">{active}</p>
            <p className="text-xs text-gray-400">Active Plans</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 flex items-center gap-3">
          <IndianRupee className="h-5 w-5 text-orange-600" />
          <div>
            <p className="text-xl font-bold">₹{(totalRevenue / 100).toLocaleString("en-IN")}</p>
            <p className="text-xs text-gray-400">Total Revenue</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 flex items-center gap-3">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <div>
            <p className="text-xl font-bold">{subscriptions.length}</p>
            <p className="text-xs text-gray-400">All Time</p>
          </div>
        </div>
      </div>

      {/* Revenue chart */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-semibold text-lg">Revenue Overview</h2>
            <p className="text-xs text-gray-400 mt-0.5">Last 6 months</p>
          </div>
        </div>
        <RevenueChart data={chartData} />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left px-6 py-3 font-medium text-gray-400 text-xs uppercase tracking-wider">User</th>
                <th className="text-left px-6 py-3 font-medium text-gray-400 text-xs uppercase tracking-wider">Plan</th>
                <th className="text-left px-6 py-3 font-medium text-gray-400 text-xs uppercase tracking-wider">Amount</th>
                <th className="text-left px-6 py-3 font-medium text-gray-400 text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 font-medium text-gray-400 text-xs uppercase tracking-wider">Period</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((s) => (
                <tr key={s.id} className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {s.user.name[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{s.user.name}</p>
                        <p className="text-xs text-gray-400">{s.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 font-medium">{s.planName}</td>
                  <td className="px-6 py-3.5">₹{(s.amount / 100).toLocaleString("en-IN")}</td>
                  <td className="px-6 py-3.5">
                    <Badge className={`text-xs ${statusStyles[s.status] ?? statusStyles.EXPIRED}`}>
                      {s.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-3.5 text-gray-400 text-sm">
                    {new Date(s.startAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} → {new Date(s.endAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
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
