import { notFound } from "next/navigation";
import DocView from "@/components/DocView";
import { getDoc, getDocsByCategory } from "@/lib/content";

export function generateStaticParams() {
  return getDocsByCategory("case-studies").map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const doc = getDoc("case-studies", slug);
  if (!doc) return {};
  return { title: doc.title, description: doc.summary };
}

export default async function CaseStudyPage({ params }) {
  const { slug } = await params;
  const doc = getDoc("case-studies", slug);
  if (!doc) notFound();
  return <DocView doc={doc} category="case-studies" />;
}
