export type Algorithm = "DFS" | "BFS";
export type Vertex = { id: string; x: number; y: number };
export type Edge = { id: string; source: string; target: string };
export type Graph = { nodes: Vertex[]; edges: Edge[] };
export type EdgeKind = "tree" | "back" | "forward" | "cross";
export type Step = {
  current: string | null;
  visited: string[];
  completed: string[];
  order: string[];
  structure: string[];
  edgeTypes: Record<string, EdgeKind>;
  activeEdge?: string;
  reverse?: boolean;
  line: number;
  vi: string;
  en: string;
  discover?: string;
  levels: Record<string, number>;
};
export const edge = (source: string, target: string): Edge => ({
  id: `${source}-${target}`,
  source,
  target,
});
export function preset(kind = "simple"): Graph {
  const nodes = ["A", "B", "C", "D", "E", "F"].map((id, i) => ({
    id,
    x: [330, 190, 470, 110, 270, 490][i],
    y: [100, 230, 230, 370, 370, 370][i],
  }));
  if (kind === "simple" || kind === "tree")
    return {
      nodes,
      edges: ["AB", "AC", "BD", "BE", "CF"].map((e) => edge(e[0], e[1])),
    };
  nodes.forEach((n, i) => {
    n.x = 320 + Math.cos((i * Math.PI) / 3 - Math.PI / 2) * 190;
    n.y = 250 + Math.sin((i * Math.PI) / 3 - Math.PI / 2) * 175;
  });
  const edges: Edge[] = [];
  for (let i = 0; i < 6; i++)
    for (let j = i + 1; j < 6; j++)
      if (
        kind === "complete" ||
        (kind === "cycle"
          ? j === i + 1 || (i === 0 && j === 5)
          : j === i + 1 || Math.random() < 0.24)
      )
        edges.push(edge(nodes[i].id, nodes[j].id));
  return { nodes, edges };
}
export function trace(
  graph: Graph,
  start: string,
  algorithm: Algorithm,
  directed: boolean,
  descending = false,
): Step[] {
  const state: Step = {
    current: null,
    visited: [],
    completed: [],
    order: [],
    structure: [],
    edgeTypes: {},
    line: 0,
    vi: "Sẵn sàng. Nhấn chạy để bắt đầu khám phá.",
    en: "Ready. Press play to begin exploring.",
    levels: Object.create(null),
  };
  const steps: Step[] = [];
  const emit = (
    vi: string,
    en: string,
    line: number,
    extra: Partial<Step> = {},
  ) => {
    Object.assign(
      state,
      { activeEdge: undefined, reverse: false, discover: undefined },
      extra,
      { vi, en, line },
    );
    steps.push(structuredClone(state));
  };
  emit(state.vi, state.en, 0);
  if (!graph.nodes.some((n) => n.id === start)) return steps;
  const neighbors = (v: string) =>
    graph.edges
      .flatMap((e) =>
        e.source === v
          ? [{ id: e.target, edge: e.id }]
          : !directed && e.target === v
            ? [{ id: e.source, edge: e.id }]
            : [],
      )
      .sort((a, b) => (descending ? -1 : 1) * a.id.localeCompare(b.id));
  const seen = new Set<string>();
  const done = new Set<string>();
  const entry: Record<string, number> = Object.create(null);
  if (algorithm === "DFS") {
    const dfs = (v: string, parent?: string, via?: string, level = 0) => {
      seen.add(v);
      entry[v] = seen.size;
      state.visited.push(v);
      state.order.push(v);
      state.structure.push(v);
      state.current = v;
      state.levels[v] = level;
      emit(
        `Thăm ${v} · Đẩy ${v} vào stack.`,
        `Visit ${v} · Push ${v} onto the stack.`,
        1,
        { discover: v, activeEdge: via },
      );
      for (const n of neighbors(v)) {
        if (!directed && n.edge === parent) continue;
        emit(`Xét cạnh ${v} → ${n.id}.`, `Inspect edge ${v} → ${n.id}.`, 3, {
          current: v,
          activeEdge: n.edge,
        });
        if (!seen.has(n.id)) {
          state.edgeTypes[n.edge] = "tree";
          emit(
            `Đi sâu từ ${v} → ${n.id}.`,
            `Explore deeper from ${v} → ${n.id}.`,
            4,
            { activeEdge: n.edge },
          );
          dfs(n.id, n.edge, n.edge, level + 1);
          state.current = v;
          emit(
            `Quay lui ${n.id} → ${v} · Tiếp tục nhánh còn lại.`,
            `Backtrack ${n.id} → ${v} · Explore remaining neighbors.`,
            2,
            { activeEdge: n.edge, reverse: true },
          );
        } else {
          const kind: EdgeKind = !done.has(n.id)
            ? "back"
            : entry[v] < entry[n.id]
              ? "forward"
              : "cross";
          if (!state.edgeTypes[n.edge]) state.edgeTypes[n.edge] = kind;
          emit(
            kind === "back"
              ? `Cạnh ngược ${v} → ${n.id}: phát hiện chu trình.`
              : `${n.id} đã được thăm · Bỏ qua.`,
            kind === "back"
              ? `Back edge ${v} → ${n.id}: a cycle is detected.`
              : `${n.id} is already visited · Skip.`,
            3,
            { activeEdge: n.edge },
          );
        }
      }
      done.add(v);
      state.completed.push(v);
      state.structure.pop();
      emit(
        `Hoàn tất ${v} · Lấy ${v} khỏi stack.`,
        `Complete ${v} · Pop ${v} from the stack.`,
        5,
        { current: v },
      );
    };
    dfs(start);
  } else {
    seen.add(start);
    state.visited.push(start);
    state.structure.push(start);
    state.levels[start] = 0;
    emit(
      `Thêm ${start} vào hàng đợi, đánh dấu đã phát hiện.`,
      `Enqueue ${start} and mark it as discovered.`,
      2,
    );
    while (state.structure.length) {
      const v = state.structure.shift()!;
      state.current = v;
      state.order.push(v);
      emit(
        `Lấy ${v} khỏi hàng đợi · Thăm tầng ${state.levels[v]}.`,
        `Dequeue ${v} · Visit level ${state.levels[v]}.`,
        4,
        { discover: v },
      );
      for (const n of neighbors(v)) {
        emit(`Xét cạnh ${v} → ${n.id}.`, `Inspect edge ${v} → ${n.id}.`, 6, {
          activeEdge: n.edge,
        });
        if (!seen.has(n.id)) {
          seen.add(n.id);
          state.visited.push(n.id);
          state.structure.push(n.id);
          state.levels[n.id] = state.levels[v] + 1;
          state.edgeTypes[n.edge] = "tree";
          emit(
            `Thêm ${n.id} vào cuối hàng đợi · Tầng ${state.levels[n.id]}.`,
            `Enqueue ${n.id} at the rear · Level ${state.levels[n.id]}.`,
            8,
            { activeEdge: n.edge },
          );
        }
      }
      state.completed.push(v);
      emit(
        `Hoàn tất các đỉnh kề của ${v}.`,
        `Finished exploring neighbors of ${v}.`,
        3,
      );
    }
  }
  emit(
    `Hoàn thành! Đã duyệt ${seen.size}/${graph.nodes.length} đỉnh từ ${start}.`,
    `Complete! Reached ${seen.size}/${graph.nodes.length} vertices from ${start}.`,
    algorithm === "DFS" ? 5 : 3,
    { current: null },
  );
  return steps;
}
export function parseGraph(
  input: string,
  adjacency: boolean,
  directed: boolean,
): Graph {
  const ids = new Set<string>();
  const edges: Edge[] = [];
  const add = (a: string, b?: string) => {
    if (!/^[A-Za-z0-9_]{1,8}$/.test(a) || (b && !/^[A-Za-z0-9_]{1,8}$/.test(b)))
      throw Error("label");
    ids.add(a);
    if (b) {
      ids.add(b);
      if (
        !edges.some(
          (e) =>
            (e.source === a && e.target === b) ||
            (!directed && e.source === b && e.target === a),
        )
      )
        edges.push(edge(a, b));
    }
  };
  for (const line of input
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)) {
    if (adjacency) {
      const parts = line.split(":");
      if (parts.length !== 2) throw Error("format");
      const a = parts[0].trim();
      add(a);
      for (const b of parts[1].split(/[\s,]+/).filter(Boolean)) add(a, b);
    } else {
      const parts = line.split(/\s+/);
      if (parts.length > 2) throw Error("format");
      add(parts[0], parts[1]);
    }
  }
  if (ids.size > 30 || ids.size === 0) throw Error("size");
  return {
    nodes: [...ids].map((id, i) => ({
      id,
      x: 320 + 190 * Math.cos((i * 2 * Math.PI) / ids.size - Math.PI / 2),
      y: 250 + 175 * Math.sin((i * 2 * Math.PI) / ids.size - Math.PI / 2),
    })),
    edges,
  };
}
