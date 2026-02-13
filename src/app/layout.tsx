import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

#we need a better name 
export const metadata: Metadata = {
  title: "Beat the Sugar Spike — Track, Win, Live Better",
  description: "Track your sugar intake instantly and get real-time, context-aware health nudges. Build streaks, earn XP, and level up your lifestyle.",
  keywords: ["sugar tracker", "health", "gamification", "wellness", "habit tracker"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${outfit.variable} font-sans antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
