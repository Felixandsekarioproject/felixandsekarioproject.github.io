import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CaseGame from "@/components/CaseGame";
import { caseById, cases, casesMeta } from "@/lib/cases";

export const dynamicParams = false;

export function generateStaticParams() {
  return cases.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: PageProps<"/judge/[id]">): Promise<Metadata> {
  const { id } = await params;
  const c = caseById.get(id);
  return { title: c ? `You be the judge: ${c.name}` : "You be the judge" };
}

export default async function CasePage({ params }: PageProps<"/judge/[id]">) {
  const { id } = await params;
  const c = caseById.get(id);
  if (!c) notFound();
  const i = cases.findIndex((x) => x.id === id);
  const next = cases[i + 1];

  return (
    <article className="wrap narrow">
      <header className="hero">
        <p className="kicker">
          <Link prefetch={false} href="/judge/">You be the judge</Link> / Case {i + 1} of {cases.length}
        </p>
        <h1>{c.name}</h1>
        <p className="lead">{c.teaser}</p>
        <p className="meta-line">
          <span className="pill">{c.kind}</span> <span className="muted">Supreme Court · {c.year}</span>
        </p>
      </header>
      <CaseGame c={c} next={next ? { id: next.id, name: next.name } : undefined} />
      <p className="muted small" style={{ marginTop: 32 }}>
        All facts, votes and quotes come from the official Supreme Court opinion. Quotes are checked word-for-word
        against the official text. Last checked {casesMeta.checked}.
      </p>
    </article>
  );
}
