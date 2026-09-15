import type { Step } from "../../types/graph";
export function DFSStepsTable({ steps, vi }: { steps: Step[]; vi: boolean }) {
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>{vi ? "Diễn giải" : "Explanation"}</th>
            <th>Stack / Queue</th>
            <th>{vi ? "Đã duyệt" : "Order"}</th>
          </tr>
        </thead>
        <tbody>
          {steps.map((s, i) => (
            <tr key={i}>
              <td>{i}</td>
              <td>{vi ? s.vi : s.en}</td>
              <td>{s.structure.join(", ") || "∅"}</td>
              <td>{s.order.join(" → ") || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
