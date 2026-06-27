import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";

const CONTENT_DIR = path.join(process.cwd(), "content");

const CATEGORIES = {
  concepts: {
    slug: "concepts",
    label: "Concepts & Building Blocks",
    short: "Concepts",
  },
  "case-studies": {
    slug: "case-studies",
    label: "System Design Case Studies",
    short: "Case Studies",
  },
};

export function getCategories() {
  return CATEGORIES;
}

function readCategory(category) {
  const dir = path.join(CONTENT_DIR, category);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(raw);
      const slug = data.slug || file.replace(/\.md$/, "");
      return {
        slug,
        category,
        title: data.title || slug,
        summary: data.summary || "",
        order: data.order ?? 999,
        difficulty: data.difficulty || null,
        tags: data.tags || [],
        readingTime: estimateReadingTime(content),
        content,
      };
    })
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

export function getAllDocs() {
  return Object.keys(CATEGORIES).flatMap((c) => readCategory(c));
}

export function getDocsByCategory(category) {
  return readCategory(category);
}

export function getDoc(category, slug) {
  return readCategory(category).find((d) => d.slug === slug) || null;
}

export function getNav() {
  return Object.values(CATEGORIES).map((cat) => ({
    ...cat,
    docs: readCategory(cat.slug).map(({ content, ...meta }) => meta),
  }));
}

// Lightweight search index: strip markdown to plain-ish text.
export function getSearchIndex() {
  return getAllDocs().map(({ content, ...meta }) => ({
    ...meta,
    body: content
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/[#>*`_\-|]/g, " ")
      .replace(/\s+/g, " ")
      .slice(0, 4000),
  }));
}

export function extractToc(markdown) {
  const lines = markdown.split("\n");
  const toc = [];
  // Mirror rehype-slug: one slugger per document, slugging every heading in
  // order (so de-duplication matches the ids actually rendered in the DOM).
  const slugger = new GithubSlugger();
  let inFence = false;
  for (const line of lines) {
    if (line.trim().startsWith("```")) inFence = !inFence;
    if (inFence) continue;
    const m = /^(#{1,6})\s+(.*)$/.exec(line);
    if (!m) continue;
    const level = m[1].length;
    const text = m[2].replace(/[*`]/g, "").trim();
    const id = slugger.slug(text);
    if (level === 2 || level === 3) toc.push({ level, text, id });
  }
  return toc;
}

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function estimateReadingTime(content) {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}
