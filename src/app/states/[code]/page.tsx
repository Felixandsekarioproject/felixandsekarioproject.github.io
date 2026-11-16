import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import TrendChart from "@/components/TrendChart";
import SourceNote from "@/components/SourceNote";
import { LATEST_YEAR, YEARS, fmt, medianRate, pointFor, rangeRate, rankFor, stateByCode, states } from "@/lib/data";
import { getNeighbors } from "@/lib/geo";
import LawCell from "@/components/LawCell";
import { lawMeta, lawStates, policies } from "@/lib/laws";

export const dynamicParams = false;

export function generateStaticParams() {
  return states.map((s) => ({ code: s.code.toLowerCase() }));
}

export async function generateMetadata({ params }: PageProps<"/states/[code]">): Promise<Metadata> {
  const { code } = await params;
  const s = stateByCode.get(code.toUpperCase());
  return { title: s ? `${s.name}: gun deaths` : "State" };
}

export default async function StatePage({ params }: PageProps<"/states/[code]">) {
  const { code } = await params;
  const s = stateByCode.get(code.toUpperCase());
  if (!s) notFound();

  const latest = pointFor(s, LATEST_YEAR);
  const rank = rankFor(s.code, LATEST_YEAR);
  const median = medianRate(LATEST_YEAR);
  const base = pointFor(s, 2014);
  const change =
    latest?.rate != null && base?.rate != null ? ((latest.rate - base.rate) / base.rate) * 100 : null;

  const neighbors = getNeighbors(s.code)
    .map((c) => stateByCode.get(c)!)
    .map((n) => ({ n, p: pointFor(n, LATEST_YEAR) }))
    .sort((a, b) => (b.p?.rate ?? -1) - (a.p?.rate ?? -1));

  const compareWord =
    latest?.rate == null ? "" : latest.rate > median ? "higher than" : latest.rate < median ? "lower than" : "the same as";

  return (
    <article className="wrap">
      <header className="hero">
        <p className="kicker">
          <Link prefetch={false} href="/states/">States</Link> / {s.name}
        </p>
        <h1>{s.name}</h1>
        {latest?.rate != null && latest.deaths != null ? (
          <p className="lead">
            In {LATEST_YEAR}, <strong>{fmt.int(latest.deaths)} people</strong> in {s.name} died from gun injuries.
            That is <strong>{fmt.rate(latest.rate)} deaths per 100,000 people</strong>, which is {compareWord} the
            middle state ({fmt.rate(median)}).
          </p>
        ) : (
          <p className="lead">Data for {LATEST_YEAR} is not shown because there were fewer than 10 deaths.</p>
        )}
      </header>

      <div className="stats">
        <div className="stat">
          <div className="stat-value">{latest?.deaths != null ? fmt.int(latest.deaths) : "–"}</div>
          <div className="stat-label">gun deaths in {LATEST_YEAR}</div>
        </div>
        <div className="stat">
          <div className="stat-value">{latest?.rate != null ? fmt.rate(latest.rate) : "–"}</div>
          <div className="stat-label">per 100,000 people (age-adjusted)</div>
        </div>
        <div className="stat">
          <div className="stat-value">{rank ? `#${rank}` : "–"}</div>
          <div className="stat-label">of 51 (1 = highest rate)</div>
        </div>
        <div className="stat">
          <div className="stat-value">{change != null ? fmt.pct(change) : "–"}</div>
          <div className="stat-label">change in rate since 2014</div>
        </div>
      </div>

      <h2>How has it changed?</h2>
      <TrendChart
        title={`Gun death rate in ${s.name} compared with the middle state, ${YEARS[0]} to ${LATEST_YEAR}`}
        yLabel="Deaths per 100,000"
        series={[
          { label: s.name, color: "#5b3fa0", points: s.series.map((p) => ({ year: p.year, value: p.rate })) },
          {
            label: "Middle state (median of 51)",
            color: "#8a8693",
            dashed: true,
            points: YEARS.map((y) => ({ year: y, value: medianRate(y) })),
          },
        ]}
        band={YEARS.map((y) => {
          const [lo, hi] = rangeRate(y);
          return { year: y, lo, hi };
        })}
        bandLabel="Grey bar = lowest to highest state that year"
      />

      {neighbors.length > 0 && (
        <>
          <h2>Neighboring states</h2>
          <p>States that share a border with {s.name}, in {LATEST_YEAR}:</p>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">State</th>
                  <th scope="col" className="num">Rate per 100,000</th>
                  <th scope="col" className="num">Deaths</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>{s.name}</strong></td>
                  <td className="num"><strong>{latest?.rate != null ? fmt.rate(latest.rate) : "–"}</strong></td>
                  <td className="num"><strong>{latest?.deaths != null ? fmt.int(latest.deaths) : "–"}</strong></td>
                </tr>
                {neighbors.map(({ n, p }) => (
                  <tr key={n.code}>
                    <td><Link prefetch={false} href={`/states/${n.code.toLowerCase()}/`}>{n.name}</Link></td>
                    <td className="num">{p?.rate != null ? fmt.rate(p.rate) : "Not shown"}</td>
                    <td className="num">{p?.deaths != null ? fmt.int(p.deaths) : "Not shown"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            <Link prefetch={false} href={`/compare/?states=${[s.code, ...neighbors.slice(0, 3).map((x) => x.n.code)].join(",")}`}>
              Compare {s.name} with its neighbors over time →
            </Link>
          </p>
        </>
      )}

      <h2 id="laws">Gun laws in {s.name}</h2>
      <p>
        Six important topics, as of {lawMeta.asOf} (source: RAND State Firearm Law Database). Open &quot;Legal
        details&quot; to see the law itself.
      </p>
      <div className="table-scroll">
        <table className="law-table single">
          <tbody>
            {policies.map((x) => (
              <tr key={x.id}>
                <th scope="row">
                  {x.title}
                  <span className="law-q">{x.question}</span>
                </th>
                <td>
                  <LawCell p={x} entry={lawStates[s.code].laws[x.id]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        <Link prefetch={false} href={`/laws/?states=${[s.code, ...getNeighbors(s.code).slice(0, 3)].join(",")}#compare`}>
          Compare {s.name}&apos;s laws with its neighbors →
        </Link>
      </p>
      <p className="muted small">
        Laws passed after {lawMeta.asOf} are not included. This is for learning, not legal advice.
      </p>

      <h2>All years</h2>
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Year</th>
              <th scope="col" className="num">Deaths</th>
              <th scope="col" className="num">Rate per 100,000</th>
              <th scope="col" className="num">Rank (of 51)</th>
            </tr>
          </thead>
          <tbody>
            {[...s.series].reverse().map((p) => (
              <tr key={p.year}>
                <td>{p.year}</td>
                <td className="num">{p.deaths != null ? fmt.int(p.deaths) : "Not shown"}</td>
                <td className="num">{p.rate != null ? fmt.rate(p.rate) : "Not shown"}</td>
                <td className="num">{rankFor(s.code, p.year) ?? "–"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>What these numbers mean</h2>
      <div className="narrow">
        <p>
          <strong>Deaths</strong> counts every person who lived in {s.name} and died from a gun injury that year,
          for any reason: suicide, homicide, accident, police shooting, or unknown.
        </p>
        <p>
          <strong>Age-adjusted rate</strong>: older and younger people die from guns at different rates. Some
          states have older populations than others. &quot;Age-adjusting&quot; removes that difference, so states
          can be compared fairly.
        </p>
        <p className="muted">Coming soon: suicide and homicide numbers for {s.name}.</p>
      </div>
      <SourceNote />
    </article>
  );
}
