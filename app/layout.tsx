import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./content-refresh.css";
import "./platform.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://web-direction-lab.vercel.app"),
  title: "Web Growth Lab｜Webサイトと仕組みで、事業の課題を小さく解決",
  description: "小規模Webサイト制作、既存サイト改善、Web運用、業務効率化ツール、Web・AI活用の相談に対応します。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "/",
    siteName: "Web Growth Lab",
    title: "Web Growth Lab｜Webサイトと仕組みで、事業の課題を小さく解決",
    description: "Web制作・改善・運用と、日常業務の小さな自動化を必要な規模で支援します。",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Web Growth Lab" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Web Growth Lab",
    description: "Web制作・改善・運用と、日常業務の小さな自動化を必要な規模で支援します。",
    images: ["/twitter-image.png"],
  },
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
