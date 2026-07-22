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
  title: "Web Direction Lab｜Webで成果を出すための知識・ツール・サービス",
  description: "Web制作・SEO・AI・業務改善の知識を発信し、ツール、テンプレート、Webサイト診断・改善・制作・運用支援を提供します。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "/",
    siteName: "Web Direction Lab",
    title: "Web Direction Lab｜Webで成果を出すための知識・ツール・サービス",
    description: "Web制作・SEO・AI・業務改善を、学ぶ・使う・相談するまで一つにつなげます。",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Web Direction Lab" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Web Direction Lab",
    description: "Web制作・SEO・AI・業務改善を、学ぶ・使う・相談するまで一つにつなげます。",
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
