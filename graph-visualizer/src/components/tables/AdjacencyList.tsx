export function AdjacencyList({ list }: { list: Record<string, string[]> }) {
  return (
    <table>
      <thead>
        <tr>
          <th>V</th>
          <th>Neighbors</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(list).map(([v, n]) => (
          <tr key={v}>
            <th>{v}</th>
            <td>{n.join(" → ") || "∅"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
