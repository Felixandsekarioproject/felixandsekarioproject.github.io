import type { LawEntry, Policy } from "@/lib/laws";
import { statusColor, statusText } from "@/lib/laws";

/** One state's law on one topic: plain-language status + expandable legal details. */
export default function LawCell({ p, entry }: { p: Policy; entry: LawEntry }) {
  return (
    <div className="law-cell">
      <div className="law-status">
        <span className="swatch" style={{ background: statusColor(p, entry.status) }} aria-hidden="true" />
        <span>
          <strong>{statusText(p, entry.status)}</strong>
          {entry.detail && <span className="law-detail">{entry.detail}</span>}
        </span>
      </div>
      {entry.evidence.length > 0 ? (
        <details className="law-more">
          <summary>Legal details</summary>
          <ul>
            {entry.evidence.map((e) => (
              <li key={e.lawId}>
                <div>
                  <span className="muted">RAND category:</span> {e.category} ({e.guns})
                </div>
                {e.citation && (
                  <div>
                    <span className="muted">Law:</span> {e.citation}
                  </div>
                )}
                {e.effective && (
                  <div>
                    <span className="muted">In effect since:</span> {e.effective}
                    {e.notYetInEffect && " (not yet in effect)"}
                  </div>
                )}
                {e.note && (
                  <div className="law-note">
                    <span className="muted">RAND note:</span> {e.note}
                  </div>
                )}
                {e.discrepancy && (
                  <div className="law-note">
                    <span className="muted">Sources disagree:</span> {e.discrepancy}
                  </div>
                )}
                <div className="muted small">RAND law ID {e.lawId}</div>
              </li>
            ))}
          </ul>
        </details>
      ) : (
        <p className="muted small law-none">No law of this type in RAND&apos;s database.</p>
      )}
    </div>
  );
}
