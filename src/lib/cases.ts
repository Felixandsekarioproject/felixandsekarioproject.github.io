import raw from "@/data/cases.json";

export type Quote = { text: string; who: string; cite: string };

export type Case = {
  id: string;
  name: string;
  year: number;
  decided: string;
  citation: string;
  kind: string;
  sourceFile: string;
  opinionUrl: string;
  teaser: string;
  background: string[];
  question: string;
  rule: string;
  sides: { label: string; text: string }[];
  choices: string[];
  actual: number;
  outcome: {
    summary: string;
    vote: string;
    author: string;
    majority: string[];
    concurInJudgment?: string[];
    dissent: string[];
    also: string;
    majorityQuote: Quote;
    otherQuote: Quote;
    otherSummary: string;
  };
  today: string;
  reflect: string;
};

export const casesMeta = (raw as { meta: { checked: string; note: string } }).meta;
export const cases = (raw as unknown as { cases: Case[] }).cases;
export const caseById = new Map(cases.map((c) => [c.id, c]));
