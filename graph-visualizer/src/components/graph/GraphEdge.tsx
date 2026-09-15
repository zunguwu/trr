import { BaseEdge, getBezierPath, type EdgeProps } from "@xyflow/react";
export function GraphEdge(props: EdgeProps) {
  const { sourceX, sourceY, targetX, targetY } = props;
  const loop = props.source === props.target;
  const [curve] = getBezierPath(props);
  const path = loop
    ? `M ${sourceX} ${sourceY} C ${sourceX + 110} ${sourceY + 70}, ${targetX + 110} ${targetY - 70}, ${targetX} ${targetY}`
    : curve;
  return (
    <BaseEdge
      id={props.id}
      path={path}
      markerEnd={props.markerEnd}
      style={props.style}
      interactionWidth={24}
    />
  );
}
