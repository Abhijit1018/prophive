"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { User, Mail, Lock, Phone, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "BUYER",
    phone: "",
  });

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Registration failed. Try again.");
      setLoading(false);
      return;
    }
    await signIn("credentials", { email: form.email, password: form.password, redirect: false });
    toast.success("Account created! Welcome to PropHive");
    router.push("/");
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Create Account
        </h1>
        <p className="text-gray-500 mt-2">Join PropHive and find your dream property</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              required
              className="pl-10 h-12 rounded-xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
              placeholder="Your full name"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              required
              className="pl-10 h-12 rounded-xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
              placeholder="you@example.com"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="password"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              required
              minLength={6}
              className="pl-10 h-12 rounded-xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
              placeholder="••••••••"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Phone (optional)</Label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              className="pl-10 h-12 rounded-xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
              placeholder="+91 98xxx xxxxx"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">I am a</Label>
          <Select value={form.role} onValueChange={(v) => set("role", v ?? "BUYER")}>
            <SelectTrigger className="h-12 rounded-xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BUYER">Buyer / Tenant</SelectItem>
              <SelectItem value="SELLER">Seller / Owner</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          type="submit"
          className="w-full h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold shadow-lg shadow-orange-500/20"
          disabled={loading}
        >
          {loading ? "Creating account..." : (
            <span className="flex items-center gap-2">
              Create Account <ArrowRight className="h-4 w-4" />
            </span>
          )}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-orange-600 hover:text-orange-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
