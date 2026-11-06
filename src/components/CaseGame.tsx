"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Case } from "@/lib/cases";

type Step = "read" | "decide" | "reveal";

export default function CaseGame({ c, next }: { c: Case; next?: { id: string; name: string } }) {
  const [step, setStep] = useState<Step>("read");
  const [pick, setPick] = useState<number | null>(null);
  const [view, setView] = useState<"majority" | "other" | null>(null);
  // When a step's button disappears, move keyboard and screen-reader focus to the new step's heading.
  const focusNext = useRef(false);
  const decideRef = useRef<HTMLHeadingElement>(null);
  const revealRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (!focusNext.current) return;
    focusNext.current = false;
    (step === "decide" ? decideRef : step === "reveal" ? revealRef : null)?.current?.focus();
  }, [step]);
  const go = (s: Step) => { focusNext.current = true; setStep(s); };

  const o = c.outcome;
  const matched = pick === c.actual;
  const concur = o.concurInJudgment ?? [];

  return (
    <div className="case">
      <ol className="steps" aria-label="Progress">
        <li aria-current={step === "read" ? "step" : undefined} className={step === "read" ? "on" : "done"}>1. The case</li>
        <li aria-current={step === "decide" ? "step" : undefined} className={step === "decide" ? "on" : step === "reveal" ? "done" : ""}>2. Your decision</li>
        <li aria-current={step === "reveal" ? "step" : undefined} className={step === "reveal" ? "on" : ""}>3. What the Court decided</li>
      </ol>

      {/* STEP 1 — the case */}
      <section aria-labelledby="facts">
        <h2 id="facts">What happened</h2>
        {c.background.map((p, i) => (
          <p key={i}>{p}</p>
        ))}

        <div className="question">
          <p className="kicker">The question for the Court</p>
          <p className="q-text">{c.question}</p>
        </div>

        <h3>What the judges had to work with</h3>
        <p>{c.rule}</p>

        <h3>The two sides</h3>
        <div className="sides">
          {c.sides.map((s) => (
            <div key={s.label} className="side">
              <p className="side-label">{s.label}</p>
              <p>{s.text}</p>
            </div>
          ))}
        </div>

        {step === "read" && (
          <button type="button" className="btn" onClick={() => go("decide")}>
            I&apos;m ready to decide →
          </button>
        )}
      </section>

      {/* STEP 2 — decide */}
      {step !== "read" && (
        <section aria-labelledby="decide">
          <h2 id="decide" ref={decideRef} tabIndex={-1}>You be the judge</h2>
          <p>How do you think the Supreme Court decided? Pick one.</p>
          <fieldset className="choices" disabled={step === "reveal"}>
            <legend className="sr-only">Your prediction</legend>
            {c.choices.map((ch, i) => {
              const cls =
                step === "reveal" ? (i === c.actual ? "choice is-actual" : i === pick ? "choice is-wrong" : "choice") : "choice";
              return (
                <label key={i} className={cls}>
                  <input type="radio" name="pick" checked={pick === i} onChange={() => setPick(i)} />
                  <span>{ch}</span>
                  {step === "reveal" && i === c.actual && <span className="tag">The Court&apos;s answer</span>}
                </label>
              );
            })}
          </fieldset>
          {step === "decide" && (
            <button type="button" className="btn" disabled={pick === null} onClick={() => go("reveal")}>
              Show what the Court decided
            </button>
          )}
        </section>
      )}

      {/* STEP 3 — reveal */}
      {step === "reveal" && (
        <section aria-labelledby="reveal" className="reveal">
          <h2 id="reveal" ref={revealRef} tabIndex={-1}>What the Court decided</h2>
          <p className={matched ? "result match" : "result nomatch"} role="status">
            {matched
              ? "Your prediction matches the Court’s decision."
              : "The Court decided differently from your prediction. That doesn’t make your view “wrong.” The justices themselves often disagree."}
          </p>

          <p>{o.summary}</p>

          <div className="vote" aria-label={`Vote: ${o.vote}`}>
            <div className="vote-head">
              <span className="vote-num">{o.vote}</span>
              <span className="muted">Decided {c.decided}</span>
            </div>
            <ul className="seats">
              <li className="seat yes" title={`${o.author} (wrote the opinion)`}>
                <span className="dot" />
                {o.author.replace(/^(Chief )?Justice /, "")} <span className="muted">(author)</span>
              </li>
              {o.majority.map((j) => (
                <li key={j} className="seat yes"><span className="dot" />{j}</li>
              ))}
              {concur.map((j) => (
                <li key={j} className="seat partial"><span className="dot" />{j} <span className="muted">(same result, other reasons)</span></li>
              ))}
              {o.dissent.map((j) => (
                <li key={j} className="seat no"><span className="dot" />{j} <span className="muted">(dissent)</span></li>
              ))}
            </ul>
          </div>

          <p>{o.also}</p>

          <h3>In their own words</h3>
          <blockquote className="quote">
            <p>&ldquo;{o.majorityQuote.text}&rdquo;</p>
            <footer>{o.majorityQuote.who}, {o.majorityQuote.cite}</footer>
          </blockquote>
          <blockquote className="quote other">
            <p>&ldquo;{o.otherQuote.text}&rdquo;</p>
            <footer>{o.otherQuote.who}, {o.otherQuote.cite}</footer>
          </blockquote>
          <p>{o.otherSummary}</p>

          <h3>Is it still the law?</h3>
          <p>{c.today}</p>

          <div className="think">
            <h3>Think about it</h3>
            <p>{c.reflect}</p>
            <p className="small">Which reasoning do you find more convincing? (There is no right answer here.)</p>
            <div className="seg">
              <button type="button" aria-pressed={view === "majority"} onClick={() => setView("majority")}>
                The majority
              </button>
              <button type="button" aria-pressed={view === "other"} onClick={() => setView("other")}>
                {o.dissent.length ? "The dissent" : "The separate opinion"}
              </button>
            </div>
            {view && (
              <p className="small" role="status">
                {view === "majority"
                  ? `You sided with ${o.author}'s reasoning. Try to explain, in one sentence, the strongest point of the other side.`
                  : `You sided with ${o.otherQuote.who.split(",")[0]}. Try to explain, in one sentence, the strongest point of the majority.`}
              </p>
            )}
          </div>

          <p className="small">
            Read the full official opinion:{" "}
            <a href={c.opinionUrl} target="_blank" rel="noreferrer">
              {c.name}, {c.citation} (PDF)
            </a>
          </p>

          <div className="case-nav">
            <button type="button" className="btn ghost" onClick={() => { setStep("read"); setPick(null); setView(null); window.scrollTo({ top: 0 }); }}>
              Try this case again
            </button>
            {next ? (
              <Link prefetch={false} className="btn" href={`/judge/${next.id}/`}>Next case: {next.name} →</Link>
            ) : (
              <Link prefetch={false} className="btn" href="/judge/">Back to all cases</Link>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
