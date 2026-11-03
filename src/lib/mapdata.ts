import { getShapes } from "./geo";
import { stateByCode } from "./data";
import type { MapState } from "@/components/UsMap";

export function getMapStates(): MapState[] {
  return getShapes().map((sh) => {
    const s = stateByCode.get(sh.code)!;
    const values: MapState["values"] = {};
    for (const p of s.series) values[p.year] = { rate: p.rate, deaths: p.deaths };
    return { ...sh, name: s.name, values };
  });
}
