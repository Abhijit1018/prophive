"use client";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { AppProgressBar } from "next-nprogress-bar";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
        <AppProgressBar height="3px" color="#ea580c" options={{ showSpinner: false }} shallowRouting />
      </ThemeProvider>
    </SessionProvider>
  );
}
