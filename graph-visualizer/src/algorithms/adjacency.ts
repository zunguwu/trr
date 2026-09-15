import type { Graph } from "../types/graph";
export function adjacency(graph: Graph, directed: boolean, descending = false) {
  return Object.fromEntries(
    graph.nodes.map((n) => [
      n.id,
      [
        ...new Set(
          graph.edges.flatMap((e) =>
            e.source === n.id
              ? [e.target]
              : !directed && e.target === n.id
                ? [e.source]
                : [],
          ),
        ),
      ].sort((a, b) => (descending ? -1 : 1) * a.localeCompare(b)),
    ]),
  );
}
