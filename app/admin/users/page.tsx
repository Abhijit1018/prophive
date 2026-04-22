import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import AdminUserActions from "./AdminUserActions";
import { Users, Shield, UserCheck } from "lucide-react";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      subscriptions: { where: { status: "ACTIVE", endAt: { gt: new Date() } }, take: 1 },
    },
  });

  const admins = users.filter(u => u.role === "ADMIN").length;
  const sellers = users.filter(u => u.role === "SELLER").length;
  const buyers = users.filter(u => u.role === "BUYER").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            User Management
          </h1>
          <p className="text-sm text-gray-400 mt-1">{users.length} total users on the platform</p>
        </div>
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
            <Shield className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{admins}</p>
            <p className="text-xs text-gray-400">Admins</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
            <UserCheck className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{sellers}</p>
            <p className="text-xs text-gray-400">Sellers</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{buyers}</p>
            <p className="text-xs text-gray-400">Buyers</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left px-6 py-3 font-medium text-gray-400 text-xs uppercase tracking-wider">User</th>
                <th className="text-left px-6 py-3 font-medium text-gray-400 text-xs uppercase tracking-wider">Role</th>
                <th className="text-left px-6 py-3 font-medium text-gray-400 text-xs uppercase tracking-wider">Plan</th>
                <th className="text-left px-6 py-3 font-medium text-gray-400 text-xs uppercase tracking-wider">Joined</th>
                <th className="text-left px-6 py-3 font-medium text-gray-400 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300 flex-shrink-0">
                        {user.name[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        user.role === "SELLER" ? "border-emerald-500 text-emerald-600" :
                        user.role === "ADMIN" ? "border-orange-500 text-orange-600" :
                        "border-blue-500 text-blue-600"
                      }`}
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-3.5">
                    {user.subscriptions[0] ? (
                      <Badge className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-0 text-xs">
                        {user.subscriptions[0].planName}
                      </Badge>
                    ) : (
                      <span className="text-gray-400 text-xs">Free</span>
                    )}
                  </td>
                  <td className="px-6 py-3.5 text-gray-400 text-sm">
                    {new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-6 py-3.5">
                    <AdminUserActions userId={user.id} currentRole={user.role} />
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
