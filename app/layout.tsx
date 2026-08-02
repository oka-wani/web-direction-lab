import type { Metadata } from "next";
import "./globals.css";
import "./content-refresh.css";
import "./platform.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://web-direction-lab.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Wani san Web｜小さな会社の集客と業務を改善するWeb・DXパートナー",
  description: "Webサイト制作・運用、SEO・LLMO、Instagram・Web広告相談、AI活用・業務自動化まで。小さな会社の売上と利益を増やす仕組みづくりを支援します。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "/",
    siteName: "Wani san Web",
    title: "Wani san Web｜小さな会社の集客と業務を改善する",
    description: "WebマーケティングとAI・業務改善を、必要な規模から一貫して支援します。",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Wani san Web" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wani san Web",
    description: "小さな会社の集客と業務を改善するWeb・DXパートナー。",
    images: ["/twitter-image"],
  },
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "Wani san Web",
          url: siteUrl,
          description: "小さな会社の集客と業務を改善するWeb・DXパートナー",
          areaServed: "JP",
          serviceType: ["Webサイト制作", "Webマーケティング支援", "AI・業務改善支援"],
        }) }} />
        {children}
      </body>
    </html>
  );
}
