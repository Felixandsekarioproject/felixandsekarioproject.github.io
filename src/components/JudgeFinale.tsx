"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export type CaseSummary = { id: string; short: string; split: boolean };

const KEY = "judge-results";

/** Remember whether this visitor's prediction matched the Court (this browser only). */
export function saveResult(id: string, matched: boolean) {
  try {
    const all = JSON.parse(localStorage.getItem(KEY) ?? "{}");
    all[id] = matched;
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {}
}

/** The ending after the last case: what you predicted, how split the Court was, and where to go next. */
export default function JudgeFinale({ cases }: { cases: CaseSummary[] }) {
  const [results, setResults] = useState<Record<string, boolean>>({});
  useEffect(() => {
    try {
      setResults(JSON.parse(localStorage.getItem(KEY) ?? "{}")); // eslint-disable-line react-hooks/set-state-in-effect
    } catch {}
  }, []);

  const done = cases.filter((c) => c.id in results);
  const matched = done.filter((c) => results[c.id]).length;
  const splits = cases.filter((c) => c.split).length;
  const allDone = done.length === cases.length;

  return (
    <section className="judge-finale" aria-labelledby="finale-judge">
      <p className="kicker">The end of the path</p>
      <h2 id="finale-judge">{allDone ? `You judged all ${cases.length} cases.` : "You reached the last case."}</h2>

      <ol className="verdicts" aria-label="Your predictions">
        {cases.map((c, i) => {
          const state = !(c.id in results) ? "open" : results[c.id] ? "same" : "diff";
          const label = state === "open" ? "not decided yet" : state === "same" ? "same as the Court" : "different from the Court";
          return (
            <li key={c.id} className={`verdict v-${state}`}>
              <Link prefetch={false} href={`/judge/${c.id}/`}>
                <span className="verdict-mark" aria-hidden="true">{i + 1}</span>
                <span className="verdict-name">{c.short}</span>
                <span className="verdict-state">{label}</span>
              </Link>
            </li>
          );
        })}
      </ol>

      <p className="finale-lead">
        {done.length > 0 && (
          <>
            You predicted the Court&apos;s answer in <strong>{matched} of {done.length}</strong>{" "}
            {done.length === 1 ? "case" : "cases"}.{" "}
          </>
        )}
        The justices disagreed too: <strong>{splits} of these {cases.length}</strong> cases were split decisions.
        Thinking differently from the Court does not make you wrong.
      </p>

      <p className="finale-close">
        Courts decide what the law means. Voters and lawmakers decide what it should be.
      </p>

      <ul className="finale-links">
        <li><Link prefetch={false} href="/disagreements/">Revisit the four voices</Link></li>
        <li><Link prefetch={false} href="/states/">Look up your state</Link></li>
        <li><Link prefetch={false} href="/judge/">All cases</Link></li>
      </ul>
    </section>
  );
}
