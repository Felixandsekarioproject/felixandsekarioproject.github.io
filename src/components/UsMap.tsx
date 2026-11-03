"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { LEGEND, SUPPRESSED_COLOR, colorFor, textOn } from "@/lib/scale";
import { TILES, TILE_COLS, TILE_ROWS } from "@/lib/tiles";

export type MapState = {
  code: string;
  name: string;
  d: string;
  cx: number;
  cy: number;
  values: Record<number, { rate: number | null; deaths: number | null }>;
};

type Props = {
  shapes: MapState[];
  years: number[];
  width: number;
  height: number;
};

type View = "map" | "tiles";
type Measure = "rate" | "deaths";

const TILE = 70;
const GAP = 4;

export default function UsMap({ shapes, years, width, height }: Props) {
  const [yearIdx, setYearIdx] = useState(years.length - 1);
  const [view, setView] = useState<View>("map");
  const [measure, setMeasure] = useState<Measure>("rate");
  const [hover, setHover] = useState<string | null>(null);

  // On phones, start with equal squares: easier to read and tap than tiny states.
  useEffect(() => {
    if (window.matchMedia("(max-width: 600px)").matches) setView("tiles");
  }, []);

  const year = years[yearIdx];
  const maxDeaths = useMemo(
    () => Math.max(...shapes.flatMap((s) => Object.values(s.values).map((v) => v.deaths ?? 0))),
    [shapes],
  );
  const radius = (deaths: number | null) => (deaths == null ? 0 : 3 + 32 * Math.sqrt(deaths / maxDeaths));

  const ranked = useMemo(
    () =>
      shapes
        .map((s) => ({ ...s, v: s.values[year] }))
        .sort((a, b) => (b.v?.rate ?? -1) - (a.v?.rate ?? -1)),
    [shapes, year],
  );

  const hovered = hover ? shapes.find((s) => s.code === hover) : undefined;
  const hv = hovered?.values[year];

  const label = (s: MapState) => {
    const v = s.values[year];
    if (!v || v.rate == null) return `${s.name}: data not shown for ${year} (fewer than 10 deaths)`;
    return `${s.name}: ${v.rate.toFixed(1)} gun deaths per 100,000 people, ${v.deaths?.toLocaleString("en-US")} deaths in ${year}. Open state page.`;
  };

  const tileW = TILE_COLS * (TILE + GAP);
  const tileH = TILE_ROWS * (TILE + GAP);

  // The states are drawn once per year/setting. Hovering only draws a thin
  // outline on top, instead of redrawing all 51 states (keeps scrolling smooth).
  const base = useMemo(
    () => (
      <>
          {view === "map"
            ? shapes.map((s) => {
                const v = s.values[year];
                const fill = measure === "rate" ? colorFor(v?.rate) : "#f3f1f6";
                return (
                  <Link prefetch={false}
                    key={s.code}
                    href={`/states/${s.code.toLowerCase()}/`}
                    aria-label={label(s)}
                    onMouseEnter={() => setHover(s.code)}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover(s.code)}
                    onBlur={() => setHover(null)}
                    className="state-link"
                  >
                    <path d={s.d} fill={fill} className="state" />
                  </Link>
                );
              })
            : shapes.map((s) => {
                const pos = TILES[s.code];
                if (!pos) return null;
                const v = s.values[year];
                const x = pos[0] * (TILE + GAP);
                const y = pos[1] * (TILE + GAP);
                const fill = measure === "rate" ? colorFor(v?.rate) : "#f3f1f6";
                const tc = measure === "rate" ? textOn(v?.rate) : "#1a1a1a";
                return (
                  <Link prefetch={false}
                    key={s.code}
                    href={`/states/${s.code.toLowerCase()}/`}
                    aria-label={label(s)}
                    onMouseEnter={() => setHover(s.code)}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover(s.code)}
                    onBlur={() => setHover(null)}
                    className="state-link"
                  >
                    <rect
                      x={x}
                      y={y}
                      width={TILE}
                      height={TILE}
                      rx={4}
                      fill={fill}
                      className="state"
                    />
                    {measure === "deaths" && v?.deaths != null && (
                      <circle
                        cx={x + TILE / 2}
                        cy={y + TILE / 2 + 6}
                        r={Math.min(radius(v.deaths) * 0.75, TILE / 2 - 6)}
                        className="bubble"
                      />
                    )}
                    <text x={x + TILE / 2} y={y + 29} textAnchor="middle" className="tile-code" fill={tc}>
                      {s.code}
                    </text>
                    {measure === "rate" && (
                      <text x={x + TILE / 2} y={y + 54} textAnchor="middle" className="tile-val" fill={tc}>
                        {v?.rate != null ? v.rate.toFixed(1) : "–"}
                      </text>
                    )}
                  </Link>
                );
              })}

          {/* Bubbles for death counts on the geographic map */}
          {view === "map" && measure === "deaths" && (
            <g aria-hidden="true" pointerEvents="none">
              {[...shapes]
                .sort((a, b) => (b.values[year]?.deaths ?? 0) - (a.values[year]?.deaths ?? 0))
                .map((s) => (
                  <circle key={s.code} cx={s.cx} cy={s.cy} r={radius(s.values[year]?.deaths ?? null)} className="bubble" />
                ))}
            </g>
          )}

          {/* DC is too small to see on the map: add a marker */}
          {view === "map" &&
            (() => {
              const dc = shapes.find((s) => s.code === "DC");
              if (!dc) return null;
              const v = dc.values[year];
              const mx = dc.cx + 60;
              const my = dc.cy + 40;
              return (
                <Link prefetch={false} href="/states/dc/" aria-label={label(dc)} className="state-link"
                  onMouseEnter={() => setHover("DC")} onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover("DC")} onBlur={() => setHover(null)}>
                  <line x1={dc.cx} y1={dc.cy} x2={mx} y2={my} stroke="#555" strokeWidth={1} />
                  <circle cx={mx} cy={my} r={11}
                    fill={measure === "rate" ? colorFor(v?.rate) : "#f3f1f6"}
                    className="state" />
                  <text x={mx + 16} y={my + 4} className="dc-label">DC</text>
                </Link>
              );
            })()}
      </>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [view, measure, year, shapes, maxDeaths],
  );

  return (
    <div className="map-block">
      {/* Controls */}
      <div className="controls" role="group" aria-label="Map controls">
        <div className="control">
          <label htmlFor="year" className="control-label">
            Year: <strong>{year}</strong>
          </label>
          <input
            id="year"
            type="range"
            min={0}
            max={years.length - 1}
            step={1}
            value={yearIdx}
            onChange={(e) => setYearIdx(Number(e.target.value))}
            aria-valuetext={String(year)}
          />
          <div className="range-ends" aria-hidden="true">
            <span>{years[0]}</span>
            <span>{years[years.length - 1]}</span>
          </div>
        </div>

        <fieldset className="control">
          <legend className="control-label">Show</legend>
          <div className="seg">
            <button type="button" aria-pressed={measure === "rate"} onClick={() => setMeasure("rate")}>
              Rate per 100,000
            </button>
            <button type="button" aria-pressed={measure === "deaths"} onClick={() => setMeasure("deaths")}>
              Number of deaths
            </button>
          </div>
        </fieldset>

        <fieldset className="control">
          <legend className="control-label">Layout</legend>
          <div className="seg">
            <button type="button" aria-pressed={view === "map"} onClick={() => setView("map")}>
              Map
            </button>
            <button type="button" aria-pressed={view === "tiles"} onClick={() => setView("tiles")}>
              Equal squares
            </button>
          </div>
        </fieldset>
      </div>

      {year === years[0] && years[1] - years[0] > 1 && (
        <p className="note">
          Note: CDC&apos;s file jumps from {years[0]} to {years[1]}. The years in between are not
          included yet.
        </p>
      )}

      {/* Map */}
      <div className="map-frame">
        <svg
          viewBox={view === "map" ? `0 0 ${width} ${height}` : `0 0 ${tileW} ${tileH}`}
          role="group"
          aria-label={`Map of US states, gun deaths in ${year}. Each state is a link.`}
          className="map-svg"
        >
          {base}
          {/* Hover highlight drawn on top, so the states themselves don't need redrawing */}
          {hovered &&
            (view === "map" ? (
              hovered.code === "DC" ? (
                <circle cx={hovered.cx + 60} cy={hovered.cy + 40} r={11} className="hover-outline" />
              ) : (
                <path d={hovered.d} className="hover-outline" />
              )
            ) : TILES[hovered.code] ? (
              <rect
                x={TILES[hovered.code][0] * (TILE + GAP)}
                y={TILES[hovered.code][1] * (TILE + GAP)}
                width={TILE}
                height={TILE}
                rx={4}
                className="hover-outline"
              />
            ) : null)}
        </svg>

        {/* Hover / focus card */}
        <div className="hover-card" aria-live="polite">
          {hovered ? (
            <>
              <div className="hc-name">{hovered.name}, {year}</div>
              {hv && hv.rate != null ? (
                <>
                  <div className="hc-big">{hv.rate.toFixed(1)}</div>
                  <div className="hc-small">gun deaths per 100,000 people</div>
                  <div className="hc-small">{hv.deaths?.toLocaleString("en-US")} people died</div>
                  <div className="hc-small">
                    Rank {ranked.findIndex((r) => r.code === hovered.code) + 1} of {ranked.length} (1 = highest)
                  </div>
                </>
              ) : (
                <div className="hc-small">Not shown: fewer than 10 deaths</div>
              )}
              <div className="hc-hint">Click to open the state page</div>
            </>
          ) : (
            <div className="hc-small">Point at a state, or press Tab to move between states.</div>
          )}
        </div>
      </div>

      {/* Legend */}
      {measure === "rate" ? (
        <div className="legend" aria-label="Color key">
          <span className="legend-title">Gun deaths per 100,000 people (age-adjusted)</span>
          <ul>
            {LEGEND.map((l) => (
              <li key={l.label}>
                <span className="swatch" style={{ background: l.color }} />
                {l.label}
              </li>
            ))}
            <li>
              <span className="swatch" style={{ background: SUPPRESSED_COLOR }} />
              Not shown (fewer than 10 deaths)
            </li>
          </ul>
        </div>
      ) : (
        <p className="legend-title">
          Bigger circle = more deaths. States with more people usually have more deaths. Use{" "}
          <button type="button" className="linklike" onClick={() => setMeasure("rate")}>rate per 100,000</button>{" "}
          to compare states fairly.
        </p>
      )}

      {/* Same data as a table, for screen readers and anyone who prefers numbers */}
      <details className="table-toggle">
        <summary>Show all states as a table ({year})</summary>
        <table className="data-table">
          <caption className="sr-only">Gun deaths by state, {year}, sorted from highest rate</caption>
          <thead>
            <tr>
              <th scope="col">Rank</th>
              <th scope="col">State</th>
              <th scope="col" className="num">Rate per 100,000</th>
              <th scope="col" className="num">Deaths</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((s, i) => (
              <tr key={s.code}>
                <td>{s.v?.rate != null ? i + 1 : "–"}</td>
                <td>
                  <Link prefetch={false} href={`/states/${s.code.toLowerCase()}/`}>{s.name}</Link>
                </td>
                <td className="num">{s.v?.rate != null ? s.v.rate.toFixed(1) : "Not shown"}</td>
                <td className="num">{s.v?.deaths != null ? s.v.deaths.toLocaleString("en-US") : "Not shown"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
