import { permanentRedirect } from "next/navigation";

export default async function GuideStepPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  permanentRedirect(`/knowledge/${slug}`);
}
