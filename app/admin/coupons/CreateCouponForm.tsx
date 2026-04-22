"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type User = { id: string; name: string; email: string };

export default function CreateCouponForm({ users }: { users: User[] }) {
  const router = useRouter();
  const [form, setForm] = useState({ code: "", userId: "", discountPct: 10, expiresAt: "" });

  function set(field: string, value: string | number) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, expiresAt: new Date(form.expiresAt).toISOString() }),
    });
    if (res.ok) { toast.success("Coupon created"); router.refresh(); }
    else toast.error("Failed to create coupon");
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <Label>Code</Label>
        <Input value={form.code} onChange={(e) => set("code", e.target.value.toUpperCase())} placeholder="PROMO20" required />
      </div>
      <div>
        <Label>User</Label>
        <Select value={form.userId} onValueChange={(v) => set("userId", v)}>
          <SelectTrigger><SelectValue placeholder="Select user" /></SelectTrigger>
          <SelectContent>
            {users.map((u) => (
              <SelectItem key={u.id} value={u.id}>{u.name} ({u.email})</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Discount %</Label>
        <Input type="number" min={1} max={100} value={form.discountPct} onChange={(e) => set("discountPct", Number(e.target.value))} required />
      </div>
      <div>
        <Label>Expires</Label>
        <Input type="date" value={form.expiresAt} onChange={(e) => set("expiresAt", e.target.value)} required />
      </div>
      <div className="col-span-2 md:col-span-4">
        <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white">Create Coupon</Button>
      </div>
    </form>
  );
}
