"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TrendChart from "./TrendChart";
import StatePicker from "./StatePicker";

type Lite = { code: string; name: string; series: { year: number; rate: number | null; deaths: number | null }[] };

// Four colors that are easy to tell apart, including for color-blind readers.
const LINE_COLORS = ["#4b2f86", "#1b7f79", "#c4661f", "#55525c"];
const DEFAULT = ["TX", "CA", "FL", "NY"];
const MAX = 4;

export default function CompareTool({ states, years }: { states: Lite[]; years: number[] }) {
  const [picked, setPicked] = useState<string[]>(DEFAULT);

  // Read ?states=AL,GA from the link (used by "compare with neighbors").
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("states");
    if (!q) return;
    const valid = q.split(",").map((c) => c.trim().toUpperCase()).filter((c) => states.some((s) => s.code === c));
    if (valid.length) setPicked(valid.slice(0, MAX));
  }, [states]);

  const chosen = picked.map((c) => states.find((s) => s.code === c)!).filter(Boolean);
  const latest = years[years.length - 1];

  return (
    <div className="compare">
      <aside className="compare-side" aria-label="Choose states">
        <p className="side-title">States ({chosen.length} of {MAX})</p>
        <ul className="chips">
          {chosen.map((s, i) => {
            const v = s.series.find((p) => p.year === latest)?.rate;
            return (
              <li key={s.code} className="chip">
                <span className="chip-dot" style={{ background: LINE_COLORS[i] }} aria-hidden="true" />
                <span className="chip-name">{s.name}</span>
                <span className="chip-val">{v != null ? v.toFixed(1) : "–"}</span>
                <button
                  type="button"
                  className="chip-x"
                  aria-label={`Remove ${s.name}`}
                  onClick={() => setPicked(picked.filter((c) => c !== s.code))}
                >
                  ×
                </button>
              </li>
            );
          })}
        </ul>
        <StatePicker
          options={states.filter((s) => !picked.includes(s.code))}
          disabled={picked.length >= MAX}
          placeholder={picked.length >= MAX ? "Max. 4 states" : "+ Add a state"}
          onPick={(code) => setPicked((prev) => (prev.length < MAX ? [...prev, code] : prev))}
        />
        <p className="side-note">Numbers: rate per 100,000 in {latest}.</p>
      </aside>

      <div className="compare-main">
        {chosen.length > 0 ? (
          <TrendChart
            title={`Gun death rates over time: ${chosen.map((s) => s.name).join(", ")}`}
            yLabel="Deaths per 100,000"
            series={chosen.map((s, i) => ({
              label: s.name,
              color: LINE_COLORS[i],
              dashed: i === 3,
              points: s.series.map((p) => ({ year: p.year, value: p.rate })),
            }))}
          />
        ) : (
          <p className="muted">Add a state to see the chart.</p>
        )}

        {chosen.length > 0 && (
          <details>
            <summary>Show the numbers as a table</summary>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th scope="col">Year</th>
                    {chosen.map((s) => (
                      <th key={s.code} scope="col" className="num">{s.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...years].reverse().map((y) => (
                    <tr key={y}>
                      <td>{y}</td>
                      {chosen.map((s) => {
                        const p = s.series.find((x) => x.year === y);
                        return (
                          <td key={s.code} className="num">
                            {p?.rate != null ? p.rate.toFixed(1) : "Not shown"}
                            <span className="muted"> ({p?.deaths != null ? p.deaths.toLocaleString("en-US") : "–"})</span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="muted">Each cell: rate per 100,000 people (number of deaths in brackets).</p>
          </details>
        )}

        {chosen.length > 0 && (
          <p className="small">
            State pages:{" "}
            {chosen.map((s, i) => (
              <span key={s.code}>
                {i > 0 && " · "}
                <Link prefetch={false} href={`/states/${s.code.toLowerCase()}/`}>{s.name}</Link>
              </span>
            ))}
          </p>
        )}
      </div>
    </div>
  );
}
