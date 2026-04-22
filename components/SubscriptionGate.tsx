import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Phone, Mail, MessageCircle, Lock } from "lucide-react";

type SellerContactProps = {
  phone: string | null;
  email: string;
  name: string;
};

export default async function SubscriptionGate({ phone, email, name }: SellerContactProps) {
  const session = await auth();

  if (!session) {
    return <ContactBlurred reason="Login to view seller contact" href="/login" />;
  }

  const sub = await prisma.subscription.findFirst({
    where: {
      userId: session.user.id,
      status: "ACTIVE",
      endAt: { gt: new Date() },
      planType: "BUYER",
    },
  });

  if (!sub) {
    return <ContactBlurred reason="Upgrade to Buyer Plan to view contact" href="/pricing" />;
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-lg">Seller: {name}</h3>
      {phone && (
        <a href={`tel:${phone}`} className="flex items-center gap-2 text-orange-600 hover:underline">
          <Phone className="h-4 w-4" /> {phone}
        </a>
      )}
      <a href={`mailto:${email}`} className="flex items-center gap-2 text-orange-600 hover:underline">
        <Mail className="h-4 w-4" /> {email}
      </a>
      {phone && (
        <a
          href={`https://wa.me/${phone.replace(/\D/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-green-600 hover:underline"
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </a>
      )}
    </div>
  );
}

function ContactBlurred({ reason, href }: { reason: string; href: string }) {
  return (
    <div className="relative">
      <div className="blur-sm select-none pointer-events-none space-y-3">
        <p className="flex items-center gap-2 text-sm">
          <Phone className="h-4 w-4" /> +91 98765 XXXXX
        </p>
        <p className="flex items-center gap-2 text-sm">
          <Mail className="h-4 w-4" /> seller@example.com
        </p>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 dark:bg-gray-800/60 rounded-lg gap-2">
        <Lock className="h-5 w-5 text-gray-500" />
        <p className="text-sm text-gray-600 dark:text-gray-300">{reason}</p>
        <Button size="sm" asChild className="bg-orange-600 hover:bg-orange-700 text-white">
          <Link href={href}>{href === "/login" ? "Login" : "View Plans"}</Link>
        </Button>
      </div>
    </div>
  );
}
