import Link from "next/link";
import UsMap from "@/components/UsMap";
import SourceNote from "@/components/SourceNote";
import { LATEST_YEAR, YEARS, fmt, nationalDeaths, pointFor, states } from "@/lib/data";
import { MAP_H, MAP_W } from "@/lib/geo";
import { getMapStates } from "@/lib/mapdata";

function daysIn(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 366 : 365;
}

export default function Home() {
  const total = nationalDeaths(LATEST_YEAR);
  const perDay = Math.round(total / daysIn(LATEST_YEAR));
  const peak = Math.max(...YEARS.map(nationalDeaths));
  const peakYear = YEARS.find((y) => nationalDeaths(y) === peak)!;

  const ranked = states
    .map((s) => ({ s, p: pointFor(s, LATEST_YEAR) }))
    .filter((r) => r.p?.rate != null)
    .sort((a, b) => b.p!.rate! - a.p!.rate!);
  const top = ranked.slice(0, 5);
  const bottom = ranked.slice(-5).reverse();
  const ratio = top[0].p!.rate! / bottom[0].p!.rate!;

  return (
    <>
      <section className="hero wrap">
        <p className="kicker">Gun deaths in the United States</p>
        <h1>
          In {LATEST_YEAR}, <span className="big-number-inline">{fmt.int(total)}</span> people in the U.S. died from
          gun injuries.
        </h1>
        <p className="lead">
          That is about <strong>{perDay} people every day</strong>. The number has gone down since the peak in{" "}
          {peakYear} ({fmt.int(peak)} deaths), but it is still about {fmt.int(Math.round((total - nationalDeaths(2014)) / 1000) * 1000)}{" "}
          more deaths per year than in 2014.
        </p>

        <div className="stats">
          <div className="stat">
            <div className="stat-value">{fmt.int(total)}</div>
            <div className="stat-label">gun deaths in {LATEST_YEAR}</div>
          </div>
          <div className="stat">
            <div className="stat-value">~{perDay}</div>
            <div className="stat-label">deaths per day, on average</div>
          </div>
          <div className="stat">
            <div className="stat-value">{fmt.int(nationalDeaths(2014))}</div>
            <div className="stat-label">gun deaths in 2014, for comparison</div>
          </div>
        </div>
        <SourceNote />
      </section>

      <section className="section wrap narrow">
        <h2>Most gun deaths are not murders</h2>
        <p>
          When people hear &quot;gun deaths,&quot; they often think of murders or mass shootings. But{" "}
          <strong>more than half of all gun deaths in the U.S. are suicides</strong>, according to the CDC (2022
          data).
        </p>
        <p>The total number of gun deaths is made up of several types. Each death is counted only once:</p>
        <ul>
          <li><strong>Suicide</strong>: a person uses a gun to end their own life.</li>
          <li><strong>Homicide</strong>: one person kills another person with a gun.</li>
          <li><strong>Accident</strong> (unintentional): for example, a child finds a loaded gun.</li>
          <li><strong>Police shooting</strong> (&quot;legal intervention&quot;): a death caused by law enforcement.</li>
          <li><strong>Unknown</strong> (undetermined): investigators could not tell what happened.</li>
        </ul>
        <p className="callout">
          Suicides and homicides are <em>parts</em> of the total, not extra deaths on top of it.
        </p>
        <p className="muted">
          Coming soon: the exact split for every state and year, from CDC&apos;s detailed database.
        </p>
      </section>

      <section className="section wrap" id="map">
        <h2>How do states compare?</h2>
        <p className="narrow">
          The map shows the <strong>gun death rate</strong>: how many people died from guns for every 100,000
          people living in the state. Using a rate lets us compare big states and small states fairly. Darker
          purple means a higher rate. Click a state to learn more.
        </p>
        <UsMap shapes={getMapStates()} years={YEARS} width={MAP_W} height={MAP_H} />
      </section>

      <section className="section wrap">
        <h2>Big differences between states</h2>
        <p className="narrow">
          In {LATEST_YEAR}, the gun death rate in {top[0].s.name} was about{" "}
          <strong>{Math.round(ratio)} times higher</strong> than in {bottom[0].s.name}. These numbers show{" "}
          <em>where</em> rates are high. They do not, on their own, explain <em>why</em>. States differ in many
          ways, such as how many people own guns, how rural they are, income, age of residents, and their laws.
        </p>
        <div className="cards">
          <div className="card">
            <h3>Highest rates, {LATEST_YEAR}</h3>
            <ol>
              {top.map(({ s, p }) => (
                <li key={s.code}>
                  <Link prefetch={false} href={`/states/${s.code.toLowerCase()}/`}>{s.name}</Link>: {fmt.rate(p!.rate!)}
                </li>
              ))}
            </ol>
          </div>
          <div className="card">
            <h3>Lowest rates, {LATEST_YEAR}</h3>
            <ol>
              {bottom.map(({ s, p }) => (
                <li key={s.code}>
                  <Link prefetch={false} href={`/states/${s.code.toLowerCase()}/`}>{s.name}</Link>: {fmt.rate(p!.rate!)}
                </li>
              ))}
            </ol>
          </div>
          <div className="card">
            <h3>Gun laws by state</h3>
            <p>Background checks, permits, waiting periods and more: see how the rules change across state lines.</p>
            <p><Link prefetch={false} href="/laws/">Explore state gun laws →</Link></p>
          </div>
          <div className="card">
            <h3>How we got here</h3>
            <p>A timeline of gun laws and court decisions, from the Second Amendment in 1791 to today.</p>
            <p><Link prefetch={false} href="/history/">See the timeline →</Link></p>
          </div>
          <div className="card">
            <h3>You be the judge</h3>
            <p>Decide five real Supreme Court gun cases, then see what the justices actually ruled.</p>
            <p><Link prefetch={false} href="/judge/">Start with case 1 →</Link></p>
          </div>
          <div className="card">
            <h3>Compare states yourself</h3>
            <p>Pick up to four states and see how their rates changed over time.</p>
            <p><Link prefetch={false} href="/compare/">Open the comparison tool →</Link></p>
          </div>
        </div>
        <p className="muted">Rates are gun deaths per 100,000 people, age-adjusted.</p>
      </section>
    </>
  );
}
