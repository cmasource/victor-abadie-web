import type { ReactNode } from "react";

export type AdminBadgeTone = "positive" | "muted" | "soft" | "neutral" | "warning";

type AdminBadgeProps = {
  children: ReactNode;
  tone: AdminBadgeTone;
};

export function AdminBadge({ children, tone }: AdminBadgeProps) {
  const classes = {
    positive: "bg-brand/12 text-brand-dark ring-brand/20",
    muted: "bg-surface text-muted ring-black/5",
    soft: "bg-[#111111] text-white ring-black/5",
    neutral: "bg-white text-[#111111] ring-black/10",
    warning: "bg-amber-50 text-amber-800 ring-amber-200",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${classes[tone]}`}>
      {children}
    </span>
  );
}

export function statusTone(status: string): AdminBadgeTone {
  if (status === "Disponible") {
    return "positive";
  }

  if (
    ["Reservado", "Reservada", "Vendido", "Vendida", "Alquilado", "Alquilada"].includes(
      status,
    )
  ) {
    return "warning";
  }

  return "muted";
}
