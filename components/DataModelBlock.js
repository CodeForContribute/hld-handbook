// Server component: renders a data-model spec (JSON) as ER-style entity cards.

function keyClass(key) {
  const k = key.toLowerCase();
  if (k.includes("pk")) return "k-pk";
  if (k.includes("ck")) return "k-ck";
  if (k.includes("fk")) return "k-fk";
  return "k-other";
}

export default function DataModelBlock({ data: raw }) {
  let spec;
  try {
    spec = JSON.parse(raw);
  } catch (e) {
    return (
      <pre className="diagram-error">
        Data model JSON error:{"\n"}
        {String(e?.message || e)}
      </pre>
    );
  }

  const entities = spec.entities || [];
  const relationships = spec.relationships || [];

  return (
    <div className="dm-block">
      <div className="dm-grid">
        {entities.map((en, i) => (
          <div className="dm-entity" key={i}>
            <div className="dm-entity-head">
              <strong>{en.name}</strong>
              {en.store && <span className="dm-store">{en.store}</span>}
            </div>
            <table className="dm-fields">
              <tbody>
                {(en.fields || []).map((f, j) => (
                  <tr key={j}>
                    <td className="dm-keycell">
                      {f.key && (
                        <span className={`dm-badge ${keyClass(f.key)}`}>
                          {f.key}
                        </span>
                      )}
                    </td>
                    <td className="dm-fname">{f.name}</td>
                    <td className="dm-ftype">{f.type}</td>
                    <td className="dm-fnote">{f.note || ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {en.partitionKey && (
              <div className="dm-pk">
                <span>Partition key</span> <code>{en.partitionKey}</code>
              </div>
            )}
            {en.notes && <p className="dm-notes">{en.notes}</p>}
          </div>
        ))}
      </div>

      {relationships.length > 0 && (
        <div className="dm-rels">
          <span className="dm-rels-title">Relationships</span>
          <div className="dm-rels-list">
            {relationships.map((r, i) => (
              <span className="dm-rel" key={i}>
                <code>{r.from}</code>
                <span className="dm-rel-kind">{r.kind || "—"}</span>
                <code>{r.to}</code>
                {r.label && <em>{r.label}</em>}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
