"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

export default function TopBar() {
  const pathname = usePathname();
  const is = (p) => pathname.startsWith(p);

  function openKbar() {
    window.dispatchEvent(new Event("kbar:open"));
  }

  return (
    <header className="topbar">
      <button className="menu-btn" aria-label="Toggle navigation" data-menu-toggle>
        <span></span>
        <span></span>
        <span></span>
      </button>
      <Link href="/" className="brand">
        <span className="brand-mark">HLD</span>
        <span className="brand-text">
          the&nbsp;<b>handbook</b>
        </span>
      </Link>
      <div className="topbar-spacer" />
      <Link className={`topbar-link ${is("/concepts") ? "active" : ""}`} href="/concepts">
        concepts
      </Link>
      <Link
        className={`topbar-link ${is("/case-studies") ? "active" : ""}`}
        href="/case-studies"
      >
        case_studies
      </Link>
      <button className="kbar-trigger" onClick={openKbar} aria-label="Search">
        <span>⌕</span>
        <span className="label">Search</span>
        <span className="kbd">⌘K</span>
      </button>
      <ThemeToggle />
    </header>
  );
}
