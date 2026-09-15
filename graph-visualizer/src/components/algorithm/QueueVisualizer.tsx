import { AnimatePresence, motion } from "framer-motion";
export function QueueVisualizer({
  items,
  vi,
}: {
  items: string[];
  vi: boolean;
}) {
  return (
    <>
      <div className="queue-labels">
        <span>FRONT →</span>
        <span>← REAR</span>
      </div>
      <div className="queue">
        <AnimatePresence>
          {items.map((v) => (
            <motion.b
              layout
              key={v}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {v}
            </motion.b>
          ))}
        </AnimatePresence>
        {!items.length && (
          <p>{vi ? "Hàng đợi đang trống" : "The queue is empty"}</p>
        )}
      </div>
      <small className="muted">
        {vi ? "Vào trước · Ra trước" : "First in · First out"}
      </small>
    </>
  );
}
