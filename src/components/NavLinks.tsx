"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/#map", label: "Map" },
  { href: "/states/", label: "States" },
  { href: "/compare/", label: "Compare" },
  { href: "/laws/", label: "Gun laws" },
  { href: "/history/", label: "History" },
  { href: "/disagreements/", label: "Disagreements" },
  { href: "/judge/", label: "You be the judge" },
  { href: "/sources/", label: "Sources" },
];

/** Main menu. Marks the section you are in (also on sub-pages like /states/ca/). */
export default function NavLinks() {
  const path = usePathname() ?? "/";
  const norm = path.endsWith("/") ? path : path + "/";

  return (
    <ul>
      {links.map((l) => {
        const here = !l.href.startsWith("/#") && norm.startsWith(l.href);
        return (
          <li key={l.href}>
            <Link href={l.href} aria-current={here ? (norm === l.href ? "page" : "true") : undefined}>
              {l.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
