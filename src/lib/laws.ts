import raw from "@/data/state-laws.json";

export type Evidence = {
  lawId: string;
  category: string;
  guns: string;
  effective: string;
  notYetInEffect: boolean;
  citation: string;
  note: string;
  discrepancy: string;
  age: string;
  waitDays: string;
};

export type LawEntry = { status: string; detail: string; evidence: Evidence[] };

export type Policy = {
  id: string;
  title: string;
  question: string;
  explain: string;
  statuses: { id: string; label: string }[];
};

export type LawState = { name: string; laws: Record<string, LawEntry> };

type File = {
  meta: {
    source: string;
    asOf: string;
    sourceUrl: string;
    citation: string;
    license: string;
    changes: string;
    retrieved: string;
  };
  policies: Policy[];
  states: Record<string, LawState>;
};

const file = raw as unknown as File;
export const lawMeta = file.meta;
export const policies = file.policies;
export const lawStates = file.states;

// Darker = more requirements under state law (statuses are listed from most to fewest).
const RAMPS: Record<number, string[]> = {
  3: ["#3e2470", "#8c6fb6", "#ece7f4"],
  4: ["#3e2470", "#65479a", "#b49dd0", "#ece7f4"],
};

export function statusColor(p: Policy, status: string): string {
  const ramp = RAMPS[p.statuses.length] ?? RAMPS[4];
  const i = p.statuses.findIndex((s) => s.id === status);
  return ramp[Math.max(0, i)];
}

export function statusText(p: Policy, status: string): string {
  return p.statuses.find((s) => s.id === status)?.label ?? status;
}

export function textColorOn(p: Policy, status: string): string {
  const i = p.statuses.findIndex((s) => s.id === status);
  return i <= 1 && p.statuses.length > 2 ? "#ffffff" : "#1a1a1a";
}
