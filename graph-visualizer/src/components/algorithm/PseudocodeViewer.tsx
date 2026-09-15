import type { Algorithm } from "../../types/graph";
export const code = {
  DFS: [
    "DFS(vertex):",
    "  mark vertex as visited",
    "  for each neighbor:",
    "    if neighbor is not visited:",
    "      DFS(neighbor)",
    "  return",
  ],
  BFS: [
    "BFS(start):",
    "  queue.enqueue(start)",
    "  visited[start] = true",
    "  while queue is not empty:",
    "    vertex = queue.dequeue()",
    "    for each neighbor:",
    "      if neighbor is not visited:",
    "        visited[neighbor] = true",
    "        queue.enqueue(neighbor)",
  ],
};
export function PseudocodeViewer({
  algorithm,
  line,
}: {
  algorithm: Algorithm;
  line: number;
}) {
  return (
    <div className="pseudocode">
      {code[algorithm].map((text, i) => (
        <div key={i} className={line === i ? "highlight" : ""}>
          <span>{i + 1}</span>
          <code>{text}</code>
        </div>
      ))}
    </div>
  );
}
