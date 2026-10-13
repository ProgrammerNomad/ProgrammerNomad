import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Syne } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { BackgroundAmbient } from "@/components/layout/BackgroundAmbient";
import { PersonJsonLd, WebSiteJsonLd } from "@/lib/seo/json-ld";
import { PlausibleAnalytics } from "@/components/analytics/PlausibleAnalytics";
import { rootMetadata } from "@/lib/seo/metadata";
import "./globals.css";

const display = Syne({
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = rootMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${body.variable} ${mono.variable} min-h-screen bg-canvas text-paper antialiased`}
      >
        <BackgroundAmbient />
        <div className="relative z-10">
          <PersonJsonLd />
          <WebSiteJsonLd />
          <PlausibleAnalytics />
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}

