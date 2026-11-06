import type { Metadata } from "next";
import { LATEST_YEAR, meta, nationalDeaths } from "@/lib/data";

export const metadata: Metadata = { title: "Sources and methods" };

export default function SourcesPage() {
  return (
    <div className="wrap narrow">
      <header className="hero">
        <h1>Sources and methods</h1>
        <p className="lead">
          Every number on this site should be easy to check. This page explains where the numbers come from, what
          they include, and what their limits are.
        </p>
      </header>

      <h2>Where the numbers come from</h2>
      <p>
        All gun death numbers on this site come from the{" "}
        <a href={meta.sourceUrl} target="_blank" rel="noreferrer">
          National Center for Health Statistics (NCHS)
        </a>
        , part of the U.S. Centers for Disease Control and Prevention (CDC). NCHS collects information from{" "}
        <strong>death certificates</strong>. A doctor, coroner, or medical examiner fills one out for every person
        who dies in the United States.
      </p>
      <p>
        We downloaded the data on {meta.retrieved}. It is U.S. government data and free to use. To check it, we
        added up the numbers for all 50 states and Washington, D.C. They match CDC&apos;s national totals exactly
        (for example, {nationalDeaths(LATEST_YEAR).toLocaleString("en-US")} deaths in {LATEST_YEAR}).
      </p>

      <h2>What is counted</h2>
      <ul>
        <li>People who <strong>died</strong> from a gun injury. People who were hurt but survived are not counted.</li>
        <li>Deaths are counted in the state where the person <strong>lived</strong>, not where they died.</li>
        <li>
          All causes are included: suicide, homicide, accidents, police shootings, and cases where the cause is
          unknown.
        </li>
      </ul>

      <h2>What &quot;rate per 100,000&quot; means</h2>
      <p>
        Texas has many more people than Vermont, so it will almost always have more deaths. To compare fairly, we
        use a <strong>rate</strong>: the number of deaths for every 100,000 people living there.
      </p>
      <p>
        The rates are also <strong>age-adjusted</strong>. This means CDC adjusts for the fact that some states
        have older or younger populations than others. That way, differences between states are not just caused by
        differences in age.
      </p>

      <h2>Why other websites show different numbers</h2>
      <p>
        You may see other numbers about &quot;gun violence&quot; elsewhere. They often measure different things:
      </p>
      <ul>
        <li>
          <strong>CDC (this site)</strong> counts <em>deaths</em>, from death certificates. It includes suicides.
        </li>
        <li>
          <strong>Gun Violence Archive</strong> counts <em>shooting incidents</em> from news and police reports. It
          includes people who were injured, and it does not count most suicides.
        </li>
        <li>
          <strong>FBI crime data</strong> counts <em>crimes reported to police</em>. Not every police agency
          reports, and suicides are not crimes.
        </li>
      </ul>
      <p>None of these is &quot;wrong.&quot; They answer different questions.</p>

      <h2>Limits of the data</h2>
      <ul>
        <li>
          CDC&apos;s state file includes 2005 and 2014–2024. <strong>2006–2013 are missing</strong>. Charts show
          this gap with a dotted line.
        </li>
        <li>
          Death certificates are sometimes wrong about the cause. Research has found that deaths caused by police
          are often not labeled that way.
        </li>
        <li>
          CDC&apos;s rules say that numbers of 9 or fewer deaths must not be published, to protect privacy. If that
          happens, we show &quot;Not shown.&quot;
        </li>
        <li>
          Showing where rates are high does not show <em>why</em>. This site does not claim that any single cause
          explains the differences between states.
        </li>
      </ul>

      <h2>Gun laws</h2>
      <p>
        State gun laws come from the{" "}
        <a href="https://www.rand.org/pubs/tools/TLA243-2-v4.html" target="_blank" rel="noreferrer">
          RAND State Firearm Law Database
        </a>{" "}
        (version 6.0, January 2026), which covers laws <strong>as of September 1, 2025</strong>. RAND is a
        nonprofit, nonpartisan research organization. Its legal researchers read each state&apos;s laws and sort
        them into categories.
      </p>
      <ul>
        <li>We show only laws still in force and group RAND&apos;s categories into one plain-language answer per state, for six topics. RAND&apos;s law citations and notes are shown unchanged under &quot;Legal details&quot;.</li>
        <li>Laws passed after September 1, 2025, are not included. Some laws may be blocked by courts.</li>
        <li>Where experts disagree about how to read a law, RAND notes it, and we show that note.</li>
        <li>License: Open Data Commons Open Database License (ODbL), noncommercial use, with attribution.</li>
      </ul>

      <h2>Court cases</h2>
      <p>
        The &quot;You be the judge&quot; cases use only the official opinions published by the Supreme Court. A
        computer check confirms that every quote appears word for word in the official text.
      </p>

      <h2>Speeches and statements</h2>
      <p>
        The <a href="/disagreements/">Disagreements</a> page uses four primary sources. Each one shows one
        political perspective, not a settled fact. Every quote was checked word for word against an official or
        first-party transcript.
      </p>
      <ul>
        <li>
          LaPierre, Wayne (National Rifle Association). &ldquo;NRA Statement Following the Sandy Hook Elementary
          School Shooting.&rdquo; 21 Dec. 2012. <em>Blair Academy US History Reader</em>, pp. 58&ndash;59.{" "}
          <a href="https://www.americanhunter.org/content/nra-proposes-national-school-safety-program">Transcript (NRA, American Hunter)</a>.
        </li>
        <li>
          Obama, Barack. &ldquo;Remarks on the Shooting at Umpqua Community College.&rdquo; 1 Oct. 2015.{" "}
          <em>Blair Academy US History Reader</em>, pp. 56&ndash;57.{" "}
          <a href="https://obamawhitehouse.archives.gov/the-press-office/2015/10/01/statement-president-shootings-umpqua-community-college-roseburg-oregon">Transcript (The White House, archived)</a>.
        </li>
        <li>
          Trump, Donald. &ldquo;Remarks by President Trump on the Mass Shootings in Texas and Ohio.&rdquo; 5 Aug.
          2019. The White House.{" "}
          <a href="https://trumpwhitehouse.archives.gov/briefings-statements/remarks-president-trump-mass-shootings-texas-ohio/">Transcript (archived)</a>.
        </li>
        <li>
          Biden, Joe. &ldquo;Remarks on Signing the Bipartisan Safer Communities Act.&rdquo; 25 June 2022. The
          American Presidency Project, UC Santa Barbara.{" "}
          <a href="https://www.presidency.ucsb.edu/node/356599">Transcript</a>.
        </li>
        <li>
          Portraits: Obama, Trump and Biden, official White House photos (public domain); LaPierre, photo by Gage
          Skidmore, CC BY-SA 3.0, via Wikimedia Commons.
        </li>
      </ul>

      <h2>Our perspective</h2>
      <p>
        This project starts from one goal: fewer people should die from guns. That goal does not decide which
        policies are best. People disagree about that, and we try to present the facts so that people with
        different views can trust them.
      </p>

      <h2>Talking about suicide</h2>
      <p>
        We follow guidelines for safe reporting about suicide: no details about methods, and information about
        where to get help. In the U.S., you can call or text <strong>988</strong> at any time.
      </p>
    </div>
  );
}
