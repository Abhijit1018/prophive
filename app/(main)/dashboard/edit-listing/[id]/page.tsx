import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditListingForm from "./EditListingForm";

export default async function EditListingPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session || session.user.role !== "SELLER") redirect("/dashboard");

  const property = await prisma.property.findUnique({
    where: { id: params.id },
    include: { images: true },
  });

  if (!property || property.sellerId !== session.user.id) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
        Edit Listing
      </h1>
      <EditListingForm property={property} />
    </div>
  );
}
