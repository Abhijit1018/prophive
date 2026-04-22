"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, CheckCircle } from "lucide-react";

type Props = { propertyId: string; status: string };

export default function ListingActions({ propertyId, status }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function updateStatus(newStatus: string) {
    setBusy(true);
    const res = await fetch(`/api/properties/${propertyId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setBusy(false);
    if (res.ok) {
      toast.success(`Marked as ${newStatus.toLowerCase()}`);
      router.refresh();
    } else {
      toast.error("Failed to update status");
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this listing? This cannot be undone.")) return;
    setBusy(true);
    const res = await fetch(`/api/properties/${propertyId}`, { method: "DELETE" });
    setBusy(false);
    if (res.ok) {
      toast.success("Listing deleted");
      router.refresh();
    } else {
      toast.error("Failed to delete listing");
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      {status === "ACTIVE" && (
        <>
          <Button
            size="sm"
            variant="outline"
            disabled={busy}
            onClick={() => updateStatus("SOLD")}
            className="text-xs h-7 px-2"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Sold
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={busy}
            onClick={() => updateStatus("RENTED")}
            className="text-xs h-7 px-2"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Rented
          </Button>
        </>
      )}
      <Button
        size="sm"
        variant="ghost"
        disabled={busy}
        onClick={handleDelete}
        className="text-xs h-7 px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
}
