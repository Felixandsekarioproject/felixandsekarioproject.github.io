"use client";

import { useEffect, useState } from "react";

/**
 * Localhost only (not in the live site): a small switcher to compare
 * background colors. Remove once a color is chosen.
 */
const OPTIONS = [
  { id: "current", label: "Current (violet white)", swatch: "oklch(98.3% 0.004 300)" },
  { id: "cream", label: "Cream", swatch: "oklch(97.4% 0.014 85)" },
  { id: "cream-blue", label: "Cream + pinch of blue", swatch: "oklch(97.3% 0.006 230)" },
  { id: "gray", label: "Soft gray", swatch: "oklch(96.6% 0.003 260)" },
] as const;

export default function PaletteTry() {
  const [pick, setPick] = useState<string>("current");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("palette-try");
      if (saved) setPick(saved); // eslint-disable-line react-hooks/set-state-in-effect
    } catch {}
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (pick === "current") root.removeAttribute("data-palette");
    else root.setAttribute("data-palette", pick);
    try { localStorage.setItem("palette-try", pick); } catch {}
  }, [pick]);

  return (
    <div className="palette-try" role="group" aria-label="Try a background color (localhost only)">
      <span className="palette-try-title">Background</span>
      {OPTIONS.map((o) => (
        <button key={o.id} type="button" aria-pressed={pick === o.id} onClick={() => setPick(o.id)}>
          <span className="palette-try-dot" style={{ background: o.swatch }} aria-hidden="true" />
          {o.label}
        </button>
      ))}
    </div>
  );
}
