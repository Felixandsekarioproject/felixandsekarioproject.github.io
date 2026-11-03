import type { Metadata } from "next";
import Link from "next/link";
import { cases } from "@/lib/cases";

export const metadata: Metadata = { title: "You be the judge" };

export default function JudgeIndex() {
  return (
    <div className="wrap">
      <header className="hero narrow">
        <p className="kicker">Real Supreme Court cases</p>
        <h1>You be the judge</h1>
        <p className="lead">
          Read the facts of a real case, decide how you think the Supreme Court ruled, then see what actually
          happened and why.
        </p>
      </header>

      <div className="narrow">
        <h2>How it works</h2>
        <ol>
          <li><strong>Read the case.</strong> The facts come from the Court&apos;s own opinion.</li>
          <li><strong>Make your decision.</strong> Pick the outcome you think the Court chose.</li>
          <li><strong>See the real ruling.</strong> Find out how each justice voted, and read both sides in their own words.</li>
        </ol>
        <p className="callout">
          Good to know: the Supreme Court is not a trial. There is no jury and no new evidence. The justices decide
          what the law or the Constitution means. Many cases are decided by a close vote, so a different answer is
          not necessarily &quot;wrong&quot;.
        </p>
      </div>

      <h2>The cases</h2>
      <ol className="case-list">
        {cases.map((c, i) => (
          <li key={c.id}>
            <Link prefetch={false} href={`/judge/${c.id}/`} className="case-card">
              <span className="case-num">{i + 1}</span>
              <span className="case-body">
                <span className="case-name">{c.name} <span className="muted">({c.year})</span></span>
                <span className="case-teaser">{c.teaser}</span>
                <span className="pill">{c.kind}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
      <p className="muted small">
        Cases are listed in time order. Each later case builds on the earlier ones, so starting with case 1 helps.
      </p>
    </div>
  );
}
