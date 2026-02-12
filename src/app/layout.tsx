import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
