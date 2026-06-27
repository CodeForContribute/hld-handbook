// Server component: renders an API spec (JSON) as styled endpoint cards.

function pretty(body) {
  if (body == null) return "";
  if (typeof body === "string") return body;
  try {
    return JSON.stringify(body, null, 2);
  } catch {
    return String(body);
  }
}

function IO({ label, body, kind, status }) {
  return (
    <details className="api-io-item" data-kind={kind}>
      <summary>
        <span className={`api-io-label ${status ? statusClass(status) : ""}`}>
          {label}
        </span>
      </summary>
      <pre>
        <code>{pretty(body)}</code>
      </pre>
    </details>
  );
}

function statusClass(status) {
  const n = parseInt(status, 10);
  if (n >= 500) return "st-5xx";
  if (n >= 400) return "st-4xx";
  if (n >= 300) return "st-3xx";
  return "st-2xx";
}

export default function ApiBlock({ data: raw }) {
  let spec;
  try {
    spec = JSON.parse(raw);
  } catch (e) {
    return (
      <pre className="diagram-error">
        API spec JSON error:{"\n"}
        {String(e?.message || e)}
      </pre>
    );
  }

  const endpoints = spec.endpoints || [];

  return (
    <div className="api-block">
      {endpoints.map((ep, i) => (
        <div className="api-card" key={i}>
          <div className="api-card-head">
            <span className={`api-method m-${String(ep.method || "").toLowerCase()}`}>
              {ep.method}
            </span>
            <code className="api-path">{ep.path}</code>
            {ep.auth && <span className="api-auth">🔒 {ep.auth}</span>}
          </div>
          {ep.desc && <p className="api-desc">{ep.desc}</p>}
          {(ep.request || (ep.responses && ep.responses.length > 0)) && (
            <div className="api-io">
              {ep.request && (
                <IO label="Request" body={ep.request} kind="req" />
              )}
              {(ep.responses || []).map((r, j) => (
                <IO
                  key={j}
                  label={`${r.status}${r.desc ? " · " + r.desc : ""}`}
                  body={r.body}
                  status={r.status}
                  kind="res"
                />
              ))}
            </div>
          )}
          {ep.notes && <p className="api-notes">ℹ {ep.notes}</p>}
        </div>
      ))}
    </div>
  );
}
