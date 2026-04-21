import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PropHive — Find Your Perfect Property",
  description:
    "India's cleanest real estate platform. Buy, sell, rent properties in Jaipur, Delhi, Gurugram.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-body bg-surface-50 dark:bg-surface-900 text-surface-800 dark:text-surface-100 antialiased">
        {children}
      </body>
    </html>
  );
}
