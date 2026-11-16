import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="wrap narrow">
      <header className="hero">
        <p className="kicker">404</p>
        <h1>This page does not exist</h1>
        <p className="lead">The link may be mistyped, or the page has moved. Try one of these instead.</p>
      </header>
      <ol className="next-steps">
        <li><Link href="/">Home and the map</Link><span className="muted">Gun deaths in every state</span></li>
        <li><Link href="/states/">States</Link><span className="muted">Look up one state</span></li>
        <li><Link href="/disagreements/">Disagreements</Link><span className="muted">Gun rights vs. gun control</span></li>
        <li><Link href="/judge/">You be the judge</Link><span className="muted">Decide real Supreme Court cases</span></li>
      </ol>
    </div>
  );
}
