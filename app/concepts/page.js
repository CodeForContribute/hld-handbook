import Link from "next/link";
import { getDocsByCategory } from "@/lib/content";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata = {
  title: "Concepts & Building Blocks",
  description:
    "Core building-block concepts of High-Level Design: caching, load balancing, sharding, consensus, CAP, queues, and more.",
};

export default function ConceptsIndex() {
  const docs = getDocsByCategory("concepts");
  return (
    <div className="index-page">
      <ScrollReveal />
      <header className="index-head">
        <p className="eyebrow">// 01 — Foundations</p>
        <h1>Building Blocks of System Design</h1>
        <p className="index-lead">
          {docs.length} foundational topics. Each one is a tool you will reach
          for again and again when designing large-scale systems.
        </p>
      </header>
      <ol className="doc-list">
        {docs.map((d, i) => (
          <li key={d.slug} className="reveal" style={{ animationDelay: `${i * 25}ms` }}>
            <Link href={`/concepts/${d.slug}`}>
              <span className="doc-list-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="doc-list-body">
                <strong>{d.title}</strong>
                <span>{d.summary}</span>
              </span>
              <span className="doc-list-time">{d.readingTime} MIN</span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
