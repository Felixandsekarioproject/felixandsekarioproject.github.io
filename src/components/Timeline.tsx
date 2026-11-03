"use client";

import { useState } from "react";
import Link from "next/link";

export type TEvent = {
  id: string;
  date: string;
  display: string;
  type: "law" | "court" | "event" | "data";
  upcoming?: boolean;
  title: string;
  text: string;
  why: string;
  link?: { label: string; href: string };
  sources: { label: string; url: string; file: string; quote: string }[];
};

const TYPES: { id: TEvent["type"] | "all"; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "law", label: "Laws" },
  { id: "court", label: "Supreme Court" },
  { id: "event", label: "Events" },
  { id: "data", label: "Gun death numbers" },
];

const TAG: Record<TEvent["type"], string> = {
  law: "Law",
  court: "Supreme Court",
  event: "Event",
  data: "Data",
};

export default function Timeline({ events }: { events: TEvent[] }) {
  const [filter, setFilter] = useState<TEvent["type"] | "all">("all");
  const shown = events.filter((e) => filter === "all" || e.type === filter);

  return (
    <div>
      <div className="topic-tabs" role="group" aria-label="Filter the timeline">
        {TYPES.map((t) => (
          <button key={t.id} type="button" aria-pressed={filter === t.id} onClick={() => setFilter(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      <p className="muted small" aria-live="polite">
        Showing {shown.length} of {events.length} moments.
      </p>

      <ol className="timeline">
        {shown.map((e) => (
          <li key={e.id} className={`tl-item tl-${e.type}${e.upcoming ? " tl-upcoming" : ""}`}>
            <div className="tl-year" aria-hidden="true">{e.date.slice(0, 4)}</div>
            <div className="tl-marker" aria-hidden="true" />
            <article className="tl-card">
              <p className="tl-meta">
                <span className={`tl-tag tag-${e.type}`}>{e.upcoming ? "Coming up" : TAG[e.type]}</span>
                <time dateTime={e.date}>{e.display}</time>
              </p>
              <h3>{e.title}</h3>
              <p>{e.text}</p>
              <p className="tl-why">
                <strong>Why it matters: </strong>
                {e.why}
              </p>
              {e.link && (
                <p className="small">
                  <Link prefetch={false} href={e.link.href}>{e.link.label} →</Link>
                </p>
              )}
              <details className="law-more">
                <summary>Source</summary>
                <ul>
                  {e.sources.map((s, i) => (
                    <li key={i}>
                      <a href={s.url} target="_blank" rel="noreferrer">{s.label}</a>
                      {s.quote && <div className="law-note">&ldquo;{s.quote}&rdquo;</div>}
                    </li>
                  ))}
                </ul>
              </details>
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}
