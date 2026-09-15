import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
export type GraphNodeData = { label: string; status: string; level?: number };
export function GraphNode({ data, selected }: NodeProps<Node<GraphNodeData>>) {
  return (
    <div className={`vertex ${data.status} ${selected ? "selected" : ""}`}>
      <Handle type="target" position={Position.Top} />
      <span title={data.label}>{data.label}</span>
      {data.level !== undefined && <small>L{data.level}</small>}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
