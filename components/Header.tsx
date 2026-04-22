"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Menu, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";

const navLinks = [
  { label: "Buy", href: "/properties" },
  { label: "Rent", href: "/rent" },
  { label: "Pricing", href: "/pricing" },
];

export default function Header() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-sm border-b border-gray-200/50 dark:border-gray-800/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-orange-500/25 transition-all">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <span
            className={`text-xl font-bold transition-colors ${
              scrolled ? "text-gray-900 dark:text-white" : "text-gray-900 dark:text-white"
            }`}
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            PropHive
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-all"
            >
              {link.label}
            </Link>
          ))}
          {session?.user.role === "ADMIN" && (
            <Link
              href="/admin"
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-all"
            >
              Admin
            </Link>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            <Sun className="h-4 w-4 hidden dark:block" />
            <Moon className="h-4 w-4 block dark:hidden" />
          </button>

          {/* Auth buttons / avatar */}
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer h-9 w-9 ring-2 ring-transparent hover:ring-orange-500/50 transition-all">
                  <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white font-semibold text-sm">
                    {session.user.name?.[0]?.toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href={session.user.role === "ADMIN" ? "/admin" : "/dashboard"}>
                    {session.user.role === "ADMIN" ? "Admin Panel" : "My Dashboard"}
                  </Link>
                </DropdownMenuItem>
                {session.user.role === "ADMIN" && (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">My Account</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" asChild size="sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md shadow-orange-500/20"
              >
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          )}

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="md:hidden h-9 w-9 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-white dark:bg-gray-900 p-0">
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                      PropHive
                    </span>
                  </div>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-900/10 transition-all"
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                  {session?.user.role === "ADMIN" && (
                    <SheetClose asChild>
                      <Link
                        href="/admin"
                        className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-900/10 transition-all"
                      >
                        Admin
                      </Link>
                    </SheetClose>
                  )}
                </nav>
                <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
                  {session ? (
                    <>
                      <SheetClose asChild>
                        <Link
                          href="/dashboard"
                          className="block w-full text-center py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm font-medium"
                        >
                          Dashboard
                        </Link>
                      </SheetClose>
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <SheetClose asChild>
                        <Link
                          href="/login"
                          className="block w-full text-center py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm font-medium"
                        >
                          Login
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="/register"
                          className="block w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold"
                        >
                          Get Started
                        </Link>
                      </SheetClose>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
