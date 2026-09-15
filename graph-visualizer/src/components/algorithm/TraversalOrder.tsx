import { motion } from "framer-motion";
export function TraversalOrder({
  order,
  vi,
}: {
  order: string[];
  vi: boolean;
}) {
  return (
    <div className="traversal">
      <span>{vi ? "THỨ TỰ DUYỆT" : "TRAVERSAL ORDER"}</span>
      <div>
        {order.length ? (
          order.map((v, i) => (
            <motion.span
              className="order-item"
              key={v}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {i > 0 && <small>→</small>}
              <b title={v}>{v}</b>
            </motion.span>
          ))
        ) : (
          <em>
            {vi
              ? "Hành trình của bạn bắt đầu tại đây"
              : "Your journey starts here"}
          </em>
        )}
      </div>
    </div>
  );
}
