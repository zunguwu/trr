import type { Document, Graph } from "../types/graph";
export function decodeDocument(value: unknown): {
  doc: Document;
  graph: Graph;
} {
  if (!value || typeof value !== "object") throw Error("Invalid JSON");
  const d = value as Document;
  if (
    typeof d.name !== "string" ||
    d.name.length > 120 ||
    typeof d.directed !== "boolean" ||
    !Array.isArray(d.vertices) ||
    d.vertices.length > 30 ||
    !d.vertices.length ||
    d.vertices.some(
      (v) => typeof v !== "string" || !v.trim() || v.length > 40,
    ) ||
    new Set(d.vertices).size !== d.vertices.length ||
    !Array.isArray(d.edges) ||
    d.edges.length > 900 ||
    d.edges.some(
      (e) =>
        !Array.isArray(e) ||
        e.length !== 2 ||
        !e.every((v) => d.vertices.includes(v)),
    ) ||
    !d.vertices.includes(d.startVertex) ||
    !["ascending", "descending"].includes(d.neighborOrder)
  )
    throw Error("Invalid graph");
  const graph: Graph = {
    nodes: d.vertices.map((id, i) => {
      const p = d.positions?.[id];
      return {
        id,
        x:
          p && Number.isFinite(p.x)
            ? p.x
            : 320 +
              190 *
                Math.cos((i * 2 * Math.PI) / d.vertices.length - Math.PI / 2),
        y:
          p && Number.isFinite(p.y)
            ? p.y
            : 250 +
              175 *
                Math.sin((i * 2 * Math.PI) / d.vertices.length - Math.PI / 2),
      };
    }),
    edges: [],
  };
  for (const [a, b] of d.edges)
    if (
      !graph.edges.some(
        (e) =>
          (e.source === a && e.target === b) ||
          (!d.directed && e.source === b && e.target === a),
      )
    )
      graph.edges.push({
        id: `edge-${graph.edges.length}`,
        source: a,
        target: b,
      });
  return { doc: d, graph };
}
