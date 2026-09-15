import test from "node:test";
import assert from "node:assert/strict";
import { trace, preset, edge, parseGraph } from "../src/algorithms/graphUtils";
import { decodeDocument } from "../src/algorithms/document";
import { adjacency } from "../src/algorithms/adjacency";
test("DFS order, stack unwinding and immutable history", () => {
  const steps = trace(preset(), "A", "DFS", false);
  assert.deepEqual(steps.at(-1)!.order, ["A", "B", "D", "E", "C", "F"]);
  assert.deepEqual(steps[1].structure, ["A"]);
  assert.deepEqual(steps.find((s) => s.discover === "D")!.structure, [
    "A",
    "B",
    "D",
  ]);
  assert.ok(steps.some((s) => s.reverse));
  assert.deepEqual(steps.at(-1)!.structure, []);
  assert.deepEqual(steps[0].visited, []);
  assert.equal(
    Object.values(steps.at(-1)!.edgeTypes).filter((t) => t === "back").length,
    0,
  );
});
test("BFS visits layers and enqueues each node only once", () => {
  const steps = trace(preset(), "A", "BFS", false);
  assert.deepEqual(steps.at(-1)!.order, ["A", "B", "C", "D", "E", "F"]);
  assert.deepEqual(steps.at(-1)!.levels, {
    A: 0,
    B: 1,
    C: 1,
    D: 2,
    E: 2,
    F: 2,
  });
  assert.ok(steps.some((s) => s.structure.join(",") === "B,C"));
  assert.ok(
    steps.every((s) => new Set(s.structure).size === s.structure.length),
  );
});
test("Directed reachability and isolated vertices", () => {
  const g = preset();
  assert.deepEqual(trace(g, "D", "BFS", true).at(-1)!.order, ["D"]);
  assert.deepEqual(
    trace({ nodes: [{ id: "Z", x: 0, y: 0 }], edges: [] }, "Z", "DFS", true).at(
      -1,
    )!.order,
    ["Z"],
  );
  assert.equal(trace({ nodes: [], edges: [] }, "A", "DFS", false).length, 1);
});
test("Cycles and self-loops classified without infinite recursion", () => {
  const g = preset("cycle");
  for (const a of ["DFS", "BFS"] as const)
    assert.equal(trace(g, "A", a, false).at(-1)!.order.length, 6);
  assert.ok(
    Object.values(trace(g, "A", "DFS", false).at(-1)!.edgeTypes).includes(
      "back",
    ),
  );
  const loop = { nodes: [{ id: "A", x: 0, y: 0 }], edges: [edge("A", "A")] };
  assert.equal(trace(loop, "A", "DFS", true).at(-1)!.edgeTypes["A-A"], "back");
});
test("Directed DFS distinguishes forward and cross edges", () => {
  const nodes = ["A", "B", "C", "D"].map((id) => ({ id, x: 0, y: 0 }));
  const g = {
    nodes,
    edges: [
      edge("A", "B"),
      edge("B", "C"),
      edge("A", "C"),
      edge("A", "D"),
      edge("D", "C"),
    ],
  };
  const result = trace(g, "A", "DFS", true).at(-1)!;
  assert.equal(result.edgeTypes["A-C"], "forward");
  assert.equal(result.edgeTypes["D-C"], "cross");
});
test("Descending neighbor order changes deterministic traversal", () => {
  assert.deepEqual(trace(preset(), "A", "DFS", false, true).at(-1)!.order, [
    "A",
    "C",
    "F",
    "B",
    "E",
    "D",
  ]);
});
test("Input parser handles isolated nodes and removes undirected duplicate edges", () => {
  const g = parseGraph("A: B, C\nB: A\nZ:", true, false);
  assert.equal(g.nodes.length, 4);
  assert.equal(g.edges.length, 2);
  assert.deepEqual(adjacency(g, false).Z, []);
  assert.throws(() => parseGraph("A B C", false, false));
  assert.throws(() => parseGraph("", false, false));
});
test("JSON roundtrip supports campus labels and rejects dangling edges", () => {
  const input = {
    name: "Smart Campus",
    directed: false,
    vertices: ["Data Center", "Lab"],
    edges: [["Data Center", "Lab"]],
    startVertex: "Lab",
    neighborOrder: "ascending",
  };
  const { graph } = decodeDocument(input);
  assert.deepEqual(trace(graph, "Lab", "BFS", false).at(-1)!.order, [
    "Lab",
    "Data Center",
  ]);
  assert.throws(() =>
    decodeDocument({ ...input, edges: [["Lab", "missing"]] }),
  );
  assert.throws(() => decodeDocument({ ...input, vertices: ["Lab", "Lab"] }));
  assert.throws(() => decodeDocument({ ...input, startVertex: "missing" }));
});
