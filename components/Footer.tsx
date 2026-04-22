"use client";
import Link from "next/link";
import { Building2, ArrowRight } from "lucide-react";

const footerLinks = {
  "Buy Property": [
    { label: "Apartments", href: "/properties?type=APARTMENT" },
    { label: "Villas", href: "/properties?type=VILLA" },
    { label: "Plots", href: "/properties?type=PLOT" },
    { label: "Commercial", href: "/properties?type=COMMERCIAL" },
  ],
  "Rent Property": [
    { label: "Apartments for Rent", href: "/rent?type=APARTMENT" },
    { label: "PG / Hostel", href: "/rent?type=PG_HOSTEL" },
    { label: "Commercial Rent", href: "/rent?type=COMMERCIAL" },
  ],
  "Explore Cities": [
    { label: "Properties in Jaipur", href: "/properties?city=Jaipur" },
    { label: "Properties in Delhi", href: "/properties?city=Delhi" },
    { label: "Properties in Gurugram", href: "/properties?city=Gurugram" },
    { label: "Coming Soon Cities", href: "/coming-soon" },
  ],
  Company: [
    { label: "Pricing", href: "/pricing" },
    { label: "About Us", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Privacy Policy", href: "#" },
  ],
};

const socials = [
  { label: "Instagram", href: "#" },
  { label: "Twitter", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Facebook", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white" id="footer">
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-8">
        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl p-8 md:p-12 mb-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3
              className="text-2xl md:text-3xl font-bold text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Ready to Find Your Dream Home?
            </h3>
            <p className="text-orange-100 mt-2">
              Join thousands of satisfied customers who found their perfect property
            </p>
          </div>
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-colors flex-shrink-0"
          >
            Browse Properties <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-orange-400 transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span
              className="text-xl font-bold"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              PropHive
            </span>
          </div>

          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} PropHive. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="h-9 w-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-600 transition-colors text-xs font-semibold text-gray-400 hover:text-white"
              >
                {s.label[0]}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
