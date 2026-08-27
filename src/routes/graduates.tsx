import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, Search, X } from "lucide-react";

import { AppShell, PageHeader } from "@/components/app-shell";
import {
  EmptyState,
  FilterSelect,
  Pill,
  StatusBadge,
} from "@/components/ui-bits";
import { applyFilters, EMPTY_FILTERS, type Filters } from "@/data/analytics";
import {
  DEPARTMENTS,
  GRADUATES,
  INDUSTRIES,
  STATUSES,
  YEARS,
  type Graduate,
} from "@/data/graduates";

export const Route = createFileRoute("/graduates")({
  head: () => ({
    meta: [
      { title: "Graduate Explorer | CareerPulse" },
      {
        name: "description",
        content:
          "Search, filter and inspect individual graduate employment records — department, company, salary, and degree relevance.",
      },
      { property: "og:title", content: "Graduate Explorer | CareerPulse" },
      {
        property: "og:description",
        content:
          "Search, filter and inspect individual graduate employment outcome records.",
      },
    ],
  }),
  component: GraduatesPage,
});

const opt = (v: readonly (string | number)[], allLabel: string) => [
  { value: "all", label: allLabel },
  ...v.map((x) => ({ value: String(x), label: String(x) })),
];

function GraduatesPage() {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Graduate | null>(null);

  const rows = useMemo(() => {
    const base = applyFilters(GRADUATES, filters);
    const q = query.trim().toLowerCase();
    if (!q) return base;
    return base.filter((g) =>
      [g.name, g.department, g.company ?? "", g.role ?? "", g.location ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [filters, query]);

  const set = (k: keyof Filters) => (v: string) =>
    setFilters((f) => ({ ...f, [k]: v }));

  const exportCsv = () => {
    const head = [
      "Name",
      "Department",
      "Year",
      "CGPA",
      "Internship",
      "Status",
      "Company",
      "Role",
      "Industry",
      "Location",
      "Salary (LPA)",
      "Time to employment (months)",
      "Degree relevance",
    ];
    const body = rows.map((g) =>
      [
        g.name,
        g.department,
        g.graduationYear,
        g.cgpa,
        g.internship ? "Yes" : "No",
        g.employmentStatus,
        g.company ?? "",
        g.role ?? "",
        g.industry ?? "",
        g.location ?? "",
        g.salary ?? "",
        g.timeToEmployment ?? "",
        g.degreeRelevance,
      ]
        .map((c) => `"${String(c).replace(/"/g, '""')}"`)
        .join(","),
    );
    const blob = new Blob([[head.join(","), ...body].join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "careerpulse-graduates.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppShell>
      <PageHeader
        title="Graduate Explorer"
        subtitle="Browse individual outcome records. Filter by cohort, department, status or industry, then open a record for the full profile."
        meta={<Pill>{rows.length} of {GRADUATES.length} records</Pill>}
      />

      <div className="card-surface mb-6 p-5">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, company, role or location…"
              className="h-10 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground hover:border-ring focus:border-ring focus:ring-2 focus:ring-ring/25"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <FilterSelect label="Year" value={filters.year} onChange={set("year")} options={opt(YEARS, "All years")} />
            <FilterSelect label="Department" value={filters.department} onChange={set("department")} options={opt(DEPARTMENTS, "All departments")} />
            <FilterSelect label="Status" value={filters.status} onChange={set("status")} options={opt(STATUSES, "All statuses")} />
            <FilterSelect label="Industry" value={filters.industry} onChange={set("industry")} options={opt(INDUSTRIES, "All industries")} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setFilters(EMPTY_FILTERS);
                setQuery("");
              }}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" /> Reset filters
            </button>
            <button
              onClick={exportCsv}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Download className="h-3.5 w-3.5" /> Export CSV
            </button>
          </div>
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title="No graduates match these filters"
          hint="Try clearing the search box or resetting one of the filters above."
        />
      ) : (
        <div className="card-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                  <th className="px-4 py-3 font-semibold">Graduate</th>
                  <th className="px-4 py-3 font-semibold">Department</th>
                  <th className="px-4 py-3 font-semibold">Year</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Company / Path</th>
                  <th className="px-4 py-3 text-right font-semibold">Salary</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((g) => (
                  <tr
                    key={g.id}
                    onClick={() => setSelected(g)}
                    className="cursor-pointer border-b border-border/70 transition-colors last:border-0 hover:bg-muted/50"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{g.name}</p>
                      <p className="text-xs text-muted-foreground">CGPA {g.cgpa.toFixed(2)}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{g.department}</td>
                    <td className="num px-4 py-3 text-muted-foreground">{g.graduationYear}</td>
                    <td className="px-4 py-3"><StatusBadge status={g.employmentStatus} /></td>
                    <td className="px-4 py-3">
                      <p className="text-foreground">{g.company ?? g.higherStudies ?? "—"}</p>
                      <p className="text-xs text-muted-foreground">{g.role ?? g.location ?? "—"}</p>
                    </td>
                    <td className="num px-4 py-3 text-right font-semibold text-foreground">
                      {g.salary !== null ? `₹${g.salary.toFixed(1)} L` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && <GraduateModal graduate={selected} onClose={() => setSelected(null)} />}
    </AppShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/40 px-3 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function GraduateModal({ graduate: g, onClose }: { graduate: Graduate; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-foreground/45 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${g.name} profile`}
        className="relative max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-border bg-card p-6 shadow-hover sm:rounded-2xl"
      >
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {g.department} · Class of {g.graduationYear}
        </p>
        <h2 className="mt-1 font-display text-xl font-bold text-foreground">{g.name}</h2>
        <div className="mt-3">
          <StatusBadge status={g.employmentStatus} />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Field label="CGPA" value={g.cgpa.toFixed(2)} />
          <Field label="Internship" value={g.internship ? "Completed" : "None"} />
          <Field label="Company" value={g.company ?? g.higherStudies ?? "—"} />
          <Field label="Role" value={g.role ?? "—"} />
          <Field label="Industry" value={g.industry ?? "—"} />
          <Field label="Location" value={g.location ?? "—"} />
          <Field label="Salary" value={g.salary !== null ? `₹${g.salary.toFixed(1)} LPA` : "—"} />
          <Field
            label="Time to employment"
            value={g.timeToEmployment !== null ? `${g.timeToEmployment} months` : "—"}
          />
          <Field label="Degree relevance" value={g.degreeRelevance} />
          <Field label="Higher studies" value={g.higherStudies ?? "—"} />
        </div>
      </div>
    </div>
  );
}
