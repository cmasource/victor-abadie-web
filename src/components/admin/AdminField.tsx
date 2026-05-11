import type { ReactNode } from "react";

type AdminFieldProps = {
  label: string;
  children: ReactNode;
  className?: string;
};

export function AdminField({ label, children, className = "" }: AdminFieldProps) {
  return (
    <label className={`grid min-w-0 gap-2 text-sm font-semibold text-[#111111] ${className}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}

export const adminInputClassName =
  "min-h-12 w-full min-w-0 rounded-md border border-black/10 bg-white px-4 py-3 text-sm text-[#111111] outline-none transition placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/15";
