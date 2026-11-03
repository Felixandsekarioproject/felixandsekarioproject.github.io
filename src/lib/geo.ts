// Runs at build time only (server). Turns the US Census-based map file
// into ready-to-draw SVG paths, so visitors' browsers don't need d3.
import { geoPath } from "d3-geo";
import { feature, neighbors as topoNeighbors } from "topojson-client";
import { presimplify, simplify } from "topojson-simplify";
import type { Topology, GeometryCollection } from "topojson-specification";
// Already projected to a 975 x 610 US map (Albers, with Alaska and Hawaii insets).
import us from "us-atlas/states-albers-10m.json";
import { states } from "./data";

export const MAP_W = 975;
export const MAP_H = 610;

export type StateShape = {
  code: string;
  name: string;
  d: string;
  cx: number;
  cy: number;
};

const topo = us as unknown as Topology<{ states: GeometryCollection<{ name: string }> }>;
const geoms = topo.objects.states.geometries;
const fipsToCode = new Map(states.map((s) => [s.fips, s.code]));

// Remove tiny details that can't be seen at screen size (areas under 1 square pixel),
// and round to 0.1 px. This makes the map about 4x lighter and faster to draw.
const MIN_AREA = 1;

export function getShapes(): StateShape[] {
  const light = simplify(presimplify(structuredClone(topo)), MIN_AREA) as typeof topo;
  const fc = feature(light, light.objects.states);
  const path = geoPath().digits(1);
  const out: StateShape[] = [];
  for (const f of fc.features) {
    const code = fipsToCode.get(String(f.id));
    if (!code) continue; // skips territories such as Puerto Rico
    const d = path(f);
    if (!d) continue;
    const [cx, cy] = path.centroid(f);
    out.push({ code, name: f.properties.name, d, cx, cy });
  }
  return out;
}

/** States that share a border, computed from the map itself. */
export function getNeighbors(code: string): string[] {
  const idx = geoms.findIndex((g) => fipsToCode.get(String(g.id)) === code);
  if (idx === -1) return [];
  const all = topoNeighbors(geoms);
  return all[idx]
    .map((j) => fipsToCode.get(String(geoms[j].id)))
    .filter((c): c is string => Boolean(c))
    .sort();
}
