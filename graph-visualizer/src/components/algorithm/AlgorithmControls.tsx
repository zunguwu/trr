import {
  SkipBack,
  ChevronLeft,
  Play,
  Pause,
  ChevronRight,
  SkipForward,
} from "lucide-react";
type Props = {
  index: number;
  total: number;
  playing: boolean;
  speed: number;
  vi: boolean;
  reset: () => void;
  previous: () => void;
  toggle: () => void;
  next: () => void;
  finish: () => void;
  setSpeed: (n: number) => void;
  disabled: boolean;
};
export function AlgorithmControls(p: Props) {
  return (
    <div className="playback">
      <div className="transport">
        <button title={p.vi ? "Đặt lại (R)" : "Reset (R)"} onClick={p.reset}>
          <SkipBack size={17} />
        </button>
        <button
          disabled={!p.index}
          title={p.vi ? "Bước trước (←)" : "Previous (←)"}
          onClick={p.previous}
        >
          <ChevronLeft size={20} />
        </button>
        <button
          className="play"
          disabled={p.disabled}
          title={p.vi ? "Chạy / Dừng (Space)" : "Play / Pause (Space)"}
          onClick={p.toggle}
        >
          {p.playing ? (
            <Pause size={20} />
          ) : (
            <Play size={20} fill="currentColor" />
          )}
        </button>
        <button
          disabled={p.disabled || p.index === p.total - 1}
          title={p.vi ? "Bước tiếp (→)" : "Next (→)"}
          onClick={p.next}
        >
          <ChevronRight size={20} />
        </button>
        <button
          disabled={p.disabled || p.index === p.total - 1}
          title={p.vi ? "Hoàn tất" : "Finish"}
          onClick={p.finish}
        >
          <SkipForward size={17} />
        </button>
      </div>
      <span className="separator" />
      <label className="speed">
        {p.vi ? "Tốc độ" : "Speed"}{" "}
        <select
          value={p.speed}
          onChange={(e) => p.setSpeed(Number(e.target.value))}
        >
          {[0.5, 1, 1.5, 2].map((n) => (
            <option key={n} value={n}>
              {n}×
            </option>
          ))}
        </select>
      </label>
      <span className="step-counter">
        {p.vi ? "Bước" : "Step"} <b>{p.index}</b> / {p.total - 1}
      </span>
      <div className="progress">
        <i
          style={{
            width: `${p.total > 1 ? (p.index / (p.total - 1)) * 100 : 0}%`,
          }}
        />
      </div>
    </div>
  );
}
