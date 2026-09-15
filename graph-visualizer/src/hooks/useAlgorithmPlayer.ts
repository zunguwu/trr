import { useEffect, useState, useCallback } from "react";
import type { Step } from "../types/graph";
export function useAlgorithmPlayer(
  steps: Step[],
  learning: boolean,
  blocked = false,
) {
  const [index, setIndex] = useState(0),
    [playing, setPlaying] = useState(false),
    [speed, setSpeed] = useState(1),
    [question, setQuestion] = useState<string | null>(null);
  const reset = useCallback(() => {
    setIndex(0);
    setPlaying(false);
    setQuestion(null);
  }, []);
  useEffect(() => {
    reset();
  }, [steps, reset]);
  const next = useCallback(() => {
    if (index >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    const target = steps[index + 1].discover;
    if (learning && target) {
      setQuestion(target);
      setPlaying(false);
    } else setIndex((i) => Math.min(i + 1, steps.length - 1));
  }, [index, steps, learning]);
  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(next, 900 / speed);
    return () => clearTimeout(timer);
  }, [playing, next, speed]);
  const toggle = useCallback(() => {
    if (!question) {
      if (index >= steps.length - 1) setIndex(0);
      setPlaying((p) => !p);
    }
  }, [index, steps.length, question]);
  const previous = useCallback(() => {
    setPlaying(false);
    setQuestion(null);
    setIndex((i) => Math.max(0, i - 1));
  }, []);
  const finish = () => {
    setPlaying(false);
    setQuestion(null);
    setIndex(steps.length - 1);
  };
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (
        blocked ||
        (e.target as HTMLElement).closest(
          'input,textarea,select,button,[contenteditable="true"]',
        )
      )
        return;
      if (e.code === "Space") {
        e.preventDefault();
        toggle();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setPlaying(false);
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        previous();
      } else if (e.key.toLowerCase() === "r") reset();
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [next, previous, reset, toggle, blocked]);
  return {
    index,
    step: steps[Math.min(index, steps.length - 1)],
    playing,
    speed,
    setSpeed,
    question,
    reset,
    next,
    previous,
    finish,
    toggle,
    pause: () => setPlaying(false),
    answer: (id: string) => {
      if (id !== question) return false;
      setQuestion(null);
      setIndex((i) => Math.min(i + 1, steps.length - 1));
      return true;
    },
  };
}
