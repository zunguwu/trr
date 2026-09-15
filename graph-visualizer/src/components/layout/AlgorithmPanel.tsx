import { useState } from "react";
import { Code2, Layers, Lightbulb, ArrowUpRight } from "lucide-react";
import { PseudocodeViewer } from "../algorithm/PseudocodeViewer";
import { StackVisualizer } from "../algorithm/StackVisualizer";
import { QueueVisualizer } from "../algorithm/QueueVisualizer";
import type { Algorithm, Step } from "../../types/graph";
export function AlgorithmPanel({
  algorithm,
  steps,
  index,
  vi,
  onPython,
}: {
  algorithm: Algorithm;
  steps: Step[];
  index: number;
  vi: boolean;
  onPython: () => void;
}) {
  const [tab, setTab] = useState("explain");
  const s = steps[Math.min(index, steps.length - 1)];
  return (
    <aside className="algorithm-panel">
      <div className="panel-heading">
        <span className="eyebrow">
          {vi ? "HIỂU TỪNG BƯỚC" : "UNDERSTAND EVERY STEP"}
        </span>
        <h2>
          {vi ? "Bên trong thuật toán" : "Inside the algorithm"}
          <Lightbulb size={18} />
        </h2>
      </div>
      <div className="panel-tabs">
        {[
          ["explain", vi ? "Diễn giải" : "Explanation"],
          ["code", "Code"],
          ["data", vi ? "Cấu trúc" : "Structure"],
        ].map(([id, label]) => (
          <button
            className={tab === id ? "active" : ""}
            key={id}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === "explain" && (
        <section className="explanation">
          <div className="live-label">
            <span />
            {vi ? "ĐANG KHÁM PHÁ" : "EXPLORING"} · {algorithm}
          </div>
          <h3>
            {index === 0
              ? vi
                ? "Một hành trình mới"
                : "A new journey"
              : `${vi ? "Bước" : "Step"} ${index}`}
          </h3>
          <p aria-live="polite">{vi ? s.vi : s.en}</p>
          <div className="history">
            {steps.slice(Math.max(0, index - 2), index).map((x, i) => (
              <div key={i}>
                <span>✓</span>
                {vi ? x.vi : x.en}
              </div>
            ))}
          </div>
        </section>
      )}
      {tab !== "data" && (
        <section className="code-section">
          <div className="section-title">
            <span>
              <Code2 size={15} />
              PSEUDOCODE
            </span>
            <small>{algorithm}</small>
          </div>
          <PseudocodeViewer algorithm={algorithm} line={s.line} />
          {tab === "code" && (
            <button className="text-button" onClick={onPython}>
              {vi ? "Xem & tải mã Python" : "View & download Python"}
              <ArrowUpRight size={14} />
            </button>
          )}
        </section>
      )}
      <section className="structure-section">
        <div className="section-title">
          <span>
            <Layers size={15} />
            {algorithm === "DFS" ? "CALL STACK" : "QUEUE"}
          </span>
          <small>
            {s.structure.length} {vi ? "phần tử" : "items"}
          </small>
        </div>
        {algorithm === "DFS" ? (
          <StackVisualizer items={s.structure} vi={vi} />
        ) : (
          <QueueVisualizer items={s.structure} vi={vi} />
        )}
      </section>
      <section className="complexity">
        <div>
          <span>{vi ? "Thời gian" : "Time"}</span>
          <b>O(V + E)</b>
        </div>
        <div>
          <span>{vi ? "Bộ nhớ" : "Space"}</span>
          <b>O(V)</b>
        </div>
        <p
          title={vi ? "V là số đỉnh, E là số cạnh" : "V = vertices, E = edges"}
        >
          V = {vi ? "số đỉnh" : "vertices"} · E = {vi ? "số cạnh" : "edges"}
        </p>
      </section>
    </aside>
  );
}
