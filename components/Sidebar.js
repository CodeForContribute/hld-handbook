"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function Sidebar({ nav }) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  // Wire the mobile hamburger button (lives in the top bar).
  useEffect(() => {
    const btn = document.querySelector("[data-menu-toggle]");
    if (!btn) return;
    const toggle = () => setOpen((o) => !o);
    btn.addEventListener("click", toggle);
    return () => btn.removeEventListener("click", toggle);
  }, []);

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return nav;
    return nav
      .map((cat) => ({
        ...cat,
        docs: cat.docs.filter(
          (d) =>
            d.title.toLowerCase().includes(q) ||
            d.summary.toLowerCase().includes(q) ||
            (d.tags || []).some((t) => t.toLowerCase().includes(q))
        ),
      }))
      .filter((cat) => cat.docs.length > 0);
  }, [nav, query]);

  return (
    <>
      <div
        className={`sidebar-scrim ${open ? "show" : ""}`}
        onClick={() => setOpen(false)}
      />
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-search">
          <input
            type="search"
            placeholder="Search topics…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search topics"
          />
        </div>
        <nav className="sidebar-nav">
          {filtered.map((cat) => (
            <div className="nav-group" key={cat.slug}>
              <Link href={`/${cat.slug}`} className="nav-group-title">
                {cat.label}
                <span className="nav-count">{cat.docs.length}</span>
              </Link>
              <ul>
                {cat.docs.map((doc) => {
                  const href = `/${cat.slug}/${doc.slug}`;
                  const active = pathname === href;
                  return (
                    <li key={doc.slug}>
                      <Link
                        href={href}
                        className={`nav-link ${active ? "active" : ""}`}
                      >
                        {doc.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="nav-empty">No topics match “{query}”.</p>
          )}
        </nav>
      </aside>
    </>
  );
}
