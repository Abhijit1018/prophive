import Image from "next/image";
import { assets, optimizedUrl } from "@/lib/assets";
import { Building2 } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left: Image side (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src={optimizedUrl(assets.auth.background, 1200)}
          alt="Find your dream home"
          fill
          className="object-cover"
          sizes="50vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span
              className="text-xl font-bold text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              PropHive
            </span>
          </Link>

          <div className="space-y-6">
            <h2
              className="text-4xl font-bold text-white leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Your Dream Home
              <br />
              Awaits You
            </h2>
            <p className="text-white/70 max-w-md">
              Join thousands of happy customers who found their perfect property through PropHive.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {["PS", "RK", "AV", "SM"].map((initials) => (
                  <div
                    key={initials}
                    className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-semibold border-2 border-black/30"
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <p className="text-white/60 text-sm">5,000+ happy customers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Form side */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-gray-50 dark:bg-gray-950">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span
              className="text-xl font-bold"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              PropHive
            </span>
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}
