import Link from "next/link";
import Markdown from "@/components/Markdown";
import Toc from "@/components/Toc";
import { extractToc, getDocsByCategory } from "@/lib/content";

const CATEGORY_LABEL = {
  concepts: "Concepts",
  "case-studies": "Case Studies",
};

export default function DocView({ doc, category }) {
  const toc = extractToc(doc.content);
  const all = getDocsByCategory(category);
  const idx = all.findIndex((d) => d.slug === doc.slug);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx < all.length - 1 ? all[idx + 1] : null;

  return (
    <div className="doc-layout">
      <article className="doc">
        <nav className="breadcrumbs">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href={`/${category}`}>{CATEGORY_LABEL[category]}</Link>
        </nav>
        <header className="doc-header">
          <h1>{doc.title}</h1>
          {doc.summary && <p className="doc-summary">{doc.summary}</p>}
          <div className="doc-meta">
            {doc.difficulty && (
              <span className={`pill pill-${doc.difficulty.toLowerCase()}`}>
                {doc.difficulty}
              </span>
            )}
            <span>{doc.readingTime} min read</span>
            {doc.tags?.map((t) => (
              <span className="tag" key={t}>
                #{t}
              </span>
            ))}
          </div>
        </header>

        <Markdown>{doc.content}</Markdown>

        <nav className="doc-pager">
          {prev ? (
            <Link href={`/${category}/${prev.slug}`} className="pager prev">
              <span>← Previous</span>
              <strong>{prev.title}</strong>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/${category}/${next.slug}`} className="pager next">
              <span>Next →</span>
              <strong>{next.title}</strong>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </article>
      <Toc items={toc} />
    </div>
  );
}
