import { AnimatePresence, motion } from "framer-motion";
export function StackVisualizer({
  items,
  vi,
}: {
  items: string[];
  vi: boolean;
}) {
  return (
    <div className="stack">
      <span className="micro">TOP ↓</span>
      <AnimatePresence mode="popLayout">
        {[...items].reverse().map((v) => (
          <motion.div
            layout
            key={v}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
          >
            {v}
          </motion.div>
        ))}
      </AnimatePresence>
      {!items.length && <p>{vi ? "Stack đang trống" : "The stack is empty"}</p>}
      <small>{vi ? "Vào sau · Ra trước" : "Last in · First out"}</small>
    </div>
  );
}
