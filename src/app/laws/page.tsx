import type { Metadata } from "next";
import Link from "next/link";
import LawExplorer from "@/components/LawExplorer";
import { getShapes, MAP_H, MAP_W } from "@/lib/geo";
import { lawMeta, lawStates, policies } from "@/lib/laws";

export const metadata: Metadata = { title: "Gun laws by state" };

export default function LawsPage() {
  return (
    <div className="wrap">
      <header className="hero narrow">
        <p className="kicker">Gun laws</p>
        <h1>Gun laws are different in every state</h1>
        <p className="lead">
          Some gun rules are the same everywhere because they are federal law. But states add their own rules, so
          what is allowed can change when you cross a state line. Explore six important topics below.
        </p>
      </header>

      <div className="note narrow">
        <strong>Laws as of {lawMeta.asOf}.</strong> Based on the RAND State Firearm Law Database. Laws passed
        after that date are not included, and some laws may be blocked by courts. This is for learning, not legal
        advice.
      </div>

      <LawExplorer policies={policies} states={lawStates} shapes={getShapes()} width={MAP_W} height={MAP_H} />

      <section className="narrow">
        <h2>Important to know</h2>
        <ul>
          <li>
            <strong>Federal law applies everywhere.</strong> For example, licensed dealers must run a background
            check, and some people (such as people convicted of felonies) may not have guns at all.
          </li>
          <li>
            <strong>Real laws have details.</strong> Each state wrote its law differently, and many have
            exceptions. Open &quot;Legal details&quot; in the comparison table to see the law itself.
          </li>
          <li>
            <strong>A law on this map is not proof of its effect.</strong> To learn whether a law reduces gun
            deaths, researchers compare states over many years. Map patterns alone cannot show that.
          </li>
          <li>
            <strong>Courts can change things.</strong> Some state laws are being challenged in court. See{" "}
            <Link prefetch={false} href="/judge/">You be the judge</Link> for how the Supreme Court decides these cases.
          </li>
        </ul>

        <h2>Source</h2>
        <p className="small">
          {lawMeta.citation}{" "}
          <a href={lawMeta.sourceUrl} target="_blank" rel="noreferrer">Dataset page</a>. License: {lawMeta.license}{" "}
          <strong>What we changed:</strong> {lawMeta.changes}
        </p>
      </section>
    </div>
  );
}
