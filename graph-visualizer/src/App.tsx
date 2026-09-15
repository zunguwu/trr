import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Download,
  FileJson,
  FolderOpen,
  GraduationCap,
  Info,
  Network,
  RotateCcw,
  Save,
  Settings2,
  Shuffle,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { preset, parseGraph, trace } from "./algorithms/graphUtils";
import { adjacency } from "./algorithms/adjacency";
import { decodeDocument } from "./algorithms/document";
import type { Algorithm, Document, Graph } from "./types/graph";
import { useAlgorithmPlayer } from "./hooks/useAlgorithmPlayer";
import { Header } from "./components/layout/Header";
import { QuickStart, UsageGuide } from "./components/layout/UsageGuide";
import { Sidebar } from "./components/layout/Sidebar";
import { AlgorithmPanel } from "./components/layout/AlgorithmPanel";
import { GraphCanvas } from "./components/graph/GraphCanvas";
import { GraphControls } from "./components/graph/GraphControls";
import { AddVertexForm } from "./components/graph/AddVertexForm";
import { AlgorithmControls } from "./components/algorithm/AlgorithmControls";
import { TraversalOrder } from "./components/algorithm/TraversalOrder";
import { AdjacencyList } from "./components/tables/AdjacencyList";
import { AdjacencyMatrix } from "./components/tables/AdjacencyMatrix";
import { DFSStepsTable } from "./components/tables/DFSStepsTable";
const STORAGE = "graph-visualizer-document-v1",
  SAVED = "graph-visualizer-saved-v1";
function download(name: string, text: string, type = "application/json") {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export default function App() {
  const [graph, setGraph] = useState<Graph>(preset),
    [start, setStart] = useState("A"),
    [directed, setDirected] = useState(false),
    [algorithm, setAlgorithm] = useState<Algorithm>("DFS"),
    [descending, setDescending] = useState(false),
    [name, setName] = useState("Hành trình khám phá"),
    [vi, setVi] = useState(true),
    [dark, setDark] = useState(false),
    [mode, setMode] = useState("select"),
    [selectedPreset, setSelectedPreset] = useState("simple"),
    [showTypes, setShowTypes] = useState(false),
    [learning, setLearning] = useState(false),
    [modal, setModal] = useState(""),
    [view, setView] = useState("graph"),
    [sidebar, setSidebar] = useState(false),
    [input, setInput] = useState("A B\nA C\nB D\nB E\nC F"),
    [inputType, setInputType] = useState("edges"),
    [toast, setToast] = useState(""),
    [source, setSource] = useState<string | null>(null),
    [ready, setReady] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const steps = useMemo(
    () => trace(graph, start, algorithm, directed, descending),
    [graph, start, algorithm, directed, descending],
  );
  const player = useAlgorithmPlayer(steps, learning, !!modal);
  const list = useMemo(
    () => adjacency(graph, directed, descending),
    [graph, directed, descending],
  );
  const t = (a: string, b: string) => (vi ? a : b);
  const doc = useMemo<Document>(
    () => ({
      name,
      directed,
      vertices: graph.nodes.map((n) => n.id),
      edges: graph.edges.map((e) => [e.source, e.target]),
      startVertex: start,
      neighborOrder: descending ? "descending" : "ascending",
      positions: Object.fromEntries(
        graph.nodes.map((n) => [n.id, { x: n.x, y: n.y }]),
      ),
    }),
    [name, directed, graph, start, descending],
  );
  const load = (raw: unknown) => {
    const { doc: d, graph: g } = decodeDocument(raw);
    setName(d.name);
    setDirected(d.directed);
    setGraph(g);
    setStart(d.startVertex);
    setDescending(d.neighborOrder === "descending");
    setSource(null);
  };
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) load(JSON.parse(raw));
      setDark(localStorage.getItem("graph-theme") === "dark");
      setVi(localStorage.getItem("graph-language") !== "en");
    } catch {
      setToast(
        "Không thể khôi phục dữ liệu cũ. / Could not restore saved data.",
      );
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      if (graph.nodes.length)
        localStorage.setItem(STORAGE, JSON.stringify(doc));
      else localStorage.removeItem(STORAGE);
    } catch {
      setToast(
        t(
          "Không thể lưu: bộ nhớ trình duyệt không khả dụng.",
          "Cannot save: browser storage is unavailable.",
        ),
      );
    }
  }, [doc, ready]);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.lang = vi ? "vi" : "en";
    if (ready)
      try {
        localStorage.setItem("graph-theme", dark ? "dark" : "light");
        localStorage.setItem("graph-language", vi ? "vi" : "en");
      } catch {
        /* Preferences remain available for this session. */
      }
  }, [dark, vi, ready]);
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  useEffect(() => {
    if (player.question) setView("graph");
  }, [player.question]);
  useEffect(() => {
    if (!modal) return;
    player.pause();
    const previous = document.activeElement as HTMLElement | null;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModal("");
      if (e.key === "Tab") {
        const elements = Array.from(
          document.querySelectorAll<HTMLElement>(
            ".modal button, .modal input, .modal select, .modal textarea, .modal a",
          ),
        ).filter((el) => !el.hasAttribute("disabled"));
        const first = elements[0],
          last = elements.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("keydown", key);
      previous?.focus();
    };
  }, [modal]);
  const change = (g: Graph) => {
    setGraph(g);
    setSource(null);
    if (!g.nodes.some((n) => n.id === start)) setStart(g.nodes[0]?.id || "");
  };
  const makePreset = (kind: string) => {
    change(preset(kind));
    setStart("A");
    setSelectedPreset(kind);
  };
  const addNode = (p: { x: number; y: number }) => {
    if (graph.nodes.length >= 30) {
      setToast(t("Tối đa 30 đỉnh.", "Maximum 30 vertices."));
      return;
    }
    let i = 0;
    let id = "A";
    while (graph.nodes.some((n) => n.id === id)) {
      i++;
      id = i < 26 ? String.fromCharCode(65 + i) : `N${i + 1}`;
    }
    change({ ...graph, nodes: [...graph.nodes, { id, ...p }] });
  };
  const addNamedNode = (id: string) => {
    if (graph.nodes.length >= 30 || graph.nodes.some(node => node.id.normalize("NFC") === id)) return false;
    let position = {x: 110, y: 100};
    for (let slot = 0; slot < 120; slot++) {
      position = {x: 110 + (slot % 5) * 130, y: 100 + Math.floor(slot / 5) * 110};
      if (graph.nodes.every(node => Math.hypot(node.x - position.x, node.y - position.y) >= 90)) break;
    }
    change({...graph, nodes: [...graph.nodes, {id, ...position}]});
    setView("graph");
    setMode("select");
    setSelectedPreset("");
    setToast(t(`Đã thêm ${id}. Dùng Thêm cạnh để nối với đỉnh khác.`, `Added ${id}. Use Add edge to connect it to another node.`));
    return true;
  };
  const pick = (id: string) => {
    if (player.question) {
      setToast(
        player.answer(id)
          ? t(
              "Chính xác! Tiếp tục bước kế tiếp.",
              "Correct! Continue to the next step.",
            )
          : t(
              `Chưa đúng. ${algorithm === "DFS" ? "DFS đi sâu theo nhánh đầu tiên chưa thăm." : "BFS lấy đỉnh ở đầu hàng đợi."}`,
              `Not quite. ${algorithm === "DFS" ? "DFS explores the first unvisited branch." : "BFS visits the front of the queue."}`,
            ),
      );
      return;
    }
    if (mode === "edge") {
      if (!source) {
        setSource(id);
        setToast(
          t(
            `Đã chọn ${id}. Chọn đỉnh đích.`,
            `Selected ${id}. Choose the target.`,
          ),
        );
      } else {
        if (
          !graph.edges.some(
            (e) =>
              (e.source === source && e.target === id) ||
              (!directed && e.source === id && e.target === source),
          )
        )
          change({
            ...graph,
            edges: [
              ...graph.edges,
              { id: crypto.randomUUID(), source, target: id },
            ],
          });
        setSource(null);
      }
    }
  };
  const python = `# ${algorithm} — generated from your graph\n${algorithm === "BFS" ? "from collections import deque\n" : ""}graph = ${JSON.stringify(list, null, 4)}\nstart = ${JSON.stringify(start)}\nvisited = set()\norder = []\n\n${algorithm === "DFS" ? `def dfs(vertex):\n    visited.add(vertex)\n    order.append(vertex)\n    for neighbor in graph[vertex]:\n        if neighbor not in visited:\n            dfs(neighbor)\n\ndfs(start)` : `queue = deque([start])\nvisited.add(start)\nwhile queue:\n    vertex = queue.popleft()\n    order.append(vertex)\n    for neighbor in graph[vertex]:\n        if neighbor not in visited:\n            visited.add(neighbor)\n            queue.append(neighbor)`}\nprint(' -> '.join(order))\n`;
  return (
    <>
      <Header
        vi={vi}
        dark={dark}
        setVi={setVi}
        setDark={setDark}
        onHelp={() => setModal("help")}
        onLearn={() => setModal("learn")}
      />
      <main data-algorithm={algorithm}>
        <div className="page-intro">
          <div>
            <div className="eyebrow">
              <span className="purple-dot" />
              {t("KHÔNG GIAN HỌC THUẬT TOÁN", "YOUR ALGORITHM PLAYGROUND")}
            </div>
            <h1>
              {t(
                "Hiểu đồ thị. Qua từng bước.",
                "Understand graphs. One step at a time.",
              )}
            </h1>
            <p>
              {t(
                "Tự tay khám phá cách DFS và BFS tìm đường trên đồ thị.",
                "Discover how DFS and BFS explore a graph, at your own pace.",
              )}
            </p>
          </div>
          <button
            className={`learning ${learning ? "enabled" : ""}`}
            onClick={() => {
              setLearning(!learning);
              player.reset();
              setMode("select");
            }}
          >
            <GraduationCap size={18} />
            {t("Chế độ học tập", "Learning mode")}
            <span className="toggle">
              <i />
            </span>
          </button>
        </div>
        <QuickStart vi={vi} onHelp={() => setModal("help")} />
        <button
          className="mobile-settings"
          onClick={() => setSidebar(!sidebar)}
        >
          <Settings2 size={16} />
          {t("Cài đặt đồ thị", "Graph settings")}
          <ChevronDown size={14} />
        </button>
        <div className="workspace">
          <Sidebar open={sidebar}>
            <div className="sidebar-heading">
              <Settings2 size={16} />
              {t("Thiết lập đồ thị", "Graph controls")}
            </div>
            <section>
              <label className="field-label">
                01 <span>{t("Thuật toán", "Algorithm")}</span>
              </label>
              <div className="segmented algorithm-picker">
                {(["DFS", "BFS"] as Algorithm[]).map((a) => (
                  <button
                    key={a}
                    className={algorithm === a ? "active" : ""}
                    onClick={() => setAlgorithm(a)}
                  >
                    {a}
                    <small>
                      {a === "DFS"
                        ? t("Chiều sâu", "Depth first")
                        : t("Chiều rộng", "Breadth first")}
                    </small>
                  </button>
                ))}
              </div>
              <p className="field-hint">
                {algorithm === "DFS"
                  ? t(
                      "Đi sâu một nhánh, quay lui để khám phá tiếp.",
                      "Explore a branch deeply, then backtrack.",
                    )
                  : t(
                      "Khám phá lần lượt từng tầng của đồ thị.",
                      "Explore the graph one level at a time.",
                    )}
              </p>
            </section>
            <section>
              <label className="field-label" htmlFor="start">
                02 <span>{t("Đỉnh bắt đầu", "Start vertex")}</span>
              </label>
              <select
                id="start"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                disabled={!graph.nodes.length}
              >
                {graph.nodes.map((n) => (
                  <option key={n.id}>{n.id}</option>
                ))}
              </select>
              <div className="field-label secondary-label">
                {t("Loại đồ thị", "Graph type")}
              </div>
              <div className="segmented">
                <button
                  className={!directed ? "active" : ""}
                  onClick={() => {
                    setDirected(false);
                    change({...graph, edges:graph.edges.filter((e,i,all)=>!all.slice(0,i).some(prior=>(prior.source===e.source&&prior.target===e.target)||(prior.source===e.target&&prior.target===e.source)))});
                  }}
                >
                  {t("Vô hướng", "Undirected")}
                </button>
                <button
                  className={directed ? "active" : ""}
                  onClick={() => setDirected(true)}
                >
                  {t("Có hướng", "Directed")}
                </button>
              </div>
            </section>
            <section>
              <label className="field-label">
                03 <span>{t("Đồ thị mẫu", "Graph presets")}</span>
              </label>
              <div className="presets">
                {[
                  ["simple", t("Cơ bản", "Simple graph")],
                  ["tree", t("Cây", "Tree")],
                  ["cycle", t("Chu trình", "Cycle")],
                  ["complete", t("Đầy đủ", "Complete")],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    className={selectedPreset === id ? "chosen" : ""}
                    onClick={() => makePreset(id)}
                  >
                    <Network size={15} />
                    {label}
                    {selectedPreset === id && <Check size={13} />}
                  </button>
                ))}
              </div>
              <button
                className="random-button"
                onClick={() => makePreset("random")}
              >
                <Shuffle size={15} />
                {t("Tạo đồ thị ngẫu nhiên", "Generate random graph")}
              </button>
            </section>
            <section>
              <label className="field-label">
                04 <span>{t("Chỉnh sửa đồ thị", "Edit graph")}</span>
              </label>
              <GraphControls
                mode={mode}
                setMode={(m) => {
                  setMode(m);
                  setSource(null);
                }}
                vi={vi}
              />
              <AddVertexForm vi={vi} count={graph.nodes.length} onAdd={addNamedNode}/>
              <p className="field-hint">
                {t(
                  "Kéo đỉnh để di chuyển. Kéo giữa hai chấm kết nối để tạo cạnh.",
                  "Drag nodes to move. Drag between handles to connect.",
                )}
              </p>
              <button
                className="text-button muted"
                onClick={() => setModal("clear")}
              >
                {t("Làm trống canvas", "Clear canvas")}
                <RotateCcw size={13} />
              </button>
            </section>
            <details>
              <summary>
                {t("Tùy chọn nâng cao", "Advanced options")}
                <ChevronDown size={14} />
              </summary>
              <label className="check">
                <input
                  type="checkbox"
                  checked={showTypes}
                  onChange={(e) => setShowTypes(e.target.checked)}
                  disabled={algorithm !== "DFS"}
                />
                {t("Phân loại cạnh DFS", "Show DFS edge types")}
              </label>
              <label className="field-label" htmlFor="order">
                {t("Thứ tự đỉnh kề", "Neighbor order")}
              </label>
              <select
                id="order"
                value={descending ? "descending" : "ascending"}
                onChange={(e) => setDescending(e.target.value === "descending")}
              >
                <option value="ascending">A → Z</option>
                <option value="descending">Z → A</option>
              </select>
              <button className="wide" onClick={() => setModal("input")}>
                <FileJson size={15} />
                {t("Nhập danh sách cạnh / kề", "Input edge / adjacency list")}
              </button>
              <button className="wide" onClick={() => fileRef.current?.click()}>
                <Upload size={15} />
                Import JSON
              </button>
              <button
                className="wide"
                onClick={() =>
                  download("graph.json", JSON.stringify(doc, null, 2))
                }
              >
                <Download size={15} />
                Export JSON
              </button>
              <button className="wide" onClick={() => setModal("python")}>
                <FileJson size={15} />
                {t("Xuất mã Python", "Generate Python")}
              </button>
              <label className="field-label" htmlFor="topic">
                {t("Tên đề tài", "Project name")}
              </label>
              <input
                id="topic"
                value={name}
                maxLength={120}
                onChange={(e) => setName(e.target.value)}
              />
              <div className="save-buttons">
                <button
                  title={t("Lưu đồ thị", "Save graph")}
                  onClick={() => {
                    try {
                      if (!graph.nodes.length) throw Error();
                      localStorage.setItem(SAVED, JSON.stringify(doc));
                      setToast(t("Đã lưu đồ thị.", "Graph saved."));
                    } catch {
                      setToast(
                        t(
                          "Không thể lưu đồ thị trống hoặc bộ nhớ không khả dụng.",
                          "Cannot save an empty graph or storage is unavailable.",
                        ),
                      );
                    }
                  }}
                >
                  <Save size={14} />
                  {t("Lưu", "Save")}
                </button>
                <button
                  title={t("Khôi phục bản lưu", "Restore saved graph")}
                  onClick={() => {
                    try {
                      const raw = localStorage.getItem(SAVED);
                      if (!raw) throw Error();
                      load(JSON.parse(raw));
                      setToast(t("Đã khôi phục.", "Restored."));
                    } catch {
                      setToast(
                        t("Chưa có bản lưu hợp lệ.", "No valid saved graph."),
                      );
                    }
                  }}
                >
                  <FolderOpen size={14} />
                  {t("Khôi phục", "Restore")}
                </button>
              </div>
              <button
                className="text-button danger"
                onClick={() => setModal("deleteData")}
              >
                {t("Xóa dữ liệu đã lưu", "Delete saved data")}
              </button>
            </details>
            <div className="sidebar-tip">
              <Sparkles size={17} />
              <p>
                {t(
                  "Không chỉ xem. Hãy thử, dự đoán và hiểu.",
                  "Don’t just watch. Experiment, predict, understand.",
                )}
              </p>
            </div>
          </Sidebar>
          <div className="center-column">
            <div className="canvas-card">
              <div className="canvas-heading">
                <div>
                  <span className="graph-status" />
                  <b title={name}>{name}</b>
                  <small>
                    {graph.nodes.length} {t("đỉnh", "nodes")} ·{" "}
                    {graph.edges.length} {t("cạnh", "edges")}
                  </small>
                </div>
                <span className="badge">
                  {algorithm} <ArrowRight size={12} /> {start || "—"}
                </span>
              </div>
              <div className="view-tabs">
                {[
                  ["graph", t("Đồ thị", "Graph")],
                  ["tree", `${algorithm} Tree`],
                  ["list", t("Danh sách kề", "Adjacency list")],
                  ["matrix", t("Ma trận kề", "Matrix")],
                  ["report", t("Bảng bước", "Steps")],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    className={view === id ? "active" : ""}
                    onClick={() => setView(id)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="canvas-body">
                {view === "graph" || view === "tree" ? (
                  <>
                    <GraphCanvas
                      graph={graph}
                      step={player.step}
                      directed={directed}
                      showTypes={showTypes && algorithm === "DFS"}
                      treeOnly={view === "tree"}
                      mode={player.question ? "select" : mode}
                      onChange={change}
                      onPick={pick}
                      onBlank={addNode}
                      vi={vi}
                    />
                    <div className="canvas-note">
                      <Info size={13} />
                      {view === "tree"
                        ? t(
                            "Cây duyệt xuất hiện theo từng bước",
                            "Traversal tree grows with each step",
                          )
                        : mode === "edge"
                          ? t(
                              source
                                ? `Chọn đỉnh đích cho ${source}`
                                : "Chọn hai đỉnh để nối cạnh",
                              source
                                ? `Choose a target for ${source}`
                                : "Choose two nodes to connect",
                            )
                          : mode === "node"
                            ? t(
                                "Nhấn vùng trống để thêm đỉnh",
                                "Click empty space to add a node",
                              )
                            : t(
                                "Kéo để sắp xếp · Cuộn để thu phóng",
                                "Drag to arrange · Scroll to zoom",
                              )}
                    </div>
                    <div className="legend">
                      {[
                        ["unvisited", t("Chưa thăm", "Unvisited")],
                        ["current", t("Hiện tại", "Current")],
                        ["visited", t("Đã thăm", "Visited")],
                        ["completed", t("Hoàn tất", "Completed")],
                      ].map(([id, label]) => (
                        <span key={id}>
                          <i className={id} />
                          {label}
                        </span>
                      ))}
                    </div>
                    {showTypes && algorithm === "DFS" && (
                      <div className="edge-legend">
                        <span>🟣 Tree</span>
                        <span>🔴 Back</span>
                        <span>🔵 Forward</span>
                        <span>🟠 Cross</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="data-view">
                    {view === "list" ? (
                      <AdjacencyList list={list} />
                    ) : view === "matrix" ? (
                      <AdjacencyMatrix list={list} />
                    ) : (
                      <DFSStepsTable
                        steps={steps.slice(0, player.index + 1)}
                        vi={vi}
                      />
                    )}
                  </div>
                )}
              </div>
              <TraversalOrder order={player.step.order} vi={vi} />
            </div>
            {player.question && (
              <div className="question" role="status">
                <GraduationCap size={20} />
                <span>
                  {t(
                    `${algorithm} sẽ thăm đỉnh nào tiếp theo? Nhấn vào đỉnh để trả lời.`,
                    `Which node will ${algorithm} visit next? Click a node to answer.`,
                  )}
                </span>
              </div>
            )}
            <AlgorithmControls
              {...player}
              total={steps.length}
              vi={vi}
              next={() => {
                player.pause();
                player.next();
              }}
              disabled={!graph.nodes.length || !!player.question}
            />
            <div className="bottom-note">
              <span>
                <span className="purple-dot" />
                {t("Học bằng cách khám phá", "Learn by exploring")}
              </span>
              <span>
                <kbd>Space</kbd> {t("Chạy / Dừng", "Play / Pause")} <kbd>←</kbd>
                <kbd>→</kbd> {t("Từng bước", "Step")}
              </span>
            </div>
          </div>
          <AlgorithmPanel
            algorithm={algorithm}
            steps={steps}
            index={player.index}
            vi={vi}
            onPython={() => setModal("python")}
          />
        </div>
      </main>
      <footer>
        GRAPH VISUALIZER
        <span>
          {t(
            "Một đồ thị. Nhiều cách khám phá.",
            "One graph. Many ways to explore.",
          )}
        </span>
        <span>DFS / BFS · O(V + E)</span>
      </footer>
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (f)
            try {
              if (f.size > 1_000_000) throw Error();
              load(JSON.parse(await f.text()));
              setToast(t("Đã nhập đồ thị.", "Graph imported."));
            } catch {
              setToast(
                t(
                  "JSON không hợp lệ. Tối đa 30 đỉnh, mỗi tên dài 1–40 ký tự.",
                  "Invalid JSON. Maximum 30 nodes, names must be 1–40 characters.",
                ),
              );
            }
          e.target.value = "";
        }}
      />
      {toast && (
        <div className="toast" role="status">
          <Info size={17} />
          {toast}
          <button title="Close" onClick={() => setToast("")}>
            <X size={14} />
          </button>
        </div>
      )}
      {modal && (
        <div className="modal-backdrop" onClick={() => setModal("")}>
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              autoFocus
              title={t("Đóng", "Close")}
              onClick={() => setModal("")}
            >
              <X size={20} />
            </button>
            <div className="eyebrow">GRAPH VISUALIZER</div>
            <h2 id="modal-title">
              {modal === "python"
                ? t("Mã Python của đồ thị", "Your graph in Python")
                : modal === "input"
                  ? t("Tạo từ dữ liệu", "Build from data")
                  : modal === "clear" || modal === "deleteData"
                    ? t("Xác nhận xóa", "Confirm deletion")
                    : modal === "learn"
                      ? t(
                          "Hai cách khám phá đồ thị",
                          "Two ways to explore a graph",
                        )
                      : t("Bắt đầu trong một phút", "Start in one minute")}
            </h2>
            {modal === "python" ? (
              <>
                <pre className="python">{python}</pre>
                <button
                  className="primary"
                  onClick={() =>
                    download(
                      `${algorithm.toLowerCase()}.py`,
                      python,
                      "text/x-python",
                    )
                  }
                >
                  <Download size={16} />
                  {t("Tải xuống Python", "Download Python")}
                </button>
              </>
            ) : modal === "input" ? (
              <>
                <select
                  value={inputType}
                  onChange={(e) => setInputType(e.target.value)}
                >
                  <option value="edges">Edge List · A B</option>
                  <option value="adjacency">Adjacency List · A: B, C</option>
                </select>
                <textarea
                  rows={8}
                  aria-label="Graph input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <p>
                  {t(
                    "Mỗi dòng một cạnh hoặc một danh sách kề. Tối đa 30 đỉnh; nhãn gồm chữ, số, dấu gạch dưới (1–8 ký tự). Import JSON hỗ trợ tên có khoảng trắng.",
                    "One edge or adjacency entry per line. Up to 30 nodes; labels use letters, digits, underscores (1–8 characters). JSON import supports names with spaces.",
                  )}
                </p>
                <button
                  className="primary"
                  onClick={() => {
                    try {
                      const g = parseGraph(
                        input,
                        inputType === "adjacency",
                        directed,
                      );
                      change(g);
                      setStart(g.nodes[0].id);
                      setModal("");
                    } catch {
                      setToast(
                        t(
                          "Dữ liệu không hợp lệ. Kiểm tra định dạng và số đỉnh.",
                          "Invalid input. Check the format and node count.",
                        ),
                      );
                    }
                  }}
                >
                  {t("Tạo đồ thị", "Build graph")}
                  <ArrowRight size={16} />
                </button>
              </>
            ) : modal === "clear" || modal === "deleteData" ? (
              <>
                <p>
                  {modal === "clear"
                    ? t(
                        "Xóa toàn bộ đỉnh và cạnh khỏi canvas hiện tại?",
                        "Remove all nodes and edges from this canvas?",
                      )
                    : t(
                        "Xóa bản lưu và đồ thị hiện tại khỏi trình duyệt?",
                        "Delete the saved copy and current graph from this browser?",
                      )}
                </p>
                <button
                  className="primary"
                  onClick={() => {
                    if (modal === "deleteData")
                      try {
                        localStorage.removeItem(SAVED);
                        localStorage.removeItem(STORAGE);
                      } catch {
                        setToast(
                          t(
                            "Không thể truy cập bộ nhớ trình duyệt.",
                            "Browser storage is unavailable.",
                          ),
                        );
                      }
                    change({ nodes: [], edges: [] });
                    setModal("");
                  }}
                >
                  {t("Xóa", "Delete")}
                </button>
              </>
            ) : modal === "help" ? (
              <UsageGuide vi={vi} />
            ) : (
              <div className="learning-copy">
                <h3>01 · {t("Chọn và khám phá", "Choose and explore")}</h3>
                <p>
                  {t(
                    "Chọn DFS hoặc BFS, chọn đỉnh bắt đầu rồi nhấn Play. Các đỉnh kề được xét theo A → Z (có thể đảo chiều trong tùy chọn nâng cao). Chỉ các đỉnh có thể đi tới từ đỉnh bắt đầu được duyệt.",
                    "Choose DFS or BFS, a start vertex, and press Play. Neighbors are ordered A → Z (change this in advanced options). Only nodes reachable from the start are traversed.",
                  )}
                </p>
                <h3>
                  DFS · {t("Đi sâu, rồi quay lui", "Go deep, then backtrack")}
                </h3>
                <p>
                  {t(
                    "DFS dùng stack để ghi nhớ đường đi. Khi hết đỉnh kề chưa thăm, nó lấy đỉnh khỏi stack và quay lui. Cạnh ngược chỉ ra chu trình. Với đồ thị vô hướng, cạnh về cha không phải cạnh ngược.",
                    "DFS uses a call stack to remember its path. When no unvisited neighbor remains, it pops the node and backtracks. A back edge indicates a cycle. In undirected graphs, the parent edge is skipped.",
                  )}
                </p>
                <h3>
                  BFS · {t("Khám phá theo từng tầng", "Explore level by level")}
                </h3>
                <p>
                  {t(
                    "BFS dùng queue: đỉnh được thêm trước sẽ được thăm trước. L0 là đỉnh bắt đầu; L1 là các đỉnh cách một cạnh. Màu xanh dương là đã phát hiện, xanh lá là xử lý xong.",
                    "BFS uses a queue: first in, first out. L0 is the start; L1 contains nodes one edge away. Blue means discovered; green means fully processed.",
                  )}
                </p>
                <h3>
                  {t("Thử nghiệm với đồ thị", "Experiment with your graph")}
                </h3>
                <p>
                  {t(
                    "Thêm đỉnh bằng cách chọn công cụ + rồi nhấn canvas. Thêm cạnh bằng cách chọn hai đỉnh hoặc kéo các chấm kết nối. Chọn đỉnh/cạnh rồi Delete để xóa. Chỉnh sửa đồ thị sẽ đặt lại tiến trình.",
                    "Select + and click the canvas to add a node. Connect two nodes with the edge tool or drag between handles. Select a node/edge and press Delete to remove it. Editing resets playback.",
                  )}
                </p>
                <p>
                  <kbd>Space</kbd> Play / Pause · <kbd>←</kbd> Previous ·{" "}
                  <kbd>→</kbd> Next · <kbd>R</kbd> Reset
                </p>
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
}
