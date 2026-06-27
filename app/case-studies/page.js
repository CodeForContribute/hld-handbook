import Link from "next/link";
import { getDocsByCategory } from "@/lib/content";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata = {
  title: "System Design Case Studies",
  description:
    "End-to-end High-Level Design walkthroughs: URL shortener, Twitter, chat, Uber, Netflix, Dropbox, and more.",
};

export default function CaseStudiesIndex() {
  const docs = getDocsByCategory("case-studies");
  return (
    <div className="index-page">
      <ScrollReveal />
      <header className="index-head">
        <p className="eyebrow">// 02 — Applied</p>
        <h1>System Design Case Studies</h1>
        <p className="index-lead">
          {docs.length} complete walkthroughs. Each follows the same playbook:
          clarify requirements, estimate scale, design the API and data model,
          then build up the architecture — with interactive blueprints.
        </p>
      </header>
      <div className="card-grid">
        {docs.map((d, i) => (
          <Link
            key={d.slug}
            href={`/case-studies/${d.slug}`}
            className="card reveal"
            style={{ animationDelay: `${(i % 6) * 45}ms` }}
          >
            <span className="card-index">{String(i + 1).padStart(2, "0")}</span>
            <div className="card-head">
              <h3>{d.title}</h3>
              {d.difficulty && (
                <span className={`pill pill-${d.difficulty.toLowerCase()}`}>
                  {d.difficulty}
                </span>
              )}
            </div>
            <p>{d.summary}</p>
            <span className="card-meta">{d.readingTime} MIN READ</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
