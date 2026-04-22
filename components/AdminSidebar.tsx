"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Store, ShoppingBag, CreditCard,
  Tag, Home, LogOut, ArrowLeft, Building2, ChevronRight, Shield
} from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/sellers", label: "Sellers", icon: Store },
  { href: "/admin/buyers", label: "Buyers", icon: ShoppingBag },
  { href: "/admin/properties", label: "Properties", icon: Home },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
  { href: "/admin/coupons", label: "Coupons", icon: Tag },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-gray-950 text-gray-100 flex flex-col border-r border-gray-800/50">
      {/* Branding */}
      <div className="px-6 py-5 border-b border-gray-800/50">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-lg font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              PropHive
            </p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium flex items-center gap-1">
              <Shield className="h-2.5 w-2.5" /> Admin Panel
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="text-[10px] text-gray-600 uppercase tracking-wider font-semibold px-3 mb-2">
          Main Menu
        </p>
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-md shadow-orange-500/20"
                  : "text-gray-400 hover:bg-gray-800/60 hover:text-gray-100"
              }`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="h-3.5 w-3.5 opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer actions */}
      <div className="px-3 py-4 border-t border-gray-800/50 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-gray-800/60 hover:text-gray-300 w-full transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Website
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-red-900/20 hover:text-red-400 w-full transition-all"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
