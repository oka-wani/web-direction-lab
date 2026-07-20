import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./content-refresh.css";

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
  title: "Web Direction Lab｜Webディレクター・Webコンサルを目指す人の学習メディア",
  description: "Webディレクター・Webコンサルを目指す人が、Web制作・SEO・システム・アクセス解析・AI活用を実務目線で学べるメディアです。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "/",
    siteName: "Web Direction Lab",
    title: "Web Direction Lab｜Webディレクター・Webコンサルを目指す人の学習メディア",
    description: "Web制作・SEO・システム・アクセス解析・AI活用を実務目線で学べるメディアです。",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Web Direction Lab" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Web Direction Lab",
    description: "Web制作・SEO・システム・アクセス解析・AI活用を実務目線で学べるメディアです。",
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
