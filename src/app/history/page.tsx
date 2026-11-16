import type { Metadata } from "next";
import Link from "next/link";
import Timeline, { type TEvent } from "@/components/Timeline";
import raw from "@/data/timeline.json";

export const metadata: Metadata = { title: "History of gun laws" };

const data = raw as unknown as { meta: { checked: string }; events: TEvent[] };

export default function HistoryPage() {
  return (
    <div className="wrap">
      <header className="hero narrow">
        <p className="kicker">Timeline</p>
        <h1>How we got here</h1>
        <p className="lead">
          From 1791 to today: the laws, Supreme Court decisions and events that shaped gun rules in the United
          States. Filter by type, and open &quot;Source&quot; to see where each fact comes from.
        </p>
      </header>

      <Timeline events={data.events} />

      <div className="narrow">
        <h2>About this timeline</h2>
        <p className="small">
          This timeline does not include every gun law or event. We chose moments that help explain today&apos;s
          laws, the state differences on this site, and the court cases in{" "}
          <Link href="/judge/">You be the judge</Link>. Every fact is checked against an official source: the National
          Archives, the U.S. Statutes at Large, Supreme Court opinions and dockets, the RAND State Firearm Law
          Database, and CDC data. Last checked {data.meta.checked}.
        </p>
      </div>
    </div>
  );
}
