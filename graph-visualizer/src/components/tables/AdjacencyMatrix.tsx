export function AdjacencyMatrix({ list }: { list: Record<string, string[]> }) {
  const ids = Object.keys(list);
  return (
    <div className="table-scroll">
      <table className="matrix">
        <thead>
          <tr>
            <th>V</th>
            {ids.map((v) => (
              <th key={v}>{v}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ids.map((v) => (
            <tr key={v}>
              <th>{v}</th>
              {ids.map((n) => (
                <td className={list[v].includes(n) ? "one" : ""} key={n}>
                  {Number(list[v].includes(n))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
