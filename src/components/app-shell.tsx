import { Link } from "@tanstack/react-router";
import { BarChart3, Database, LayoutDashboard, Lightbulb, Menu, Users, X } from "lucide-react";
import { useState, type ReactNode } from "react";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/graduates", label: "Graduate Explorer", icon: Users },
  { to: "/insights", label: "Insights", icon: Lightbulb },
  { to: "/data", label: "Data Management", icon: Database },
] as const;

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-primary/15 text-sidebar-primary ring-1 ring-sidebar-primary/30">
          <BarChart3 className="h-5 w-5" />
        </div>
        <div>
          <p className="font-display text-base font-bold tracking-tight text-sidebar-accent-foreground">
            CareerPulse
          </p>
          <p className="text-[11px] uppercase tracking-[0.14em] text-sidebar-foreground/60">
            Outcomes Analytics
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {NAV.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            activeOptions={{ exact: to === "/" }}
            className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[status=active]:bg-sidebar-accent data-[status=active]:text-sidebar-accent-foreground data-[status=active]:shadow-sm"
          >
            <Icon className="h-4.5 w-4.5 shrink-0 opacity-80 group-data-[status=active]:text-sidebar-primary group-data-[status=active]:opacity-100" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="mx-3 mb-4 rounded-xl border border-sidebar-border bg-sidebar-accent/40 px-4 py-3">
        <p className="font-display text-sm font-semibold text-sidebar-accent-foreground">
          SIH26135
        </p>
        <p className="text-xs text-sidebar-foreground/65">Employment Outcomes</p>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-sidebar-border lg:block">
        <SidebarContent />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-64 shadow-hover">
            <button
              aria-label="Close navigation"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-5 rounded-md p-1.5 text-sidebar-foreground/70 hover:bg-sidebar-accent"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarContent onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-3 lg:hidden">
          <button
            aria-label="Open navigation"
            onClick={() => setOpen(true)}
            className="rounded-md border border-border p-2 text-foreground transition-colors hover:bg-muted"
          >
            <Menu className="h-4 w-4" />
          </button>
          <span className="font-display text-sm font-bold">CareerPulse</span>
        </div>
        <main className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  meta,
}: {
  title: string;
  subtitle: string;
  meta?: ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-col gap-3 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground sm:text-[28px]">
          {title}
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {meta ? <div className="shrink-0">{meta}</div> : null}
    </header>
  );
}
