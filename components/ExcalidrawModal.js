"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "@excalidraw/excalidraw/index.css";

const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  { ssr: false }
);

export default function ExcalidrawModal({ elements, title, onClose }) {
  const [edit, setEdit] = useState(false);
  const isLight =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("light");

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function download() {
    const data = {
      type: "excalidraw",
      version: 2,
      source: "hld-handbook",
      elements,
      appState: {
        viewBackgroundColor: isLight ? "#ffffff" : "#0b0e14",
        gridSize: null,
      },
      files: {},
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download =
      (title || "architecture")
        .replace(/[^\w]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .toLowerCase() + ".excalidraw";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal arch-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <strong>{title || "System Architecture"}</strong>
          <div className="modal-actions">
            <button onClick={() => setEdit((v) => !v)}>
              {edit ? "🔒 View" : "✏️ Edit"}
            </button>
            <button onClick={download}>⬇ .excalidraw</button>
            <button className="modal-close" onClick={onClose} aria-label="Close">
              ✕
            </button>
          </div>
        </div>
        <div className="modal-canvas">
          <Excalidraw
            initialData={{
              elements,
              appState: {
                theme: isLight ? "light" : "dark",
                viewBackgroundColor: isLight ? "#ffffff" : "#0b0e14",
              },
              scrollToContent: true,
            }}
            viewModeEnabled={!edit}
            UIOptions={{
              canvasActions: {
                loadScene: false,
                saveToActiveFile: false,
                export: false,
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
