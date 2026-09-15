import { MousePointer2, Plus, GitBranch, Trash2 } from "lucide-react";
export function GraphControls({
  mode,
  setMode,
  vi,
}: {
  mode: string;
  setMode: (s: string) => void;
  vi: boolean;
}) {
  return (
    <div className="edit-tools">
      {[
        { id: "select", icon: MousePointer2, label: vi ? "Di chuyển" : "Move" },
        { id: "node", icon: Plus, label: vi ? "Thêm đỉnh" : "Add node" },
        { id: "edge", icon: GitBranch, label: vi ? "Thêm cạnh" : "Add edge" },
        { id: "delete", icon: Trash2, label: vi ? "Xóa" : "Delete" },
      ].map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          className={mode === id ? "selected-tool" : ""}
          title={label}
          onClick={() => setMode(id)}
        >
          <Icon size={16} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
