import type { Metadata } from "next";
import "./globals.css";
import "./content-refresh.css";
import "./platform.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://web-direction-lab.kwmno.workers.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Wani san Web｜小さな会社の集客と業務を改善するWeb・DXパートナー",
  description: "Web制作、SEO解析・LLMO、SNS運用・広告、業務改善・ツール開発。小さな会社に必要な4つの支援を、分かりやすく提供します。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "/",
    siteName: "Wani san Web",
    title: "Wani san Web｜小さな会社の集客と業務を改善する",
    description: "Web制作、SEO解析、SNS・広告、業務改善を、必要な規模から支援します。",
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
          serviceType: ["Web制作", "SEO解析・LLMO", "SNS運用・Web広告", "業務改善・ツール開発"],
        }) }} />
        {children}
      </body>
    </html>
  );
}
