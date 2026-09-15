import { Network, Sun, Moon, BookOpen, Github, HelpCircle } from "lucide-react";
export function Header({
  vi,
  dark,
  setVi,
  setDark,
  onHelp,
  onLearn,
}: {
  vi: boolean;
  dark: boolean;
  setVi: (v: boolean) => void;
  setDark: (v: boolean) => void;
  onHelp: () => void;
  onLearn: () => void;
}) {
  return (
    <header>
      <a className="brand" href="#">
        <span className="brand-icon">
          <Network size={22} />
        </span>
        Graph<span className="brand-light">Visualizer</span>
      </a>
      <nav>
        <button className="nav-active">
          {vi ? "Trực quan hóa" : "Visualizer"}
        </button>
        <button onClick={onLearn}>
          <BookOpen size={15} />
          {vi ? "Kiến thức" : "Learn"}
        </button>
      </nav>
      <div className="header-actions">
        <button
          className="language"
          onClick={() => setVi(!vi)}
          title="Language"
        >
          <b>{vi ? "VI" : "EN"}</b>
          <span> / {vi ? "EN" : "VI"}</span>
        </button>
        <button
          onClick={() => setDark(!dark)}
          title={vi ? "Đổi giao diện" : "Toggle theme"}
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button className="help-button" onClick={onHelp} title={vi ? "Hướng dẫn sử dụng" : "User guide"} aria-label={vi ? "Hướng dẫn sử dụng" : "User guide"}>
          <HelpCircle size={18} />
          <span>{vi ? "Hướng dẫn" : "Guide"}</span>
        </button>
        <a
          href="https://github.com/topics/graph-traversal"
          target="_blank"
          rel="noreferrer"
          title="GitHub · Graph traversal"
        >
          <Github size={18} />
        </a>
      </div>
    </header>
  );
}
