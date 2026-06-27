"use client";

import { useEffect, useId, useState } from "react";

export default function Mermaid({ chart }) {
  const reactId = useId();
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function render() {
      const mermaid = (await import("mermaid")).default;
      const isLight = document.documentElement.classList.contains("light");
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "loose",
        theme: isLight ? "neutral" : "dark",
        fontFamily: "inherit",
        themeVariables: isLight
          ? {
              primaryColor: "#dff6fb",
              primaryTextColor: "#0c1626",
              primaryBorderColor: "#0a93a8",
              lineColor: "#5f8294",
              secondaryColor: "#eef3f9",
              tertiaryColor: "#ffffff",
              fontFamily: "var(--font-mono), monospace",
              fontSize: "13px",
            }
          : {
              primaryColor: "#111b30",
              primaryTextColor: "#dde6f2",
              primaryBorderColor: "#34e4ff",
              lineColor: "#3a5a78",
              secondaryColor: "#0c1322",
              tertiaryColor: "#0a1120",
              fontFamily: "var(--font-mono), monospace",
              fontSize: "13px",
            },
        flowchart: { curve: "basis", htmlLabels: true, padding: 12 },
        sequence: { useMaxWidth: true },
      });

      const id = "mmd-" + reactId.replace(/[^a-zA-Z0-9]/g, "");
      try {
        const { svg } = await mermaid.render(id, chart);
        if (!cancelled) {
          setSvg(svg);
          setError("");
        }
      } catch (e) {
        if (!cancelled) setError(String(e?.message || e));
      }
    }

    render();

    // Re-render when the theme toggles.
    const observer = new MutationObserver(render);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [chart, reactId]);

  if (error) {
    return (
      <pre className="mermaid-error">
        Diagram failed to render:{"\n"}
        {error}
      </pre>
    );
  }

  return (
    <figure
      className="mermaid-diagram"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
