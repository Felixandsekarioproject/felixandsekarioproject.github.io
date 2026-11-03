import raw from "@/data/firearm-mortality.json";

export type Point = {
  year: number;
  rate: number | null;
  deaths: number | null;
  suppressed: boolean;
};

export type StateRecord = {
  code: string;
  name: string;
  fips: string;
  series: Point[];
};

type RawFile = {
  meta: {
    title: string;
    measure: string;
    rateDefinition: string;
    publisher: string;
    sourceName: string;
    sourceUrl: string;
    underlyingSource: string;
    underlyingSourceUrl: string;
    retrieved: string;
    license: string;
    years: number[];
    note: string;
  };
  nationalDeaths: Record<string, number>;
  states: Record<string, { name: string; fips: string; series: Point[] }>;
};

const file = raw as RawFile;

export const meta = file.meta;
export const YEARS = file.meta.years;
export const LATEST_YEAR = YEARS[YEARS.length - 1];

export const states: StateRecord[] = Object.entries(file.states)
  .map(([code, s]) => ({ code, ...s }))
  .sort((a, b) => a.name.localeCompare(b.name));

export const stateByCode = new Map(states.map((s) => [s.code, s]));

export function nationalDeaths(year: number): number {
  return file.nationalDeaths[String(year)];
}

export function pointFor(s: StateRecord, year: number): Point | undefined {
  return s.series.find((p) => p.year === year);
}

/** Rank 1 = highest rate. Returns undefined if the state's value is suppressed. */
export function rankFor(code: string, year: number): number | undefined {
  const sorted = states
    .map((s) => ({ code: s.code, rate: pointFor(s, year)?.rate ?? null }))
    .filter((r): r is { code: string; rate: number } => r.rate !== null)
    .sort((a, b) => b.rate - a.rate);
  const i = sorted.findIndex((r) => r.code === code);
  return i === -1 ? undefined : i + 1;
}

/** Median rate across the 51 jurisdictions (the "middle" state) for a year. */
export function medianRate(year: number): number {
  const rates = states
    .map((s) => pointFor(s, year)?.rate)
    .filter((r): r is number => r != null)
    .sort((a, b) => a - b);
  const mid = Math.floor(rates.length / 2);
  return rates.length % 2 ? rates[mid] : (rates[mid - 1] + rates[mid]) / 2;
}

export function rangeRate(year: number): [number, number] {
  const rates = states
    .map((s) => pointFor(s, year)?.rate)
    .filter((r): r is number => r != null);
  return [Math.min(...rates), Math.max(...rates)];
}

export const fmt = {
  int: (n: number) => n.toLocaleString("en-US"),
  rate: (n: number) => n.toFixed(1),
  pct: (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(0)}%`,
};
