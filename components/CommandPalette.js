"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const CAT_LABEL = {
  concepts: "Concepts & Building Blocks",
  "case-studies": "Case Studies",
};

function score(item, q) {
  const t = item.title.toLowerCase();
  const s = (item.summary || "").toLowerCase();
  const tags = (item.tags || []).join(" ").toLowerCase();
  const body = (item.body || "").toLowerCase();
  if (t === q) return 1000;
  if (t.startsWith(q)) return 800;
  if (t.includes(q)) return 600;
  if (tags.includes(q)) return 400;
  if (s.includes(q)) return 300;
  if (body.includes(q)) return 100;
  return -1;
}

export default function CommandPalette({ index }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target.tagName || "").toLowerCase();
      const typing = tag === "input" || tag === "textarea";
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing && !open)) {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape" && open) {
        close();
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("kbar:open", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("kbar:open", onOpen);
    };
  }, [open, close]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 20);
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let items;
    if (!q) {
      items = index.slice();
    } else {
      items = index
        .map((it) => ({ it, sc: score(it, q) }))
        .filter((x) => x.sc >= 0)
        .sort((a, b) => b.sc - a.sc || a.it.order - b.it.order)
        .map((x) => x.it);
    }
    return items.slice(0, 24);
  }, [index, query]);

  useEffect(() => setActive(0), [query]);

  const go = useCallback(
    (item) => {
      if (!item) return;
      close();
      router.push(`/${item.category}/${item.slug}`);
    },
    [router, close]
  );

  function onInputKey(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(results.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[active]);
    }
  }

  useEffect(() => {
    const el = listRef.current?.querySelector(".kbar-item.active");
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!open) return null;

  // Group by category, preserving the scored order.
  const groups = [];
  const seen = {};
  for (const it of results) {
    if (!seen[it.category]) {
      seen[it.category] = { category: it.category, items: [] };
      groups.push(seen[it.category]);
    }
    seen[it.category].items.push(it);
  }
  let flatIdx = -1;

  return (
    <div className="kbar-overlay" onMouseDown={close}>
      <div className="kbar" onMouseDown={(e) => e.stopPropagation()}>
        <div className="kbar-input-row">
          <span className="prompt">⌕</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKey}
            placeholder="Search concepts and case studies…"
            aria-label="Search"
          />
          <span className="kbar-esc">ESC</span>
        </div>

        <div className="kbar-results" ref={listRef}>
          {results.length === 0 && (
            <div className="kbar-empty">No matches for “{query}”.</div>
          )}
          {groups.map((g) => (
            <div key={g.category}>
              <div className="kbar-group-label">{CAT_LABEL[g.category] || g.category}</div>
              {g.items.map((it) => {
                flatIdx++;
                const idx = flatIdx;
                return (
                  <div
                    key={it.slug}
                    className={`kbar-item ${idx === active ? "active" : ""}`}
                    onMouseEnter={() => setActive(idx)}
                    onClick={() => go(it)}
                  >
                    <span className="kbar-item-glyph" />
                    <span>
                      <div className="kbar-item-title">{it.title}</div>
                      <div className="kbar-item-sub">{it.summary}</div>
                    </span>
                    <span className="kbar-arrow">↵</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="kbar-foot">
          <span><b>↑↓</b> navigate</span>
          <span><b>↵</b> open</span>
          <span><b>esc</b> close</span>
        </div>
      </div>
    </div>
  );
}
