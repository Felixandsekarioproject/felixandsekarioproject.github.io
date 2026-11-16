"use client";

import { useState } from "react";
import Link from "next/link";
import { compare, people, positions, type Person } from "@/data/disagreements";

type Id = Person["id"];

/** Portrait selector + side-by-side comparison. Picking a person highlights their column in the table. */
export function PerspectiveExplorer() {
  const [sel, setSel] = useState<Id>(people[0].id);
  const p = people.find((x) => x.id === sel)!;

  return (
    <>
      <section aria-labelledby="voices" className="screen-only">
        <h2 id="voices">Four voices</h2>
        <p>Choose a person to see what they argued, and when.</p>

        <div className="portraits" role="group" aria-label="Choose a perspective">
          {people.map((x) => (
            <button key={x.id} type="button" className="portrait" aria-pressed={sel === x.id} onClick={() => setSel(x.id)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={x.photo} alt="" width={120} height={150} loading="lazy" />
              <span className="portrait-name">{x.name}</span>
              <span className="portrait-meta">{x.year}</span>
            </button>
          ))}
        </div>

        <article key={p.id} className="perspective">
          <h3>
            {p.name} <span className="muted">· {p.role}</span>
          </h3>

          <dl className="ps-fields">
            <dt><span className="label-tag tag-fact">Fact</span> Context</dt>
            <dd>{p.context}</dd>
            <dt><span className="label-tag tag-arg">Argument</span> Main argument</dt>
            <dd>{p.argument}</dd>
            <dt><span className="label-tag tag-arg">Argument</span> Proposed solution</dt>
            <dd>{p.solution}</dd>
            <dt><span className="label-tag tag-int">Interpretation</span> Liberty means…</dt>
            <dd>{p.liberty}</dd>
          </dl>

          <blockquote className="quote">
            <p>&ldquo;{p.quote.text}&rdquo;</p>
            <footer>{p.quote.cite}</footer>
          </blockquote>

          <details className="ps-next">
            <summary>What happened next</summary>
            <p>
              <span className="label-tag tag-fact">Fact</span> {p.next.text}
            </p>
            {p.next.link && (
              <p className="small">
                <Link prefetch={false} href={p.next.link.href}>{p.next.link.label} →</Link>
              </p>
            )}
          </details>

          <p className="ps-cite small">
            <strong>Source:</strong> {p.source.title}, {p.source.date}. {p.source.where}.{" "}
            {p.source.url && (
              <a href={p.source.url} target="_blank" rel="noreferrer">
                Transcript
              </a>
            )}
          </p>
        </article>
      </section>

      <section aria-labelledby="compare-h">
        <h2 id="compare-h">Side by side</h2>
        <p>
          Short summaries of each statement, not facts about the world.{" "}
          <span className="screen-only">The highlighted column is the person you chose above; click a name to switch.</span>
        </p>
        <div className="table-scroll">
          <table className="data-table compare-table">
            <thead>
              <tr>
                <th scope="col"><span className="sr-only">Topic</span></th>
                {people.map((x) => (
                  <th key={x.id} scope="col" className={sel === x.id ? "is-sel" : undefined}>
                    <button type="button" className="th-btn" aria-pressed={sel === x.id} onClick={() => setSel(x.id)}>
                      {x.name}
                      <span className="th-year">{x.year}</span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compare.map((row) => (
                <tr key={row.topic}>
                  <th scope="row">{row.topic}</th>
                  {people.map((x) => (
                    <td key={x.id} className={sel === x.id ? "is-sel" : undefined}>
                      {row.cells[x.id]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

/** Pick the more convincing argument; then see its strengths and limits. Nothing is scored or saved. */
export function Reflection() {
  const [pick, setPick] = useState<string | null>(null);
  const pos = positions.find((x) => x.id === pick);

  return (
    <div className="think screen-only">
      <h3>Which argument do you find more convincing?</h3>
      <div className="seg seg-wrap" role="group" aria-label="Choose an argument">
        {positions.map((x) => (
          <button key={x.id} type="button" aria-pressed={pick === x.id} onClick={() => setPick(x.id)}>
            {x.label}
          </button>
        ))}
      </div>
      <div role="status">
        {pos && (
          <div key={pos.id} className="perspective reflect-out">
            <p className="small">
              <span className="label-tag tag-own">Analysis</span> Every position has strengths and limits. Neither is
              “the right answer.”
            </p>
            <div className="sides">
              <div className="side">
                <p className="side-label">Strengths</p>
                <ul>{pos.strengths.map((s) => <li key={s}>{s}</li>)}</ul>
              </div>
              <div className="side">
                <p className="side-label">Limitations</p>
                <ul>{pos.limits.map((s) => <li key={s}>{s}</li>)}</ul>
              </div>
            </div>
            <p className="small" style={{ marginTop: 12 }}>
              Now try the other side: what is the strongest point of the argument you did not pick?
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
