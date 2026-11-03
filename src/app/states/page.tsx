import type { Metadata } from "next";
import Link from "next/link";
import { states } from "@/lib/data";

export const metadata: Metadata = { title: "All states" };

export default function StatesIndex() {
  return (
    <div className="wrap">
      <header className="hero">
        <h1>All states</h1>
        <p className="lead">Choose a state (or Washington, D.C.) to see its gun death numbers.</p>
      </header>
      <ul className="state-list">
        {states.map((s) => (
          <li key={s.code}>
            <Link prefetch={false} href={`/states/${s.code.toLowerCase()}/`}>{s.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
