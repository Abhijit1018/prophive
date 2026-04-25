"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import ListingActions from "./ListingActions";
import {
  User, Package, Heart, CreditCard, Settings,
  MapPin, Phone, Mail, Calendar, Building2,
  ChevronRight, Edit3, Save, X, Crown, Shield,
  Eye, MessageSquare, Plus, Sparkles, Tag
} from "lucide-react";

// ─────────────── types ───────────────
type DashboardProps = {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: string;
    createdAt: string;
    sellerProfile: { bio: string | null; agency: string | null } | null;
    buyerProfile: { preferredCities: string; budgetMin: number | null; budgetMax: number | null } | null;
    properties: Array<{
      id: string; title: string; price: number; city: string; status: string;
      viewCount: number; isFeatured: boolean; createdAt: string;
      images: Array<{ url: string }>;
      inquiries: Array<{ id: string; message: string; createdAt: string; buyer: { name: string; email: string } }>;
    }>;
    subscriptions: Array<{
      id: string; planName: string; planType: string; status: string;
      startAt: string; endAt: string; amount: number;
    }>;
    coupons: Array<{ id: string; code: string; discountPct: number; expiresAt: string }>;
    savedProperties: Array<{
      property: { id: string; title: string; price: number; city: string; address: string;
        images: Array<{ url: string }>;
      };
    }>;
    inquiries: Array<{
      id: string; message: string; createdAt: string;
      property: { id: string; title: string; images: Array<{ url: string }> };
    }>;
  };
  role: string;
};

// ─────────────── sidebar items ───────────────
const buyerTabs = [
  { key: "overview", label: "Overview", icon: User },
  { key: "profile", label: "Your Profile", icon: Settings },
  { key: "saved", label: "Saved Properties", icon: Heart },
  { key: "inquiries", label: "My Inquiries", icon: MessageSquare },
  { key: "subscription", label: "Subscription", icon: CreditCard },
];

const sellerTabs = [
  { key: "overview", label: "Overview", icon: User },
  { key: "profile", label: "Your Profile", icon: Settings },
  { key: "listings", label: "My Listings", icon: Package },
  { key: "inquiries", label: "Inquiries", icon: MessageSquare },
  { key: "subscription", label: "Subscription", icon: CreditCard },
];

export default function DashboardClient({ user, role }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const tabs = role === "SELLER" ? sellerTabs : buyerTabs;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Mobile tab selector */}
      <div className="md:hidden mb-6 overflow-x-auto">
        <div className="flex gap-2 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? "bg-orange-600 text-white shadow-md shadow-orange-500/20"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          {/* User card */}
          <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6 mb-4">
            <div className="flex flex-col items-center text-center">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-orange-500/20 mb-3">
                {user.name[0]?.toUpperCase()}
              </div>
              <h3 className="font-semibold text-lg">{user.name}</h3>
              <p className="text-sm text-gray-400 mt-0.5">{user.email}</p>
              <Badge className="mt-2 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-0">
                {role === "SELLER" ? "Seller Account" : "Buyer Account"}
              </Badge>
            </div>
          </div>

          {/* Nav */}
          <nav className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden">
            {tabs.map((tab, i) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-all text-left ${
                  activeTab === tab.key
                    ? "bg-orange-50 dark:bg-orange-900/10 text-orange-600 border-l-3 border-orange-500"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                } ${i > 0 ? "border-t border-gray-100 dark:border-gray-700/50" : ""}`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
                {tab.key === "listings" && user.properties.length > 0 && (
                  <span className="ml-auto text-xs bg-orange-100 dark:bg-orange-900/20 text-orange-600 rounded-full px-2 py-0.5">
                    {user.properties.length}
                  </span>
                )}
                {tab.key === "saved" && user.savedProperties.length > 0 && (
                  <span className="ml-auto text-xs bg-orange-100 dark:bg-orange-900/20 text-orange-600 rounded-full px-2 py-0.5">
                    {user.savedProperties.length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {activeTab === "overview" && <OverviewTab user={user} role={role} setActiveTab={setActiveTab} />}
          {activeTab === "profile" && <ProfileTab user={user} role={role} />}
          {activeTab === "listings" && <ListingsTab user={user} />}
          {activeTab === "saved" && <SavedTab user={user} />}
          {activeTab === "inquiries" && <InquiriesTab user={user} role={role} />}
          {activeTab === "subscription" && <SubscriptionTab user={user} />}
        </main>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// OVERVIEW TAB — Amazon-style grid
// ═══════════════════════════════════════════
function OverviewTab({ user, role, setActiveTab }: DashboardProps & { setActiveTab: (t: string) => void }) {
  const activeSub = user.subscriptions.find(s => s.status === "ACTIVE" && new Date(s.endAt) > new Date());
  const totalInquiries = user.properties.reduce((n, p) => n + p.inquiries.length, 0);
  const totalViews = user.properties.reduce((n, p) => n + p.viewCount, 0);
  const coupon = user.coupons[0];

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <h1 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
          Hello, {user.name.split(" ")[0]}! 👋
        </h1>
        <p className="text-orange-100 mt-2 max-w-md">
          {role === "SELLER"
            ? "Manage your listings, track inquiries, and grow your real estate business."
            : "Track your saved properties, inquiries, and manage your account."}
        </p>
        {!activeSub && (
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 mt-4 bg-white text-orange-600 px-5 py-2 rounded-xl text-sm font-semibold hover:bg-orange-50 transition-colors"
          >
            <Crown className="h-4 w-4" /> Upgrade Plan
          </Link>
        )}
      </div>

      {/* Coupon alert */}
      {coupon && (
        <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800/30 rounded-xl p-4 flex items-center gap-4">
          <Tag className="h-5 w-5 text-orange-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium">
              Early user discount! Use code <strong className="text-orange-600">{coupon.code}</strong> for {coupon.discountPct}% off
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Expires {new Date(coupon.expiresAt).toLocaleDateString("en-IN")}
            </p>
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {role === "SELLER" ? (
          <>
            <StatCard icon={Package} label="Active Listings" value={user.properties.filter(p => p.status === "ACTIVE").length} />
            <StatCard icon={Eye} label="Total Views" value={totalViews} />
            <StatCard icon={MessageSquare} label="Inquiries" value={totalInquiries} />
            <StatCard icon={Sparkles} label="Featured" value={user.properties.filter(p => p.isFeatured).length} />
          </>
        ) : (
          <>
            <StatCard icon={Heart} label="Saved Properties" value={user.savedProperties.length} />
            <StatCard icon={MessageSquare} label="Inquiries Sent" value={user.inquiries.length} />
            <StatCard icon={CreditCard} label="Plan" value={activeSub?.planName ?? "Free"} isText />
            <StatCard icon={Calendar} label="Member Since" value={new Date(user.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })} isText />
          </>
        )}
      </div>

      {/* Quick actions grid (Amazon-style) */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <QuickAction icon={User} label="Edit Profile" desc="Update your details" onClick={() => setActiveTab("profile")} />
        {role === "SELLER" ? (
          <>
            <QuickAction icon={Plus} label="New Listing" desc="Add a property" href="/dashboard/new-listing" />
            <QuickAction icon={Package} label="My Listings" desc={`${user.properties.length} properties`} onClick={() => setActiveTab("listings")} />
          </>
        ) : (
          <>
            <QuickAction icon={Heart} label="Saved" desc={`${user.savedProperties.length} saved`} onClick={() => setActiveTab("saved")} />
            <QuickAction icon={MapPin} label="Browse" desc="Find properties" href="/properties" />
          </>
        )}
        <QuickAction icon={CreditCard} label="Subscription" desc={activeSub?.planName ?? "Free Plan"} onClick={() => setActiveTab("subscription")} />
        <QuickAction icon={MessageSquare} label="Inquiries" desc="View messages" onClick={() => setActiveTab("inquiries")} />
        <QuickAction icon={Shield} label="Security" desc="Account safety" onClick={() => setActiveTab("profile")} />
      </div>

      {/* Subscription card */}
      <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Your Plan</h2>
          <Link href="/pricing" className="text-orange-600 text-sm hover:underline">
            {activeSub ? "Change Plan" : "Upgrade →"}
          </Link>
        </div>
        {activeSub ? (
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-semibold">{activeSub.planName}</p>
              <p className="text-sm text-gray-400">
                Active until {new Date(activeSub.endAt).toLocaleDateString("en-IN")}
              </p>
            </div>
            <Badge className="ml-auto bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-0">
              Active
            </Badge>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <Crown className="h-6 w-6 text-gray-400" />
            </div>
            <div>
              <p className="font-semibold">Free Plan</p>
              <p className="text-sm text-gray-400">Upgrade to unlock all features</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// PROFILE TAB — edit name, phone, address
// ═══════════════════════════════════════════
function ProfileTab({ user, role }: { user: DashboardProps["user"]; role: string }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user.name,
    phone: user.phone ?? "",
    bio: user.sellerProfile?.bio ?? "",
    agency: user.sellerProfile?.agency ?? "",
    preferredCities: user.buyerProfile?.preferredCities ?? "",
    budgetMin: user.buyerProfile?.budgetMin?.toString() ?? "",
    budgetMax: user.buyerProfile?.budgetMax?.toString() ?? "",
  });

  function set(key: string, val: string) {
    setForm(f => ({ ...f, [key]: val }));
  }

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      toast.success("Profile updated successfully!");
      setEditing(false);
      router.refresh();
    } else {
      toast.error("Failed to update profile");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
          Your Profile
        </h2>
        {!editing ? (
          <Button onClick={() => setEditing(true)} variant="outline" size="sm" className="gap-2">
            <Edit3 className="h-4 w-4" /> Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={() => setEditing(false)} variant="ghost" size="sm" className="gap-2">
              <X className="h-4 w-4" /> Cancel
            </Button>
            <Button onClick={handleSave} size="sm" disabled={saving} className="gap-2 bg-orange-600 hover:bg-orange-700 text-white">
              <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>

      {/* Avatar + Role */}
      <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6">
        <div className="flex items-center gap-5">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-orange-500/20 flex-shrink-0">
            {user.name[0]?.toUpperCase()}
          </div>
          <div>
            <h3 className="text-xl font-bold">{user.name}</h3>
            <p className="text-gray-400 text-sm">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-0">
                {role}
              </Badge>
              <span className="text-xs text-gray-400">
                Member since {new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6">
        <h3 className="font-semibold text-lg mb-5 flex items-center gap-2">
          <User className="h-5 w-5 text-orange-500" /> Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <ProfileField
            icon={User} label="Full Name" value={form.name}
            editing={editing} onChange={(v) => set("name", v)}
          />
          <ProfileField
            icon={Mail} label="Email Address" value={user.email}
            editing={false} // email not editable
          />
          <ProfileField
            icon={Phone} label="Phone Number" value={form.phone}
            editing={editing} onChange={(v) => set("phone", v)}
            placeholder="+91 98xxx xxxxx"
          />
          <ProfileField
            icon={Calendar} label="Member Since"
            value={new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            editing={false}
          />
        </div>
      </div>

      {/* Seller-specific: Agency / Bio */}
      {role === "SELLER" && (
        <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6">
          <h3 className="font-semibold text-lg mb-5 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-orange-500" /> Business Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ProfileField
              icon={Building2} label="Agency / Company" value={form.agency}
              editing={editing} onChange={(v) => set("agency", v)}
              placeholder="Your agency name"
            />
            <div className="md:col-span-2">
              <Label className="text-xs text-gray-400 uppercase tracking-wide mb-1.5 block">Bio / About</Label>
              {editing ? (
                <textarea
                  value={form.bio}
                  onChange={(e) => set("bio", e.target.value)}
                  rows={3}
                  className="w-full rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
                  placeholder="Tell buyers about yourself..."
                />
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {form.bio || <span className="text-gray-400 italic">Not set</span>}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Buyer-specific: Preferences */}
      {role === "BUYER" && (
        <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6">
          <h3 className="font-semibold text-lg mb-5 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-orange-500" /> Property Preferences
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <Label className="text-xs text-gray-400 uppercase tracking-wide mb-1.5 block">Preferred Cities</Label>
              {editing ? (
                <Input
                  value={form.preferredCities}
                  onChange={(e) => set("preferredCities", e.target.value)}
                  placeholder="e.g. Jaipur, Delhi, Gurugram"
                  className="h-11 rounded-xl bg-gray-50 dark:bg-gray-900"
                />
              ) : (
                <p className="text-sm">
                  {form.preferredCities ? (
                    <span className="flex flex-wrap gap-2">
                      {form.preferredCities.split(",").map(c => (
                        <span key={c.trim()} className="px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-900/10 text-orange-600 text-xs font-medium">
                          {c.trim()}
                        </span>
                      ))}
                    </span>
                  ) : (
                    <span className="text-gray-400 italic">Not set</span>
                  )}
                </p>
              )}
            </div>
            <ProfileField
              icon={CreditCard} label="Budget Min (₹)" value={form.budgetMin}
              editing={editing} onChange={(v) => set("budgetMin", v)}
              placeholder="e.g. 500000"
            />
            <ProfileField
              icon={CreditCard} label="Budget Max (₹)" value={form.budgetMax}
              editing={editing} onChange={(v) => set("budgetMax", v)}
              placeholder="e.g. 5000000"
            />
          </div>
        </div>
      )}

      {/* Account Security */}
      <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-orange-500" /> Account Security
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700/50">
            <div>
              <p className="text-sm font-medium">Password</p>
              <p className="text-xs text-gray-400">Last changed: Never</p>
            </div>
            <Button variant="outline" size="sm" disabled className="text-xs">
              Change Password
            </Button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium">Two-Factor Authentication</p>
              <p className="text-xs text-gray-400">Add extra security to your account</p>
            </div>
            <Badge variant="outline" className="text-xs">Coming Soon</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// LISTINGS TAB (Seller only)
// ═══════════════════════════════════════════
function ListingsTab({ user }: { user: DashboardProps["user"] }) {
  const totalInquiries = user.properties.reduce((n, p) => n + p.inquiries.length, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            My Listings
          </h2>
          {totalInquiries > 0 && (
            <p className="text-sm text-gray-400 mt-1">
              {totalInquiries} total {totalInquiries === 1 ? "inquiry" : "inquiries"}
            </p>
          )}
        </div>
        <Button asChild className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md shadow-orange-500/20">
          <Link href="/dashboard/new-listing"><Plus className="h-4 w-4 mr-2" /> New Listing</Link>
        </Button>
      </div>

      {user.properties.length === 0 ? (
        <EmptyState icon={Package} title="No listings yet" desc="Create your first property listing to start receiving inquiries." action="Create Listing" href="/dashboard/new-listing" />
      ) : (
        <div className="space-y-4">
          {user.properties.map((p) => (
            <div key={p.id} className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden hover:shadow-lg hover:shadow-orange-500/5 transition-all">
              <div className="p-5">
                <div className="flex items-center gap-4">
                  {/* Thumbnail */}
                  {p.images[0] ? (
                    <div className="h-16 w-20 rounded-xl overflow-hidden flex-shrink-0 relative">
                      <Image src={p.images[0].url} alt={p.title} fill className="object-cover" sizes="80px" />
                    </div>
                  ) : (
                    <div className="h-16 w-20 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <Link href={`/property/${p.id}`} className="font-semibold hover:text-orange-600 transition-colors truncate block">{p.title}</Link>
                    <p className="text-sm text-gray-400">{p.city} · ₹{p.price.toLocaleString("en-IN")}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {p.viewCount} views</span>
                      <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {p.inquiries.length} inquiries</span>
                    </div>
                    <div className="flex sm:hidden mt-2">
                      <StatusBadge status={p.status} />
                    </div>
                  </div>
                  {/* Desktop-only actions */}
                  <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                    <StatusBadge status={p.status} />
                    <Button variant="outline" size="sm" asChild className="h-8 text-xs"><Link href={`/dashboard/edit-listing/${p.id}`}>Edit</Link></Button>
                    <Button variant="outline" size="sm" asChild className="h-8 text-xs"><Link href={`/property/${p.id}`}>View</Link></Button>
                    <ListingActions propertyId={p.id} status={p.status} />
                  </div>
                </div>
                {/* Mobile-only action strip */}
                <div className="flex sm:hidden items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50">
                  <Button variant="outline" size="sm" asChild className="flex-1 h-8 text-xs"><Link href={`/dashboard/edit-listing/${p.id}`}>Edit</Link></Button>
                  <Button variant="outline" size="sm" asChild className="flex-1 h-8 text-xs"><Link href={`/property/${p.id}`}>View</Link></Button>
                  <ListingActions propertyId={p.id} status={p.status} />
                </div>
              </div>
              {/* Inquiries */}
              {p.inquiries.length > 0 && (
                <div className="border-t border-gray-100 dark:border-gray-700/50 px-5 py-3 bg-gray-50/50 dark:bg-gray-900/30">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Recent Inquiries ({p.inquiries.length})
                  </p>
                  <div className="space-y-2">
                    {p.inquiries.slice(0, 3).map((inq) => (
                      <div key={inq.id} className="text-sm flex items-start gap-2">
                        <div className="h-6 w-6 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs text-orange-600 font-semibold">{inq.buyer.name[0]}</span>
                        </div>
                        <div>
                          <span className="font-medium">{inq.buyer.name}</span>
                          <span className="text-gray-400 text-xs ml-1">({inq.buyer.email})</span>
                          <p className="text-gray-500 line-clamp-1">{inq.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// SAVED TAB (Buyer only)
// ═══════════════════════════════════════════
function SavedTab({ user }: { user: DashboardProps["user"] }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
        Saved Properties
      </h2>
      {user.savedProperties.length === 0 ? (
        <EmptyState icon={Heart} title="No saved properties" desc="Browse listings and save properties you're interested in." action="Browse Properties" href="/properties" />
      ) : (
        <div className="space-y-4">
          {user.savedProperties.map(({ property }) => (
            <div key={property.id} className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 flex items-center gap-4 hover:shadow-md transition-all">
              {property.images[0] ? (
                <div className="h-16 w-24 rounded-xl overflow-hidden flex-shrink-0 relative">
                  <Image src={property.images[0].url} alt={property.title} fill className="object-cover" sizes="96px" />
                </div>
              ) : (
                <div className="h-16 w-24 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-6 w-6 text-gray-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <Link href={`/property/${property.id}`} className="font-semibold hover:text-orange-600 transition-colors truncate block">{property.title}</Link>
                <p className="text-sm text-gray-400">{property.city} · {property.address}</p>
                <p className="text-sm font-bold text-orange-600 mt-1">₹{property.price.toLocaleString("en-IN")}</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/property/${property.id}`}>View <ChevronRight className="h-3 w-3 ml-1" /></Link>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// INQUIRIES TAB
// ═══════════════════════════════════════════
function InquiriesTab({ user, role }: { user: DashboardProps["user"]; role: string }) {
  if (role === "SELLER") {
    const allInquiries = user.properties.flatMap(p =>
      p.inquiries.map(inq => ({ ...inq, propertyTitle: p.title, propertyId: p.id }))
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
          Inquiries Received
        </h2>
        {allInquiries.length === 0 ? (
          <EmptyState icon={MessageSquare} title="No inquiries yet" desc="Once buyers inquire about your properties, they'll appear here." />
        ) : (
          <div className="space-y-3">
            {allInquiries.map(inq => (
              <div key={inq.id} className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {inq.buyer.name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{inq.buyer.name}</p>
                        <p className="text-xs text-gray-400">{inq.buyer.email}</p>
                      </div>
                      <span className="text-xs text-gray-400">{new Date(inq.createdAt).toLocaleDateString("en-IN")}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{inq.message}</p>
                    <Link href={`/property/${inq.propertyId}`} className="text-xs text-orange-600 hover:underline mt-2 inline-block">
                      Re: {inq.propertyTitle}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Buyer: sent inquiries
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
        My Inquiries
      </h2>
      {user.inquiries.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No inquiries sent" desc="When you contact a seller about a property, it will appear here." action="Browse Properties" href="/properties" />
      ) : (
        <div className="space-y-3">
          {user.inquiries.map(inq => (
            <div key={inq.id} className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 flex items-start gap-4">
              {inq.property.images[0] ? (
                <div className="h-14 w-18 rounded-xl overflow-hidden flex-shrink-0 relative" style={{ width: 72 }}>
                  <Image src={inq.property.images[0].url} alt="" fill className="object-cover" sizes="72px" />
                </div>
              ) : (
                <div className="h-14 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0" style={{ width: 72 }}>
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
              )}
              <div className="flex-1">
                <Link href={`/property/${inq.property.id}`} className="font-semibold text-sm hover:text-orange-600 transition-colors">{inq.property.title}</Link>
                <p className="text-sm text-gray-500 mt-1">{inq.message}</p>
                <p className="text-xs text-gray-400 mt-2">{new Date(inq.createdAt).toLocaleDateString("en-IN")}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// SUBSCRIPTION TAB
// ═══════════════════════════════════════════
function SubscriptionTab({ user }: { user: DashboardProps["user"] }) {
  const activeSub = user.subscriptions.find(s => s.status === "ACTIVE" && new Date(s.endAt) > new Date());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
          Subscription
        </h2>
        <Button asChild variant="outline" size="sm">
          <Link href="/pricing">View All Plans</Link>
        </Button>
      </div>

      {/* Current plan */}
      <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6">
        <h3 className="font-semibold mb-4">Current Plan</h3>
        {activeSub ? (
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xl font-bold">{activeSub.planName}</p>
              <p className="text-sm text-gray-400">₹{(activeSub.amount / 100).toLocaleString("en-IN")}/month</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                <span>Started: {new Date(activeSub.startAt).toLocaleDateString("en-IN")}</span>
                <span>Expires: {new Date(activeSub.endAt).toLocaleDateString("en-IN")}</span>
              </div>
            </div>
            <Badge className="bg-green-100 dark:bg-green-900/20 text-green-700 border-0 text-sm px-3 py-1">
              Active
            </Badge>
          </div>
        ) : (
          <div className="text-center py-8 space-y-4">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <Crown className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <p className="font-semibold text-lg">You&apos;re on the Free Plan</p>
              <p className="text-gray-400 text-sm mt-1">Upgrade to unlock contact details and premium features</p>
            </div>
            <Button asChild className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <Link href="/pricing">Upgrade Now</Link>
            </Button>
          </div>
        )}
      </div>

      {/* History */}
      {user.subscriptions.length > 0 && (
        <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6">
          <h3 className="font-semibold mb-4">Billing History</h3>
          <div className="space-y-3">
            {user.subscriptions.map(sub => (
              <div key={sub.id} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
                <div>
                  <p className="text-sm font-medium">{sub.planName}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(sub.startAt).toLocaleDateString("en-IN")} → {new Date(sub.endAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">₹{(sub.amount / 100).toLocaleString("en-IN")}</p>
                  <StatusBadge status={sub.status} small />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Coupons */}
      {user.coupons.length > 0 && (
        <div className="bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-200 dark:border-orange-800/30 p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Tag className="h-5 w-5 text-orange-600" /> Available Coupons
          </h3>
          {user.coupons.map(c => (
            <div key={c.id} className="flex items-center gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border-2 border-dashed border-orange-300 dark:border-orange-700">
                <p className="text-lg font-bold text-orange-600 tracking-wider">{c.code}</p>
              </div>
              <div>
                <p className="text-sm font-medium">{c.discountPct}% off your next subscription</p>
                <p className="text-xs text-gray-400">Expires {new Date(c.expiresAt).toLocaleDateString("en-IN")}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// Reusable small components
// ═══════════════════════════════════════════
function StatCard({ icon: Icon, label, value, isText }: { icon: React.ElementType; label: string; value: string | number; isText?: boolean }) {
  return (
    <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-9 w-9 rounded-xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
          <Icon className="h-4 w-4 text-orange-600" />
        </div>
      </div>
      <p className={`font-bold ${isText ? "text-lg" : "text-2xl"}`} style={{ fontFamily: "'Playfair Display', serif" }}>
        {typeof value === "number" ? value.toLocaleString("en-IN") : value}
      </p>
      <p className="text-xs text-gray-400 mt-1">{label}</p>
    </div>
  );
}

function QuickAction({ icon: Icon, label, desc, onClick, href }: { icon: React.ElementType; label: string; desc: string; onClick?: () => void; href?: string }) {
  const Comp = href ? Link : "button";
  return (
    <Comp
      href={href as string}
      onClick={onClick}
      className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 text-left hover:border-orange-300 dark:hover:border-orange-800 hover:shadow-md hover:shadow-orange-500/5 transition-all group"
    >
      <div className="h-10 w-10 rounded-xl bg-orange-50 dark:bg-orange-900/10 flex items-center justify-center mb-3 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/20 transition-colors">
        <Icon className="h-5 w-5 text-orange-600" />
      </div>
      <p className="font-semibold text-sm">{label}</p>
      <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
    </Comp>
  );
}

function ProfileField({ icon: Icon, label, value, editing, onChange, placeholder }: {
  icon: React.ElementType; label: string; value: string; editing: boolean;
  onChange?: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <Label className="text-xs text-gray-400 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
        <Icon className="h-3 w-3" /> {label}
      </Label>
      {editing && onChange ? (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-11 rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
        />
      ) : (
        <p className="text-sm font-medium py-2">
          {value || <span className="text-gray-400 italic">Not set</span>}
        </p>
      )}
    </div>
  );
}

function StatusBadge({ status, small }: { status: string; small?: boolean }) {
  const styles: Record<string, string> = {
    ACTIVE: "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400",
    PENDING: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400",
    REJECTED: "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400",
    SOLD: "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400",
    RENTED: "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400",
    CANCELLED: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400",
    EXPIRED: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400",
  };

  return (
    <Badge className={`border-0 ${small ? "text-[10px] px-1.5 py-0" : "text-xs"} ${styles[status] ?? styles.EXPIRED}`}>
      {status}
    </Badge>
  );
}

function EmptyState({ icon: Icon, title, desc, action, href }: { icon: React.ElementType; title: string; desc: string; action?: string; href?: string }) {
  return (
    <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-12 text-center">
      <div className="h-16 w-16 mx-auto rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-gray-400 text-sm mt-1 max-w-sm mx-auto">{desc}</p>
      {action && href && (
        <Button asChild className="mt-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <Link href={href}>{action}</Link>
        </Button>
      )}
    </div>
  );
}


