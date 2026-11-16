"use client";

import { useState } from "react";
import { bibliography, mlaUrl } from "@/data/bibliography";

/** Renders *text* as italics. */
function Rich({ text }: { text: string }) {
  return <>{text.split("*").map((part, i) => (i % 2 ? <em key={i}>{part}</em> : part))}</>;
}

const plain = bibliography.map((b) => b.text.replace(/\*/g, "") + (b.url ? `${mlaUrl(b.url)}.` : "")).join("\n\n");

export default function Bibliography() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(plain);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  return (
    <>
      <div className="bib-actions">
        <button type="button" className="btn ghost" onClick={copy}>Copy all {bibliography.length} entries</button>
        <span className="small muted" role="status">{copied ? "Copied. Italics are lost when copying as plain text." : ""}</span>
      </div>
      <ul className="bibliography">
        {bibliography.map((b) => (
          <li key={b.text}>
            <Rich text={b.text} />
            {b.url && (
              <>
                <a href={b.url} target="_blank" rel="noreferrer">{mlaUrl(b.url)}</a>.
              </>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
