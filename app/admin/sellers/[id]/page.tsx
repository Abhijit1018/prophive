import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import PropertyModerationActions from "../../properties/PropertyModerationActions";

export default async function SellerDetailPage({ params }: { params: { id: string } }) {
  const seller = await prisma.user.findUnique({
    where: { id: params.id, role: "SELLER" },
    include: {
      sellerProfile: true,
      properties: {
        include: { images: { where: { isPrimary: true }, take: 1 } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!seller) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">{seller.name}</h1>
        <p className="text-gray-400">{seller.email} · {seller.sellerProfile?.agency ?? "No agency"}</p>
      </div>
      <div className="space-y-3">
        {seller.properties.map((p) => (
          <div key={p.id} className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex-1">
              <p className="font-semibold">{p.title}</p>
              <p className="text-sm text-gray-400">{p.city} · ₹{p.price.toLocaleString("en-IN")}</p>
            </div>
            <Badge variant={p.status === "ACTIVE" ? "default" : p.status === "PENDING" ? "secondary" : "destructive"}>
              {p.status}
            </Badge>
            <PropertyModerationActions propertyId={p.id} currentStatus={p.status} />
          </div>
        ))}
        {seller.properties.length === 0 && (
          <p className="text-gray-400 text-sm">No properties yet.</p>
        )}
      </div>
    </div>
  );
}
