"use client";

// Line chart drawn as SVG. Hover (or focus + arrow keys) shows a crosshair and the
// exact values for that year; the same numbers are also available as a table.

import { useState } from "react";

export type Series = {
  label: string;
  color: string;
  dashed?: boolean;
  points: { year: number; value: number | null }[];
};

type Props = {
  series: Series[];
  band?: { year: number; lo: number; hi: number }[];
  bandLabel?: string;
  title: string;
  yLabel: string;
};

const W = 720;
const H = 280;
const M = { top: 16, right: 24, bottom: 36, left: 48 };

export default function TrendChart({ series, band, bandLabel, title, yLabel }: Props) {
  const [hover, setHover] = useState<number | null>(null);
  const years = Array.from(
    new Set(series.flatMap((s) => s.points.map((p) => p.year)).concat(band?.map((b) => b.year) ?? [])),
  ).sort((a, b) => a - b);
  const values = series
    .flatMap((s) => s.points.map((p) => p.value))
    .concat(band?.map((b) => b.hi) ?? [])
    .filter((v): v is number => v != null);
  const yMax = Math.ceil(Math.max(...values, 1) / 5) * 5;

  // Position years by order, not by calendar distance, so a run of missing
  // years becomes a short break (1.5 slots wide) instead of a huge empty area.
  const slot: Record<number, number> = {};
  let pos = 0;
  years.forEach((yr, i) => {
    if (i > 0) pos += yr - years[i - 1] > 1 ? 1.5 : 1;
    slot[yr] = pos;
  });
  const x = (yr: number) => M.left + (slot[yr] / Math.max(pos, 1)) * (W - M.left - M.right);
  const y = (v: number) => H - M.bottom - (v / yMax) * (H - M.top - M.bottom);

  const yTicks = Array.from({ length: yMax / 5 + 1 }, (_, i) => i * 5);

  // Break the line where years are missing (e.g. 2005 → 2014), drawing the gap dotted.
  const segments = (pts: { year: number; value: number | null }[]) => {
    const solid: string[] = [];
    const gaps: string[] = [];
    let cur: string[] = [];
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      if (p.value == null) {
        if (cur.length) solid.push(cur.join(" "));
        cur = [];
        continue;
      }
      const prev = pts[i - 1];
      if (prev && prev.value != null && p.year - prev.year > 1) {
        if (cur.length) solid.push(cur.join(" "));
        gaps.push(`M${x(prev.year)},${y(prev.value)} L${x(p.year)},${y(p.value)}`);
        cur = [];
      }
      cur.push(`${cur.length ? "L" : "M"}${x(p.year)},${y(p.value)}`);
    }
    if (cur.length) solid.push(cur.join(" "));
    return { solid, gaps };
  };

  const nearestYear = (svgX: number) =>
    years.reduce((best, yr) => (Math.abs(x(yr) - svgX) < Math.abs(x(best) - svgX) ? yr : best), years[0]);
  const onMove = (e: React.PointerEvent<SVGRectElement>) => {
    const r = e.currentTarget.ownerSVGElement!.getBoundingClientRect();
    setHover(nearestYear(((e.clientX - r.left) / r.width) * W));
  };
  const onKey = (e: React.KeyboardEvent<SVGRectElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const i = hover == null ? years.length - 1 : years.indexOf(hover) + (e.key === "ArrowRight" ? 1 : -1);
    setHover(years[Math.max(0, Math.min(years.length - 1, i))]);
  };
  const valueAt = (s: Series, yr: number) => s.points.find((p) => p.year === yr)?.value ?? null;
  const bandAt = (yr: number) => band?.find((b) => b.year === yr);

  const labelYears = years.filter(
    (yr, i) => i === 0 || i === years.length - 1 || yr - years[i - 1] > 1 || yr % 2 === 0,
  );

  return (
    <figure className="chart">
      <div className="chart-scroll chart-hover-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={title}>
        {yTicks.map((t) => (
          <g key={t}>
            <line x1={M.left} x2={W - M.right} y1={y(t)} y2={y(t)} className="grid" />
            <text x={M.left - 8} y={y(t) + 4} textAnchor="end" className="axis">
              {t}
            </text>
          </g>
        ))}
        {labelYears.map((yr) => (
          <text key={yr} x={x(yr)} y={H - 12} textAnchor="middle" className="axis">
            {yr}
          </text>
        ))}
        <text x={M.left} y={10} className="axis">
          {yLabel}
        </text>

        {band && band.length > 0 && (
          <g className="band">
            {band.map((b) => (
              <line key={b.year} x1={x(b.year)} x2={x(b.year)} y1={y(b.lo)} y2={y(b.hi)} className="band-line" />
            ))}
          </g>
        )}

        {series.map((s) => {
          const { solid, gaps } = segments(s.points);
          return (
            <g key={s.label}>
              {solid.map((d, i) => (
                <path key={i} d={d} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round"
                  strokeDasharray={s.dashed ? "6 4" : undefined} />
              ))}
              {gaps.map((d, i) => (
                <path key={`g${i}`} d={d} fill="none" stroke={s.color} strokeWidth={1.5} strokeDasharray="2 4" opacity={0.6} />
              ))}
              {s.points.map((p) =>
                p.value == null ? null : (
                  <circle key={p.year} cx={x(p.year)} cy={y(p.value)} r={4} fill={s.color} className="pt" />
                ),
              )}
            </g>
          );
        })}

        {hover != null && (
          <g className="crosshair" pointerEvents="none">
            <line x1={x(hover)} x2={x(hover)} y1={M.top} y2={H - M.bottom} />
            {series.map((s) => {
              const v = valueAt(s, hover);
              return v == null ? null : <circle key={s.label} cx={x(hover)} cy={y(v)} r={5.5} fill={s.color} className="pt-on" />;
            })}
          </g>
        )}

        <rect
          x={M.left}
          y={M.top}
          width={W - M.left - M.right}
          height={H - M.top - M.bottom}
          fill="transparent"
          className="hit"
          tabIndex={0}
          aria-label={`${title}. Use the left and right arrow keys to read values by year.`}
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
          onFocus={() => setHover((h) => h ?? years[years.length - 1])}
          onBlur={() => setHover(null)}
          onKeyDown={onKey}
        />
      </svg>
      {hover != null && (
        <div
          className="chart-tip"
          style={{ left: `${(x(hover) / W) * 100}%`, transform: x(hover) / W > 0.6 ? "translateX(calc(-100% - 12px))" : "translateX(12px)" }}
          role="status"
        >
          <div className="tip-year">{hover}</div>
          {series.map((s) => {
            const v = valueAt(s, hover);
            return (
              <div key={s.label} className="tip-row">
                <span className="tip-dot" style={{ background: s.color }} aria-hidden="true" />
                <span className="tip-label">{s.label}</span>
                <span className="tip-val">{v == null ? "Not shown" : v.toFixed(1)}</span>
              </div>
            );
          })}
          {bandAt(hover) && (
            <div className="tip-row tip-band">
              Range of states: {bandAt(hover)!.lo.toFixed(1)} to {bandAt(hover)!.hi.toFixed(1)}
            </div>
          )}
        </div>
      )}
      </div>
      <figcaption className="chart-legend">
        {series.map((s) => (
          <span key={s.label}>
            <span className="key-line" style={{ borderTopColor: s.color, borderTopStyle: s.dashed ? "dashed" : "solid" }} />
            {s.label}
          </span>
        ))}
        {band && bandLabel && (
          <span>
            <span className="key-band" />
            {bandLabel}
          </span>
        )}
        {years.some((yr, i) => i > 0 && yr - years[i - 1] > 1) && (
          <span className="muted">Dotted line = years missing from CDC&apos;s file</span>
        )}
      </figcaption>
    </figure>
  );
}
