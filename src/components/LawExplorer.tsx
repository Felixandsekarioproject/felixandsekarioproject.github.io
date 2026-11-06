"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { LawState, Policy } from "@/lib/laws";
import { statusColor, statusText, textColorOn } from "@/lib/laws";
import { TILES, TILE_COLS, TILE_ROWS } from "@/lib/tiles";
import LawCell from "./LawCell";
import StatePicker from "./StatePicker";

type Shape = { code: string; name: string; d: string; cx: number; cy: number };

const TILE = 70;
const GAP = 4;
const MAX = 4;
const DEFAULT = ["CA", "TX", "FL", "NY"];

export default function LawExplorer({
  policies,
  states,
  shapes,
  width,
  height,
}: {
  policies: Policy[];
  states: Record<string, LawState>;
  shapes: Shape[];
  width: number;
  height: number;
}) {
  const [pid, setPid] = useState(policies[0].id);
  const [view, setView] = useState<"map" | "tiles">("map");
  const [hover, setHover] = useState<string | null>(null);
  const [picked, setPicked] = useState<string[]>(DEFAULT);

  useEffect(() => {
    if (window.matchMedia("(max-width: 600px)").matches) setView("tiles");
    const q = new URLSearchParams(window.location.search).get("states");
    if (q) {
      const valid = q.split(",").map((c) => c.trim().toUpperCase()).filter((c) => c in states);
      if (valid.length) setPicked(valid.slice(0, MAX));
    }
  }, [states]);

  const p = policies.find((x) => x.id === pid)!;
  const codes = Object.keys(states);
  const counts = Object.fromEntries(p.statuses.map((s) => [s.id, codes.filter((c) => states[c].laws[pid].status === s.id).length]));
  const hs = hover ? states[hover] : undefined;

  const linkProps = (code: string) => ({
    href: `/states/${code.toLowerCase()}/#laws`,
    "aria-label": `${states[code].name}: ${statusText(p, states[code].laws[pid].status)}${states[code].laws[pid].detail ? ", " + states[code].laws[pid].detail : ""}`,
    onMouseEnter: () => setHover(code),
    onMouseLeave: () => setHover(null),
    onFocus: () => setHover(code),
    onBlur: () => setHover(null),
    className: "state-link",
  });

  const hovShape = hover ? shapes.find((s) => s.code === hover) : undefined;
  // Draw the states once per topic/layout; hovering only adds an outline on top.
  const base = useMemo(
    () => (
      <>
          {view === "map"
            ? shapes.map((s) => (
                <Link prefetch={false} key={s.code} {...linkProps(s.code)}>
                  <path d={s.d} fill={statusColor(p, states[s.code].laws[pid].status)} className="state" />
                </Link>
              ))
            : shapes.map((s) => {
                const pos = TILES[s.code];
                if (!pos) return null;
                const x = pos[0] * (TILE + GAP);
                const y = pos[1] * (TILE + GAP);
                const st = states[s.code].laws[pid].status;
                return (
                  <Link prefetch={false} key={s.code} {...linkProps(s.code)}>
                    <rect x={x} y={y} width={TILE} height={TILE} rx={4} fill={statusColor(p, st)} className="state" />
                    <text x={x + TILE / 2} y={y + TILE / 2 + 8} textAnchor="middle" className="tile-code" fill={textColorOn(p, st)}>
                      {s.code}
                    </text>
                  </Link>
                );
              })}
          {view === "map" &&
            (() => {
              const dc = shapes.find((s) => s.code === "DC");
              if (!dc) return null;
              const mx = dc.cx + 60;
              const my = dc.cy + 40;
              return (
                <Link prefetch={false} {...linkProps("DC")}>
                  <line x1={dc.cx} y1={dc.cy} x2={mx} y2={my} stroke="#555" strokeWidth={1} />
                  <circle cx={mx} cy={my} r={11} fill={statusColor(p, states.DC.laws[pid].status)} className="state" />
                  <text x={mx + 16} y={my + 4} className="dc-label">DC</text>
                </Link>
              );
            })()}
      </>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [view, pid, shapes, states],
  );

  return (
    <div>
      {/* Topic tabs */}
      <div className="topic-tabs" role="group" aria-label="Choose a law topic">
        {policies.map((x) => (
          <button key={x.id} type="button" aria-pressed={x.id === pid} onClick={() => setPid(x.id)}>
            {x.title}
          </button>
        ))}
      </div>

      <div className="topic-intro">
        <h2 className="topic-q">{p.question}</h2>
        <p>{p.explain}</p>
      </div>

      <div className="controls">
        <fieldset className="control">
          <legend className="control-label">Layout</legend>
          <div className="seg">
            <button type="button" aria-pressed={view === "map"} onClick={() => setView("map")}>Map</button>
            <button type="button" aria-pressed={view === "tiles"} onClick={() => setView("tiles")}>Equal squares</button>
          </div>
        </fieldset>
      </div>

      <div className="map-frame">
        <svg
          viewBox={view === "map" ? `0 0 ${width} ${height}` : `0 0 ${TILE_COLS * (TILE + GAP)} ${TILE_ROWS * (TILE + GAP)}`}
          role="group"
          aria-label={`Map: ${p.title}. Each state is a link.`}
          className="map-svg"
        >
          {base}
          {hovShape &&
            (view === "map" ? (
              hovShape.code === "DC" ? (
                <circle cx={hovShape.cx + 60} cy={hovShape.cy + 40} r={11} className="hover-outline" />
              ) : (
                <path d={hovShape.d} className="hover-outline" />
              )
            ) : TILES[hovShape.code] ? (
              <rect x={TILES[hovShape.code][0] * (TILE + GAP)} y={TILES[hovShape.code][1] * (TILE + GAP)} width={TILE} height={TILE} rx={4} className="hover-outline" />
            ) : null)}
        </svg>

        <div className="hover-card" aria-live="polite">
          {hs ? (
            <>
              <div className="hc-name">{hs.name}</div>
              <div className="hc-law">{statusText(p, hs.laws[pid].status)}</div>
              {hs.laws[pid].detail && <div className="hc-small">{hs.laws[pid].detail}</div>}
              <div className="hc-hint">Click to see all of {hs.name}&apos;s laws</div>
            </>
          ) : (
            <div className="hc-small">Point at a state, or press Tab to move between states.</div>
          )}
        </div>
      </div>

      <div className="legend" aria-label="Color key">
        <span className="legend-title">Darker = more requirements under state law. Number = how many states (incl. DC).</span>
        <ul>
          {p.statuses.map((s) => (
            <li key={s.id}>
              <span className="swatch" style={{ background: statusColor(p, s.id) }} />
              {s.label} <span className="muted">({counts[s.id]})</span>
            </li>
          ))}
        </ul>
      </div>

      <details className="table-toggle">
        <summary>Show all states as a list</summary>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">State</th>
                <th scope="col">{p.title}</th>
              </tr>
            </thead>
            <tbody>
              {codes
                .sort((a, b) => states[a].name.localeCompare(states[b].name))
                .map((c) => (
                  <tr key={c}>
                    <td><Link prefetch={false} href={`/states/${c.toLowerCase()}/#laws`}>{states[c].name}</Link></td>
                    <td>
                      {statusText(p, states[c].laws[pid].status)}
                      {states[c].laws[pid].detail && <span className="muted"> · {states[c].laws[pid].detail}</span>}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </details>

      {/* Compare states */}
      <h2 id="compare">Compare states side by side</h2>
      <p>Pick up to four states to see all six topics next to each other.</p>
      <div className="compare">
        <aside className="compare-side" aria-label="Choose states">
          <p className="side-title">States ({picked.length} of {MAX})</p>
          <ul className="chips">
            {picked.map((c) => (
              <li key={c} className="chip">
                <span className="chip-name">{states[c].name}</span>
                <button type="button" className="chip-x" aria-label={`Remove ${states[c].name}`} onClick={() => setPicked(picked.filter((x) => x !== c))}>
                  ×
                </button>
              </li>
            ))}
          </ul>
          <StatePicker
            options={codes
              .filter((c) => !picked.includes(c))
              .map((c) => ({ code: c, name: states[c].name }))
              .sort((a, b) => a.name.localeCompare(b.name))}
            disabled={picked.length >= MAX}
            placeholder={picked.length >= MAX ? "Max. 4 states" : "+ Add a state"}
            onPick={(code) => setPicked((prev) => (prev.length < MAX ? [...prev, code] : prev))}
          />
        </aside>

        <div className="compare-main">
          {picked.length === 0 ? (
            <p className="muted">Add a state to compare.</p>
          ) : (
            <div className="table-scroll">
              <table className="law-table">
                <thead>
                  <tr>
                    <th scope="col">Topic</th>
                    {picked.map((c) => (
                      <th key={c} scope="col">
                        <Link prefetch={false} href={`/states/${c.toLowerCase()}/#laws`}>{states[c].name}</Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {policies.map((x) => (
                    <tr key={x.id}>
                      <th scope="row">{x.title}</th>
                      {picked.map((c) => (
                        <td key={c}>
                          <LawCell p={x} entry={states[c].laws[x.id]} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
