"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { X, Upload, ImageIcon } from "lucide-react";

type UploadedImage = { url: string; isPrimary: boolean };

export default function NewListingPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [form, setForm] = useState({
    title: "", description: "", type: "APARTMENT", mode: "SALE",
    price: "", area: "", bhk: "", furnishing: "FURNISHED",
    city: "Delhi", address: "", pincode: "", landmark: "",
    lat: "", lng: "",
  });

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    if (images.length + files.length > 8) {
      toast.error("Maximum 8 images allowed");
      return;
    }
    setUploading(true);
    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (res.ok) {
        const { url } = await res.json() as { url: string };
        setImages((prev) => [...prev, { url, isPrimary: prev.length === 0 }]);
      } else {
        toast.error(`Failed to upload ${file.name}`);
      }
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeImage(idx: number) {
    setImages((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      if (next.length > 0 && prev[idx]?.isPrimary) {
        next[0].isPrimary = true;
      }
      return next;
    });
  }

  function setPrimary(idx: number) {
    setImages((prev) => prev.map((img, i) => ({ ...img, isPrimary: i === idx })));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        area: Number(form.area),
        bhk: form.bhk ? Number(form.bhk) : undefined,
        lat: form.lat ? Number(form.lat) : undefined,
        lng: form.lng ? Number(form.lng) : undefined,
        images: images.length > 0 ? images : undefined,
      }),
    });
    setLoading(false);
    if (res.ok) {
      toast.success("Listing submitted for review!");
      router.push("/dashboard");
    } else {
      const data = await res.json() as { error?: string };
      toast.error(data.error ?? "Failed to create listing");
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
        Create New Listing
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Image upload section */}
        <div>
          <Label className="mb-2 block">Property Photos</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            {images.map((img, idx) => (
              <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-orange-400 transition-all">
                <Image src={img.url} alt={`Property photo ${idx + 1}`} fill className="object-cover" />
                {img.isPrimary && (
                  <span className="absolute top-1 left-1 bg-orange-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    Cover
                  </span>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                  {!img.isPrimary && (
                    <button
                      type="button"
                      onClick={() => setPrimary(idx)}
                      className="bg-white text-gray-800 text-[10px] font-semibold px-2 py-1 rounded hover:bg-orange-50"
                    >
                      Set Cover
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}

            {images.length < 8 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-orange-400 flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-orange-500 transition-colors disabled:opacity-50"
              >
                {uploading ? (
                  <div className="h-5 w-5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Upload className="h-5 w-5" />
                    <span className="text-[11px] font-medium">Add Photo</span>
                  </>
                )}
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageUpload}
          />
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <ImageIcon className="h-3 w-3" /> Up to 8 photos. Click an image to set it as cover.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label>Property Title</Label>
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} required minLength={5} />
          </div>
          <div className="md:col-span-2">
            <Label>Description</Label>
            <textarea
              className="w-full min-h-[100px] rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              required
              minLength={20}
            />
          </div>
          <div>
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => set("type", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["APARTMENT", "VILLA", "PLOT", "COMMERCIAL", "PG_HOSTEL"].map((t) => (
                  <SelectItem key={t} value={t}>{t.replace("_", " ")}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Mode</Label>
            <Select value={form.mode} onValueChange={(v) => set("mode", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="SALE">For Sale</SelectItem>
                <SelectItem value="RENT">For Rent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Price (₹)</Label>
            <Input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} required min={0} />
          </div>
          <div>
            <Label>Area (sq.ft)</Label>
            <Input type="number" value={form.area} onChange={(e) => set("area", e.target.value)} required min={0} />
          </div>
          <div>
            <Label>BHK (optional)</Label>
            <Input type="number" value={form.bhk} onChange={(e) => set("bhk", e.target.value)} min={1} />
          </div>
          <div>
            <Label>Furnishing</Label>
            <Select value={form.furnishing} onValueChange={(v) => set("furnishing", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="FURNISHED">Furnished</SelectItem>
                <SelectItem value="SEMI_FURNISHED">Semi-Furnished</SelectItem>
                <SelectItem value="UNFURNISHED">Unfurnished</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>City</Label>
            <Select value={form.city} onValueChange={(v) => set("city", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Jaipur", "Delhi", "Gurugram"].map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Pincode</Label>
            <Input value={form.pincode} onChange={(e) => set("pincode", e.target.value)} required />
          </div>
          <div className="md:col-span-2">
            <Label>Address</Label>
            <Input value={form.address} onChange={(e) => set("address", e.target.value)} required />
          </div>
          <div className="md:col-span-2">
            <Label>Landmark (optional)</Label>
            <Input value={form.landmark} onChange={(e) => set("landmark", e.target.value)} />
          </div>
          <div>
            <Label>Latitude (optional)</Label>
            <Input type="number" step="any" value={form.lat} onChange={(e) => set("lat", e.target.value)} placeholder="e.g. 28.6139" />
          </div>
          <div>
            <Label>Longitude (optional)</Label>
            <Input type="number" step="any" value={form.lng} onChange={(e) => set("lng", e.target.value)} placeholder="e.g. 77.2090" />
          </div>
        </div>
        <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white" disabled={loading || uploading}>
          {loading ? "Submitting..." : "Submit for Review"}
        </Button>
      </form>
    </div>
  );
}
