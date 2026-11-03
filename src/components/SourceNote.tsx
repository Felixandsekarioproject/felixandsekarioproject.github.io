import Link from "next/link";
import { meta } from "@/lib/data";

/** "Where does this number come from?" — shown next to every statistic. */
export default function SourceNote({ extra }: { extra?: React.ReactNode }) {
  return (
    <details className="source-note">
      <summary>Where do these numbers come from?</summary>
      <dl>
        <dt>Source</dt>
        <dd>
          <a href={meta.sourceUrl} target="_blank" rel="noreferrer">
            {meta.publisher}: {meta.sourceName}
          </a>
        </dd>
        <dt>Based on</dt>
        <dd>
          {meta.underlyingSource} (
          <a href={meta.underlyingSourceUrl} target="_blank" rel="noreferrer">
            CDC WONDER
          </a>
          )
        </dd>
        <dt>What is counted</dt>
        <dd>{meta.measure}</dd>
        <dt>Rate</dt>
        <dd>{meta.rateDefinition}</dd>
        <dt>Downloaded</dt>
        <dd>{meta.retrieved}</dd>
        <dt>Checked</dt>
        <dd>State numbers add up exactly to CDC&apos;s national totals (2021, 2023, 2024).</dd>
        {extra}
      </dl>
      <p>
        <Link prefetch={false} href="/sources/">Read more about our sources and methods →</Link>
      </p>
    </details>
  );
}
