"use client";

import { useState } from "react";

export default function CodeBlock({ lang, raw, children }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard?.writeText(raw).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="codeblock">
      <div className="codeblock-bar">
        <span className="codeblock-lang">{lang}</span>
        <button
          className={`codeblock-copy ${copied ? "copied" : ""}`}
          onClick={copy}
          aria-label="Copy code"
        >
          {copied ? "copied ✓" : "copy"}
        </button>
      </div>
      <pre>{children}</pre>
    </div>
  );
}
