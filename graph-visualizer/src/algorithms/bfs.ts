import { trace } from "./graphUtils";
import type { Graph } from "../types/graph";
export const bfs = (
  g: Graph,
  start: string,
  directed = false,
  descending = false,
) => trace(g, start, "BFS", directed, descending);
