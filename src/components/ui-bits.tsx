import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { EmploymentStatus } from "@/data/graduates";

export function KpiCard({
  label,
  value,
  support,
  icon: Icon,
  tone = "primary",
}: {
  label: string;
  value: string;
  support: string;
  icon: LucideIcon;
  tone?: "primary" | "success" | "warning" | "accent";
}) {
  const tones: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/15 text-warning",
    accent: "bg-chart-6/10 text-chart-6",
  };
  return (
    <div className="card-surface card-interactive p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {label}
        </p>
        <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${tones[tone]}`}>
          <Icon className="h-4.5 w-4.5" />
        </span>
      </div>
      <p className="num mt-4 font-display text-[26px] font-bold leading-none text-foreground">
        {value}
      </p>
      <p className="mt-2 text-xs text-muted-foreground">{support}</p>
    </div>
  );
}

export function ChartCard({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`card-surface flex flex-col p-5 ${className}`}>
      <div className="mb-4">
        <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="flex-1">{children}</div>
    </section>
  );
}

export function StatusBadge({ status }: { status: EmploymentStatus }) {
  const map: Record<EmploymentStatus, string> = {
    Employed: "bg-success/12 text-success ring-success/25",
    "Higher Studies": "bg-primary/10 text-primary ring-primary/25",
    "Self Employed": "bg-chart-6/12 text-chart-6 ring-chart-6/25",
    Unemployed: "bg-destructive/10 text-destructive ring-destructive/25",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${map[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
      {children}
    </span>
  );
}

export function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex min-w-0 flex-1 flex-col gap-1.5 sm:min-w-[160px]">
      <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full cursor-pointer rounded-lg border border-input bg-card px-3 text-sm font-medium text-foreground shadow-sm outline-none transition-colors hover:border-ring focus:border-ring focus:ring-2 focus:ring-ring/25"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 px-6 py-14 text-center">
      <p className="font-display text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

export const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
];

export const tooltipStyle = {
  backgroundColor: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "10px",
  fontSize: "12px",
  boxShadow: "var(--shadow-card)",
  color: "var(--foreground)",
} as const;
