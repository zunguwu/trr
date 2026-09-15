import { trace } from "./graphUtils";
import type { Graph } from "../types/graph";
export const dfs = (
  g: Graph,
  start: string,
  directed = false,
  descending = false,
) => trace(g, start, "DFS", directed, descending);
