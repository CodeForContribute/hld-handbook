import Link from "next/link";
import { getDocsByCategory } from "@/lib/content";
import ScrollReveal from "@/components/ScrollReveal";
import CountUp from "@/components/CountUp";

export default function Home() {
  const concepts = getDocsByCategory("concepts");
  const cases = getDocsByCategory("case-studies");
  const total = concepts.length + cases.length;

  return (
    <div className="home">
      <ScrollReveal />

      <section className="hero bp-ticks">
        <p className="eyebrow hero-eyebrow">The HLD Handbook · v1.0</p>
        <h1>
          Design at <span className="accent">scale.</span>
        </h1>
        <p className="hero-tag">
          // high-level design · distributed systems · interview prep
        </p>
        <p className="hero-sub">
          A blueprint for building large-scale systems. Master the building
          blocks of distributed systems, then apply them in end-to-end case
          studies — original, first-principles content, drawn like an
          engineer&apos;s schematic.
        </p>
        <div className="hero-actions">
          <Link className="btn primary" href="/concepts/scalability-fundamentals">
            Start reading →
          </Link>
          <Link className="btn ghost" href="/case-studies">
            Browse case studies
          </Link>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <CountUp value={concepts.length} />
            <span>Core concepts</span>
          </div>
          <div className="stat">
            <CountUp value={cases.length} />
            <span>Case studies</span>
          </div>
          <div className="stat">
            <CountUp value={total} />
            <span>Chapters</span>
          </div>
          <div className="stat">
            <CountUp value={100} suffix="%" />
            <span>Original</span>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-head reveal">
          <div>
            <span className="section-index">// 01 — FOUNDATIONS</span>
            <h2>Concepts &amp; Building Blocks</h2>
          </div>
          <Link href="/concepts">all concepts →</Link>
        </div>
        <p className="section-lead reveal">
          The vocabulary of distributed systems. Understand these and most
          designs become a matter of composition.
        </p>
        <div className="card-grid">
          {concepts.map((d, i) => (
            <DocCard key={d.slug} doc={d} base="concepts" i={i} />
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-head reveal">
          <div>
            <span className="section-index">// 02 — APPLIED</span>
            <h2>System Design Case Studies</h2>
          </div>
          <Link href="/case-studies">all case studies →</Link>
        </div>
        <p className="section-lead reveal">
          Full walkthroughs: requirements, estimates, API, data model, and the
          architecture — with interactive blueprints and the trade-offs that
          matter.
        </p>
        <div className="card-grid">
          {cases.map((d, i) => (
            <DocCard key={d.slug} doc={d} base="case-studies" i={i} />
          ))}
        </div>
      </section>
    </div>
  );
}

function DocCard({ doc, base, i }) {
  return (
    <Link
      href={`/${base}/${doc.slug}`}
      className="card reveal"
      style={{ animationDelay: `${(i % 6) * 45}ms` }}
    >
      <span className="card-index">{String(i + 1).padStart(2, "0")}</span>
      <div className="card-head">
        <h3>{doc.title}</h3>
        {doc.difficulty && (
          <span className={`pill pill-${doc.difficulty.toLowerCase()}`}>
            {doc.difficulty}
          </span>
        )}
      </div>
      <p>{doc.summary}</p>
      <span className="card-meta">{doc.readingTime} MIN READ</span>
    </Link>
  );
}
