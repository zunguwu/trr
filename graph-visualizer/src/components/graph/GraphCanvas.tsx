import { useEffect, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  BackgroundVariant,
  MarkerType,
  applyNodeChanges,
  useReactFlow,
  type Node,
  type NodeChange,
  type Connection,
} from "@xyflow/react";
import { GraphNode } from "./GraphNode";
import { GraphEdge } from "./GraphEdge";
import type { Graph, Step } from "../../types/graph";
const nodeTypes = { vertex: GraphNode },
  edgeTypes = { graph: GraphEdge };
const colors = {
  tree: "#7661d7",
  back: "#ed7777",
  forward: "#39a8b7",
  cross: "#c78b36",
};
type Props = {
  graph: Graph;
  step: Step;
  directed: boolean;
  showTypes: boolean;
  treeOnly: boolean;
  mode: string;
  onChange: (graph: Graph) => void;
  onPick: (id: string) => void;
  onBlank: (p: { x: number; y: number }) => void;
  vi: boolean;
};
function Canvas(p: Props) {
  const { screenToFlowPosition, fitView } = useReactFlow();
  const makeNodes = () =>
    p.graph.nodes.map((n) => ({
      id: n.id,
      type: "vertex",
      position: { x: n.x, y: n.y },
      data: {
        label: n.id,
        status:
          p.step.current === n.id
            ? "current"
            : p.step.completed.includes(n.id)
              ? "completed"
              : p.step.visited.includes(n.id)
                ? "visited"
                : "unvisited",
        level: Object.hasOwn(p.step.levels, n.id) ? p.step.levels[n.id] : undefined,
      },
    }));
  const [nodes, setNodes] = useState<Node[]>(makeNodes);
  const [selectedEdges, setSelectedEdges] = useState<Set<string>>(new Set());
  useEffect(() => {
    setNodes(makeNodes());
  }, [p.graph, p.step]); // UI positions are separate from algorithm snapshots.
  const ids = p.graph.nodes.map((n) => n.id).join("|");
  useEffect(() => {
    const t = setTimeout(() => fitView({ padding: 0.25, duration: 300 }), 80);
    return () => clearTimeout(t);
  }, [ids, fitView]);
  const connect = (c: Connection) => {
    if (
      !c.source ||
      !c.target ||
      p.graph.edges.some(
        (e) =>
          (e.source === c.source && e.target === c.target) ||
          (!p.directed && e.source === c.target && e.target === c.source),
      )
    )
      return;
    p.onChange({
      ...p.graph,
      edges: [
        ...p.graph.edges,
        { id: crypto.randomUUID(), source: c.source, target: c.target },
      ],
    });
  };
  const changes = (c: NodeChange[]) => setNodes((n) => applyNodeChanges(c, n));
  return (
    <ReactFlow
      nodes={nodes}
      edges={p.graph.edges
        .filter((e) => !p.treeOnly || p.step.edgeTypes[e.id] === "tree")
        .map((e) => {
          const active = p.step.activeEdge === e.id;
          const color = active
            ? "#e6a441"
            : p.showTypes && p.step.edgeTypes[e.id]
              ? colors[p.step.edgeTypes[e.id]]
              : p.step.edgeTypes[e.id] === "tree"
                ? "#9b8bdb"
                : "#b9becb";
          return {
            ...e,
            selected: selectedEdges.has(e.id),
            type: "graph",
            animated: active,
            className: p.step.reverse ? "backtracking" : "",
            style: { stroke: color, strokeWidth: active ? 3 : 2 },
            markerEnd: p.directed
              ? { type: MarkerType.ArrowClosed, color }
              : undefined,
          };
        })}
      onNodesChange={changes}
      onEdgesChange={(changes) => setSelectedEdges(previous => {
        const next = new Set(previous);
        for (const change of changes) {
          if (change.type === "select") {
            if (change.selected) next.add(change.id);
            else next.delete(change.id);
          } else if (change.type === "remove") next.delete(change.id);
        }
        return next;
      })}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onConnect={connect}
      onNodeDragStop={(_, n) =>
        p.onChange({
          ...p.graph,
          nodes: p.graph.nodes.map((v) =>
            v.id === n.id ? { ...v, ...n.position } : v,
          ),
        })
      }
      onNodeClick={(_, n) =>
        p.mode === "delete"
          ? p.onChange({
              nodes: p.graph.nodes.filter((v) => v.id !== n.id),
              edges: p.graph.edges.filter(
                (e) => e.source !== n.id && e.target !== n.id,
              ),
            })
          : p.onPick(n.id)
      }
      onEdgeClick={(_, e) => {
        if (p.mode === "delete")
          p.onChange({
            ...p.graph,
            edges: p.graph.edges.filter((x) => x.id !== e.id),
          });
      }}
      onDelete={({nodes: deletedNodes, edges: deletedEdges}) => {
        const ids = new Set(deletedNodes.map((n) => n.id));
        const edgeIds = new Set(deletedEdges.map((e) => e.id));
        p.onChange({
          nodes: p.graph.nodes.filter((n) => !ids.has(n.id)),
          edges: p.graph.edges.filter(
            (e) => !ids.has(e.source) && !ids.has(e.target) && !edgeIds.has(e.id),
          ),
        });
      }}
      onPaneClick={(e) => {
        if (p.mode === "node")
          p.onBlank(screenToFlowPosition({ x: e.clientX, y: e.clientY }));
      }}
      fitView
      minZoom={0.25}
      maxZoom={2}
      deleteKeyCode={["Backspace", "Delete"]}
      nodesDraggable={p.mode === "select"}
      colorMode="light"
      proOptions={{ hideAttribution: false }}
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={22}
        size={1}
        color="#a8adc22f"
      />
      <Controls showInteractive={false} />
      {!p.graph.nodes.length && (
        <div className="empty-canvas">
          {p.vi
            ? "Chọn Thêm đỉnh rồi nhấn lên canvas"
            : "Select Add node, then click the canvas"}
        </div>
      )}
    </ReactFlow>
  );
}
export function GraphCanvas(p: Props) {
  return (
    <ReactFlowProvider>
      <Canvas {...p} />
    </ReactFlowProvider>
  );
}
