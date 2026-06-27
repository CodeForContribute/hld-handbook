"use client";

import { useEffect, useRef, useState } from "react";
import { specToSkeleton, TYPE_STYLE } from "@/lib/arch-to-excalidraw";
import ExcalidrawModal from "@/components/ExcalidrawModal";

export default function ArchitectureDiagram({ spec: raw }) {
  const ref = useRef(null);
  const [spec, setSpec] = useState(null);
  const [parseError, setParseError] = useState("");
  const [svg, setSvg] = useState("");
  const [elements, setElements] = useState(null);
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      setSpec(JSON.parse(raw));
      setParseError("");
    } catch (e) {
      setParseError(String(e?.message || e));
    }
  }, [raw]);

  // Defer the heavy Excalidraw import until the diagram scrolls near view.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Build the elements once, render a static SVG preview, re-theme on toggle.
  useEffect(() => {
    if (!visible || !spec) return;
    let cancelled = false;

    async function render() {
      const { convertToExcalidrawElements, exportToSvg } = await import(
        "@excalidraw/excalidraw"
      );
      const els = convertToExcalidrawElements(specToSkeleton(spec), {
        regenerateIds: true,
      });
      if (cancelled) return;
      setElements(els);

      const isLight = document.documentElement.classList.contains("light");
      const svgEl = await exportToSvg({
        elements: els,
        files: null,
        exportPadding: 18,
        appState: {
          exportWithDarkMode: !isLight,
          exportBackground: false,
          viewBackgroundColor: "transparent",
        },
      });
      const vb = (svgEl.getAttribute("viewBox") || "0 0 1000 600").split(/\s+/);
      const vbW = Math.round(parseFloat(vb[2]) || 1000);
      svgEl.removeAttribute("width");
      svgEl.removeAttribute("height");
      svgEl.style.width = "100%";
      svgEl.style.height = "auto";
      svgEl.style.display = "block";
      svgEl.style.maxWidth = `${vbW}px`;
      if (!cancelled) setSvg(svgEl.outerHTML);
    }

    render();
    const obs = new MutationObserver(render);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => {
      cancelled = true;
      obs.disconnect();
    };
  }, [visible, spec]);

  if (parseError) {
    return (
      <pre className="diagram-error">
        Architecture spec JSON error:{"\n"}
        {parseError}
      </pre>
    );
  }

  const nodes = spec?.nodes || [];
  const typesUsed = [...new Set(nodes.map((n) => n.type))].filter(
    (t) => TYPE_STYLE[t]
  );
  const metaNodes = nodes.filter((n) => n.meta);

  return (
    <figure className="arch-diagram" ref={ref}>
      <figcaption className="arch-caption">
        <span className="arch-title">{spec?.title || "System Architecture"}</span>
        <button
          className="arch-expand"
          onClick={() => setOpen(true)}
          disabled={!elements}
        >
          ⤢ Expand
        </button>
      </figcaption>

      <div className="arch-canvas">
        {svg ? (
          <div className="arch-svg-wrap" dangerouslySetInnerHTML={{ __html: svg }} />
        ) : (
          <div className="arch-loading">Rendering diagram…</div>
        )}
      </div>

      {typesUsed.length > 0 && (
        <div className="arch-legend">
          {typesUsed.map((t) => (
            <span className="arch-legend-item" key={t}>
              <span className="arch-legend-swatch" style={{ background: TYPE_STYLE[t].bg, borderColor: TYPE_STYLE[t].stroke }} />
              {TYPE_STYLE[t].glyph} {TYPE_STYLE[t].label}
            </span>
          ))}
        </div>
      )}

      {metaNodes.length > 0 && (
        <table className="arch-meta">
          <tbody>
            {metaNodes.map((n) => (
              <tr key={n.id}>
                <td className="arch-meta-node">
                  {(TYPE_STYLE[n.type] || {}).glyph} {n.label}
                </td>
                <td>{n.meta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {open && elements && (
        <ExcalidrawModal
          elements={elements}
          title={spec?.title}
          onClose={() => setOpen(false)}
        />
      )}
    </figure>
  );
}
