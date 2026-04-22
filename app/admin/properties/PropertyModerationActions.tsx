"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Star } from "lucide-react";

type Props = { propertyId: string; currentStatus: string };

export default function PropertyModerationActions({ propertyId, currentStatus }: Props) {
  const router = useRouter();

  async function update(data: object) {
    const res = await fetch(`/api/admin/properties/${propertyId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) { toast.success("Updated"); router.refresh(); }
    else toast.error("Failed to update");
  }

  return (
    <div className="flex gap-1">
      {currentStatus === "PENDING" && (
        <>
          <Button size="icon" variant="ghost" className="h-7 w-7 text-green-600 hover:bg-green-50"
            onClick={() => update({ status: "ACTIVE" })} title="Approve">
            <CheckCircle className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="h-7 w-7 text-red-600 hover:bg-red-50"
            onClick={() => update({ status: "REJECTED" })} title="Reject">
            <XCircle className="h-4 w-4" />
          </Button>
        </>
      )}
      <Button size="icon" variant="ghost" className="h-7 w-7 text-orange-500 hover:bg-orange-50"
        onClick={() => update({ isFeatured: true })} title="Feature">
        <Star className="h-4 w-4" />
      </Button>
    </div>
  );
}
