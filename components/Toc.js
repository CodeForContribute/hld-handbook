"use client";

import { useEffect, useState } from "react";

export default function Toc({ items }) {
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (!items || items.length === 0) return;
    const headings = items
      .map((it) => document.getElementById(it.id))
      .filter(Boolean);
    if (!headings.length) return;

    const visible = new Set();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        }
        // Highlight the first heading (in document order) currently visible.
        const firstVisible = headings.find((h) => visible.has(h.id));
        if (firstVisible) setActive(firstVisible.id);
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );
    headings.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [items]);

  if (!items || items.length === 0) return null;

  return (
    <aside className="toc">
      <p className="toc-title">On this page</p>
      <ul>
        {items.map((item, i) => (
          <li key={i} className={`toc-l${item.level}`}>
            <a
              href={`#${item.id}`}
              className={active === item.id ? "active" : ""}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
