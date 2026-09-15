import { useState } from "react";
import { Plus } from "lucide-react";

export function AddVertexForm({ vi, count, onAdd }: {
  vi: boolean;
  count: number;
  onAdd: (name: string) => boolean;
}) {
  const [name, setName] = useState("");
  const [error, setError] = useState<"empty" | "duplicate" | null>(null);
  return <form className="add-vertex-form" onSubmit={event => {
    event.preventDefault();
    const label = name.trim().normalize("NFC");
    if (!label) { setError("empty"); return; }
    if (count >= 30) return;
    if (onAdd(label)) { setName(""); setError(null); }
    else setError("duplicate");
  }}>
    <label htmlFor="new-vertex">{vi ? "Thêm phần tử (đỉnh)" : "Add an element (vertex)"}<small>{count}/30</small></label>
    <input id="new-vertex" value={name} maxLength={40} placeholder={vi ? "Ví dụ: G, 7, Building A" : "e.g. G, 7, Building A"} onChange={event => {setName(event.target.value);setError(null);}} aria-invalid={!!error} aria-describedby="vertex-form-hint" disabled={count >= 30}/>
    <p id="vertex-form-hint" className={error ? "form-error" : "field-hint"} aria-live="polite">{count >= 30 ? (vi ? "Đã đủ 30 đỉnh. Xóa một đỉnh để thêm mới." : "30-node limit reached. Remove a node to add another.") : error === "empty" ? (vi ? "Nhập tên phần tử trước khi thêm." : "Enter a name first.") : error === "duplicate" ? (vi ? "Tên này đã tồn tại. Hãy chọn tên khác." : "This name already exists. Choose another.") : (vi ? "Tên tối đa 40 ký tự. Nhấn Enter hoặc nút bên dưới." : "Up to 40 characters. Press Enter or the button below.")}</p>
    <button type="submit" disabled={count >= 30}><Plus size={16}/>{vi ? "Thêm vào đồ thị" : "Add to graph"}</button>
  </form>;
}
