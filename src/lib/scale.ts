// One fixed color scale for every year, so colors mean the same thing
// when you move the year slider. Purple shades — deliberately NOT red/blue,
// because red and blue on a US map look like an election map.

export const BREAKS = [5, 10, 15, 20, 25];

export const COLORS = [
  "#f1edf7",
  "#d6cbe7",
  "#b49dd0",
  "#8c6fb6",
  "#65479a",
  "#3e2470",
];

export const SUPPRESSED_COLOR = "#e5e5e5";

export function colorFor(rate: number | null | undefined): string {
  if (rate == null) return SUPPRESSED_COLOR;
  let i = 0;
  while (i < BREAKS.length && rate >= BREAKS[i]) i++;
  return COLORS[i];
}

/** Use white text on the darker half of the scale. */
export function textOn(rate: number | null | undefined): string {
  if (rate == null) return "#222";
  return rate >= BREAKS[2] ? "#ffffff" : "#1a1a1a";
}

export const LEGEND = COLORS.map((color, i) => {
  const lo = BREAKS[i - 1];
  const hi = BREAKS[i];
  const label =
    i === 0 ? `Under ${hi}` : i === BREAKS.length ? `${lo} or more` : `${lo} to ${hi}`;
  return { color, label };
});
