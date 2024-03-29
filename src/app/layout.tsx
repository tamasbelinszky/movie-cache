import { Navigation } from "@/components/Navigation";
import { Providers } from "@/components/providers/Providers";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Movie Cache App",
  description: "Browse movies using the TMDB API and cache queries with Upstash Serverless Redis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={process.env.NODE_ENV === "development"}>
      <body className={inter.className}>
        <Providers>
          <Suspense>
            <main className="flex min-h-screen w-full flex-col items-center justify-between gap-3 p-2 lg:p-4">
              <Navigation />

              {children}
            </main>
          </Suspense>
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
