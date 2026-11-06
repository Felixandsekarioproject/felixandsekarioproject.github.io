import type { Metadata } from "next";
import Link from "next/link";
import { PerspectiveExplorer, Reflection } from "@/components/Perspectives";
import { people, positions } from "@/data/disagreements";

export const metadata: Metadata = { title: "Disagreements: Gun rights vs. gun control" };

export default function DisagreementsPage() {
  return (
    <div className="wrap disagreements">
      <header className="hero narrow">
        <p className="kicker">Disagreements</p>
        <h1>Gun rights vs. gun control</h1>
        <p className="lead">
          Few questions split Americans like guns. Both sides say they are protecting liberty. They disagree
          about what liberty needs: fewer guns in the wrong hands, or the freedom to defend yourself.
        </p>
      </header>

      <div className="narrow">
        <p className="read-key small">
          <strong>How to read this page:</strong> <span className="label-tag tag-fact">Fact</span> dates and events,
          checked against sources. <span className="label-tag tag-arg">Argument</span> what each person claimed.{" "}
          <span className="label-tag tag-int">Interpretation</span> how they understand liberty.{" "}
          <span className="label-tag tag-own">Analysis</span> this project&apos;s own reading.
        </p>
      </div>

      <PerspectiveExplorer />

      <section className="narrow" aria-labelledby="core">
        <h2 id="core">The central disagreement</h2>
        <div className="question">
          <p className="kicker">The question</p>
          <p className="q-text">
            Does protecting liberty require stronger gun regulations, or stronger protection of the right to bear
            arms?
          </p>
        </div>
        <div className="sides">
          {positions.map((x) => (
            <div key={x.id} className="side">
              <p className="side-label">{x.label}</p>
              <p>{x.claim}</p>
              <p className="small muted" style={{ marginTop: 8 }}>{x.voices}</p>
            </div>
          ))}
        </div>

        <Reflection />

        <details>
          <summary>Were they debating each other?</summary>
          <p>
            <span className="label-tag tag-fact">Fact</span> No. The four statements came years apart (2012, 2015,
            2019, 2022) and each responded to a different shooting. None of them answers the others directly.
          </p>
          <p>
            <span className="label-tag tag-own">Analysis</span> Together they show a wider disagreement in American
            politics. It is not simply safety against freedom. All four say they want to protect people; they
            disagree about the role of government, what the Second Amendment protects, and the best way to keep
            citizens safe. Trump does not simply repeat the NRA: his administration banned bump stocks, and he
            called for red flag laws, while LaPierre focused on armed security. Biden and Obama also differ: Obama called inaction a political choice, while Biden signed a compromise that both parties voted for. That law gives states money for red flag programs, the same idea Trump had called for in 2019.
          </p>
          <p>
            The courts are part of this argument too. See how the Supreme Court decided real gun cases in{" "}
            <Link prefetch={false} href="/judge/">You be the judge</Link>, including the bump stock case,{" "}
            <Link prefetch={false} href="/judge/cargill/">Garland v. Cargill</Link>.
          </p>
        </details>
      </section>

      <section className="narrow" aria-labelledby="ds-sources">
        <h2 id="ds-sources">Sources</h2>
        <div className="small">
        <ul>
          {people.map((p) => (
            <li key={p.id}>
              {p.name}, &ldquo;{p.source.title}.&rdquo; {p.source.date}. {p.source.where}.{" "}
              {p.source.url && <><a href={p.source.url} target="_blank" rel="noreferrer">Transcript</a>.</>}{" "}
              {p.source.check}
            </li>
          ))}
        </ul>
        </div>
        <p className="small muted">
          Photos: {people.map((p) => `${p.name}: ${p.photoCredit}`).join(". ")}.
        </p>
      </section>

      <section className="finale" aria-labelledby="finale-h">
        <p className="kicker">Your turn</p>
        <h2 id="finale-h">Now you be the judge.</h2>
        <p>
          You have seen the numbers, the laws and the arguments. Nine justices had to turn arguments like these into
          rulings. Decide six real Supreme Court gun cases, then see how they ruled.
        </p>
        <Link prefetch={false} href="/judge/heller/" className="btn">Start with case 1: D.C. v. Heller →</Link>
      </section>
    </div>
  );
}
