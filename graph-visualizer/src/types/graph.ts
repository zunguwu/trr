export type {
  Algorithm,
  Vertex,
  Edge,
  Graph,
  EdgeKind,
  Step,
} from "../algorithms/graphUtils";
export type Document = {
  name: string;
  directed: boolean;
  vertices: string[];
  edges: string[][];
  startVertex: string;
  neighborOrder: "ascending" | "descending";
  positions?: Record<string, { x: number; y: number }>;
};
