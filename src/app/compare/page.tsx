import type { Metadata } from "next";
import CompareTool from "@/components/CompareTool";
import SourceNote from "@/components/SourceNote";
import { YEARS, states } from "@/lib/data";

export const metadata: Metadata = { title: "Compare states" };

export default function ComparePage() {
  return (
    <div className="wrap">
      <header className="hero">
        <h1>Compare states</h1>
        <p className="lead">
          Pick up to four states to see how their gun death rates changed over time. The rate is the number of
          gun deaths for every 100,000 people.
        </p>
      </header>
      <CompareTool states={states.map(({ code, name, series }) => ({ code, name, series }))} years={YEARS} />
      <p className="callout">
        Remember: a difference between two states does not by itself tell us <em>why</em> it exists. States differ
        in gun ownership, how rural they are, income, age, laws, and more.
      </p>
      <SourceNote />
    </div>
  );
}
