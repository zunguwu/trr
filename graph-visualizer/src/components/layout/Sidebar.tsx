import type { ReactNode } from "react";
export function Sidebar({
  children,
  open,
}: {
  children: ReactNode;
  open: boolean;
}) {
  return (
    <aside className={`sidebar ${open ? "mobile-open" : ""}`}>{children}</aside>
  );
}
