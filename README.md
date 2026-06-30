# The HLD Handbook

[![CI](https://github.com/CodeForContribute/hld-handbook/actions/workflows/ci.yml/badge.svg)](https://github.com/CodeForContribute/hld-handbook/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-15-000?logo=next.js)](https://nextjs.org)
[![Deploy on Render](https://img.shields.io/badge/Render-static%20site-46E3B7?logo=render&logoColor=white)](https://render.com)

A comprehensive, **original** High-Level Design (system design) handbook built with Next.js (App Router). Markdown-driven content covering the building-block concepts and end-to-end case studies that the popular system-design resources teach — written from first principles, so it's yours to own and extend.

## Contents

- **19 concept pages** — scalability fundamentals, load balancing, caching, CAP/PACELC, replication, sharding, consistent hashing, SQL vs NoSQL, message queues, CDNs, API design, consensus, rate limiting, bloom filters, storage engines, consistency & transactions, proxies/gateways, observability/reliability, networking basics.
- **15 case studies** — URL shortener, rate limiter, Pastebin, Twitter/news feed, chat, Instagram, notifications, typeahead, web crawler, YouTube/Netflix, Dropbox/Drive, Uber, Ticketmaster, distributed cache, Google Maps.

Each case study follows a consistent playbook: requirements → capacity estimation → API → data model → architecture → deep dives → bottlenecks → trade-offs.

## Run it

```bash
npm install      # already done
npm run dev      # dev server with hot reload → http://localhost:3000
# or
npm run build && npm run start   # production build
```

## Add or edit content

Content is just Markdown in `content/`:

```
content/
  concepts/<slug>.md
  case-studies/<slug>.md
```

Each file starts with frontmatter:

```yaml
---
title: "Caching"
slug: "caching"
category: "concepts"        # or "case-studies"
order: 3                      # sort order in the sidebar
difficulty: "Beginner"       # Beginner | Intermediate | Advanced
summary: "One-line description."
tags: ["caching", "performance"]
---
```

Drop in a new `.md` file with valid frontmatter and it automatically appears in the
navigation, search, category index, and gets its own statically-generated page.
`##`/`###` headings become the on-page table of contents.

### Rich content blocks

Beyond standard markdown, four fenced-code languages render as interactive UI
(intercepted in `components/Markdown.js`):

- ` ```mermaid ` — flowcharts / sequence diagrams (theme-aware SVG).
- ` ```api ` — JSON → styled endpoint cards (method badges, params, sample req/resp).
  Schema: `{ "endpoints": [{ method, path, auth?, desc, request?, responses:[{status, body?, desc?}], notes? }] }`.
- ` ```datamodel ` — JSON → ER-style entity cards (PK/FK/CK badges, store badge, relationships).
  Schema: `{ "entities": [{ name, store, fields:[{name, type, key?, note?}], partitionKey?, notes? }], "relationships":[{from, to, kind, label?}] }`.
- ` ```arch ` — JSON → a real **Excalidraw** architecture diagram, embedded inline with
  numbered flow steps + per-component metadata, expandable to a full pan/zoom/edit canvas
  (and downloadable as a `.excalidraw` file). Schema:
  `{ title, nodes:[{id, label, type, col, row, meta?}], edges:[{from, to, step?, label?}], groups?:[{label, nodes:[id]}] }`.
  `type` ∈ `client | lb | gateway | service | worker | cache | queue | db | blob | cdn | search | external`
  (each maps to a color + icon). Layout is deterministic: `col` = left→right tier, `row` =
  position within the tier. The generator lives in `lib/arch-to-excalidraw.js`.

Every block degrades to a readable code box if its JSON is malformed, so one bad spec
never blanks a page.

## Project structure

```
app/                       # Next.js App Router pages
  page.js                  # home
  concepts/                # index + [slug] dynamic page
  case-studies/            # index + [slug] dynamic page
  layout.js, globals.css
components/                # Sidebar, ThemeToggle, Markdown, Toc, DocView
lib/content.js            # reads + parses markdown, search index, TOC
content/                  # all the Markdown source
```

## Features

- Sidebar navigation with live client-side search
- Dark / light theme toggle (persisted)
- Per-page table of contents, prev/next pager, breadcrumbs
- Syntax-highlighted code blocks, GFM tables, responsive mobile drawer
- Fully static export — deployable to Vercel, Netlify, GitHub Pages, or any static host

> Content is original educational material. It is not copied from any third-party site.
