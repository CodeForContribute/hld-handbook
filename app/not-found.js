import Link from "next/link";

export default function NotFound() {
  return (
    <div className="index-page" style={{ textAlign: "center", paddingTop: 70 }}>
      <p className="eyebrow" style={{ justifyContent: "center" }}>
        Error · 404
      </p>
      <h1
        className="mono"
        style={{ fontSize: "2.4rem", letterSpacing: "-0.02em", margin: "8px 0 14px" }}
      >
        Off the blueprint
      </h1>
      <p className="index-lead">
        That page isn&apos;t on the schematic. Head back and pick a topic from
        the index.
      </p>
      <p style={{ marginTop: 26 }}>
        <Link className="btn primary" href="/">
          ← Back to start
        </Link>
      </p>
    </div>
  );
}
