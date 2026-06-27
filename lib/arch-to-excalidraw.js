// Converts a compact architecture spec into Excalidraw element skeletons.
// The skeletons are turned into real elements with convertToExcalidrawElements()
// inside the client component (which owns the @excalidraw/excalidraw import).

export const TYPE_STYLE = {
  client: { bg: "#a5d8ff", stroke: "#1971c2", glyph: "👤", label: "Client" },
  lb: { bg: "#d0bfff", stroke: "#6741d9", glyph: "⚖️", label: "Load Balancer" },
  gateway: { bg: "#d0bfff", stroke: "#6741d9", glyph: "🚪", label: "API Gateway" },
  service: { bg: "#b2f2bb", stroke: "#2f9e44", glyph: "⚙️", label: "Service" },
  worker: { bg: "#d8f5a2", stroke: "#66a80f", glyph: "🔧", label: "Worker" },
  cache: { bg: "#ffec99", stroke: "#f08c00", glyph: "⚡", label: "Cache" },
  queue: { bg: "#ffd8a8", stroke: "#e8590c", glyph: "✉️", label: "Queue / Log" },
  db: { bg: "#bac8ff", stroke: "#4263eb", glyph: "🗄️", label: "Database" },
  blob: { bg: "#eebefa", stroke: "#ae3ec9", glyph: "🪣", label: "Object Store" },
  cdn: { bg: "#c3fae8", stroke: "#099268", glyph: "🌐", label: "CDN" },
  search: { bg: "#ffc9c9", stroke: "#e03131", glyph: "🔎", label: "Search Index" },
  external: { bg: "#dee2e6", stroke: "#868e96", glyph: "☁️", label: "External" },
};

const NODE_W = 190;
const NODE_H = 64;
const COL_STEP = 320;
const ROW_STEP = 150;
const X0 = 40;
const Y0 = 70;

const colX = (c) => X0 + c * COL_STEP;
const rowY = (r) => Y0 + r * ROW_STEP;

export function stepGlyph(n) {
  if (typeof n === "number" && n >= 1 && n <= 20) {
    return String.fromCharCode(0x2460 + n - 1); // ①..⑳
  }
  return n != null ? `(${n})` : "";
}

export function specToSkeleton(spec) {
  const nodes = spec.nodes || [];
  const edges = spec.edges || [];
  const groups = spec.groups || [];

  // Fallback layout for nodes missing col/row.
  nodes.forEach((n, i) => {
    if (typeof n.col !== "number") n.col = i;
    if (typeof n.row !== "number") n.row = 0;
  });
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

  const skeleton = [];

  // 1) Group frames (drawn first so they sit behind the nodes).
  for (const g of groups) {
    const members = (g.nodes || []).map((id) => byId[id]).filter(Boolean);
    if (!members.length) continue;
    const minCol = Math.min(...members.map((m) => m.col));
    const maxCol = Math.max(...members.map((m) => m.col));
    const minRow = Math.min(...members.map((m) => m.row));
    const maxRow = Math.max(...members.map((m) => m.row));
    const pad = 18;
    skeleton.push({
      type: "rectangle",
      x: colX(minCol) - pad,
      y: rowY(minRow) - pad - 16,
      width: colX(maxCol) + NODE_W - colX(minCol) + pad * 2,
      height: rowY(maxRow) + NODE_H - rowY(minRow) + pad * 2 + 16,
      backgroundColor: "transparent",
      strokeColor: "#adb5bd",
      strokeStyle: "dashed",
      strokeWidth: 1,
      roughness: 0,
      fillStyle: "solid",
    });
    skeleton.push({
      type: "text",
      x: colX(minCol) - pad + 6,
      y: rowY(minRow) - pad - 14,
      text: g.label || "",
      fontSize: 13,
      strokeColor: "#868e96",
    });
  }

  // 2) Nodes (rectangle + label, plus an optional meta line beneath).
  for (const n of nodes) {
    const style = TYPE_STYLE[n.type] || TYPE_STYLE.service;
    skeleton.push({
      type: "rectangle",
      id: n.id,
      x: colX(n.col),
      y: rowY(n.row),
      width: NODE_W,
      height: NODE_H,
      backgroundColor: style.bg,
      strokeColor: style.stroke,
      strokeWidth: 2,
      roughness: 1,
      fillStyle: "solid",
      label: {
        text: `${style.glyph} ${n.label}`,
        fontSize: 16,
        strokeColor: "#1e1e1e",
      },
    });
    if (n.meta) {
      skeleton.push({
        type: "text",
        x: colX(n.col),
        y: rowY(n.row) + NODE_H + 6,
        width: NODE_W,
        text: n.meta,
        fontSize: 11,
        strokeColor: "#868e96",
      });
    }
  }

  // 3) Edges as arrows bound to node ids, labelled with the flow step.
  for (const e of edges) {
    const from = byId[e.from];
    const to = byId[e.to];
    if (!from || !to) continue;
    const num = stepGlyph(e.step);
    const text = [num, e.label].filter(Boolean).join(" ");
    skeleton.push({
      type: "arrow",
      x: colX(from.col) + NODE_W,
      y: rowY(from.row) + NODE_H / 2,
      strokeColor: "#495057",
      strokeWidth: 2,
      roughness: 1,
      endArrowhead: "arrow",
      start: { id: from.id },
      end: { id: to.id },
      ...(text ? { label: { text, fontSize: 14, strokeColor: "#364fc7" } } : {}),
    });
  }

  return skeleton;
}
