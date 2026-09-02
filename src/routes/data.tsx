import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Database,
  Download,
  FileSpreadsheet,
  RotateCcw,
  Timer,
  TrendingUp,
  Upload,
  Users,
} from "lucide-react";

import { AppShell, PageHeader } from "@/components/app-shell";
import { EmptyState, KpiCard, Pill, StatusBadge } from "@/components/ui-bits";
import { departmentRates, kpis } from "@/data/analytics";
import {
  resetToDemoDataset,
  setUploadedDataset,
  useDataset,
} from "@/data/dataset-store";
import type { Graduate } from "@/data/graduates";
import { CSV_COLUMNS, CSV_TEMPLATE_HEADER, parseGraduateCsv, type CsvResult } from "@/lib/csv";

export const Route = createFileRoute("/data")({
  head: () => ({
    meta: [
      { title: "Data Management & CSV Import | CareerPulse" },
      {
        name: "description",
        content:
          "Upload a graduate outcomes CSV, validate its columns, preview the records and switch the CareerPulse dashboard between demo and uploaded data.",
      },
      { property: "og:title", content: "Data Management | CareerPulse" },
      {
        property: "og:description",
        content:
          "Import, validate and analyse graduate employment CSV data — entirely in the browser.",
      },
    ],
  }),
  component: DataPage,
});

function DataPage() {
  const dataset = useDataset();
  const inputRef = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState<CsvResult | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [applied, setApplied] = useState(false);

  const active = dataset.rows;
  const k = useMemo(() => kpis(active), [active]);
  const deptCount = useMemo(() => departmentRates(active).length, [active]);
  const preview: Graduate[] = useMemo(
    () => (result?.rows ?? active).slice(0, 10),
    [result, active],
  );

  const handleFile = async (file: File) => {
    setFileName(file.name);
    setApplied(false);
    const text = await file.text();
    setResult(parseGraduateCsv(text));
  };

  const applyDataset = () => {
    if (!result?.ok) return;
    setUploadedDataset(result.rows, fileName ?? "Uploaded dataset");
    setApplied(true);
  };

  const useDemo = () => {
    resetToDemoDataset();
    setResult(null);
    setFileName(null);
    setApplied(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const downloadTemplate = () => {
    const sample =
      `${CSV_TEMPLATE_HEADER}\n` +
      "CP-2024-001,Aarav Sharma,Computer Science,2024,8.42,Yes,Employed,Infosys,Software Engineer,Information Technology,Bengaluru,7.5,2,High,\n" +
      "CP-2024-002,Diya Nair,Mechanical,2024,7.10,No,Unemployed,,,,,,,,\n" +
      "CP-2024-003,Rohan Iyer,AI & ML,2024,9.05,Yes,Higher Studies,,,,,,,,M.Tech - IIT Madras\n";
    const url = URL.createObjectURL(new Blob([sample], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "careerpulse-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppShell>
      <PageHeader
        title="Data Management"
        subtitle="Import your own graduate outcomes CSV, validate it, and power the dashboard, explorer and insights with it — everything is processed locally in the browser."
        meta={
          <div className="flex flex-wrap items-center gap-2">
            <Pill>
              Active source: {dataset.source === "demo" ? "Demo Dataset" : "Uploaded Dataset"}
            </Pill>
            <Pill>{active.length} records</Pill>
            {dataset.updatedAt ? (
              <Pill>Imported {new Date(dataset.updatedAt).toLocaleString()}</Pill>
            ) : null}
          </div>
        }
      />

      {/* Active dataset summary */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard label="Total Records" value={String(k.total)} support={dataset.label} icon={Users} />
        <KpiCard
          label="Employment Rate"
          value={`${k.employmentRate.toFixed(1)}%`}
          support={`${k.employedCount} placed graduates`}
          icon={TrendingUp}
          tone="success"
        />
        <KpiCard
          label="Average Salary"
          value={`₹${k.avgSalary.toFixed(1)} LPA`}
          support="Across records with salary data"
          icon={Database}
          tone="accent"
        />
        <KpiCard
          label="Avg. Time to Employment"
          value={`${k.avgTimeToEmployment.toFixed(1)} mo`}
          support="From graduation to first offer"
          icon={Timer}
          tone="warning"
        />
        <KpiCard
          label="Departments"
          value={String(deptCount)}
          support="Distinct departments detected"
          icon={Building2}
        />
      </div>

      {/* Upload */}
      <section className="card-surface mt-6 p-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-base font-semibold text-foreground">Upload CSV</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Columns are matched by name. Required: Student ID, Name, Department, Graduation Year,
              Employment Status.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={downloadTemplate}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Download className="h-3.5 w-3.5" /> Template
            </button>
            <button
              onClick={useDemo}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Use Demo Dataset
            </button>
          </div>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) void handleFile(file);
          }}
          className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
            dragging ? "border-primary bg-primary/5" : "border-border bg-muted/40"
          }`}
        >
          <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Upload className="h-5 w-5" />
          </span>
          <p className="font-display text-sm font-semibold text-foreground">
            Drop your CSV here, or choose a file
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Processed entirely in your browser — nothing is uploaded to a server.
          </p>
          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
            }}
          />
          <button
            onClick={() => inputRef.current?.click()}
            className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" /> Choose CSV file
          </button>
          {fileName ? (
            <p className="mt-3 text-xs font-medium text-muted-foreground">Selected: {fileName}</p>
          ) : null}
        </div>
      </section>

      {/* Validation */}
      {result ? (
        <section className="card-surface mt-6 p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${
                  result.ok
                    ? "bg-success/12 text-success ring-success/25"
                    : "bg-destructive/10 text-destructive ring-destructive/25"
                }`}
              >
                {result.ok ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <AlertTriangle className="h-3.5 w-3.5" />
                )}
                {result.ok ? "Validation passed" : "Validation failed"}
              </span>
              <Pill>{result.totalRows} rows read</Pill>
              <Pill>{result.rows.length} valid</Pill>
              {result.skippedRows ? <Pill>{result.skippedRows} skipped</Pill> : null}
              <Pill>{result.matchedColumns.length}/{CSV_COLUMNS.length} columns matched</Pill>
            </div>
            <button
              onClick={applyDataset}
              disabled={!result.ok}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Database className="h-3.5 w-3.5" />
              {applied ? "Dataset applied" : "Analyze & use this dataset"}
            </button>
          </div>

          {applied ? (
            <p className="mb-4 rounded-lg border border-success/25 bg-success/10 px-3 py-2 text-xs font-medium text-success">
              Dashboard, Graduate Explorer and Insights now use this dataset.
            </p>
          ) : null}

          {result.errors.length ? (
            <ul className="mb-3 space-y-1.5">
              {result.errors.map((e) => (
                <li
                  key={e}
                  className="flex gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs text-destructive"
                >
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {e}
                </li>
              ))}
            </ul>
          ) : null}

          {result.warnings.length ? (
            <ul className="space-y-1.5">
              {result.warnings.map((w) => (
                <li
                  key={w}
                  className="flex gap-2 rounded-lg border border-warning/25 bg-warning/10 px-3 py-2 text-xs text-warning"
                >
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {w}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {/* Preview */}
      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-foreground">
            {result ? "Uploaded file preview" : "Active dataset preview"}
          </h2>
          <Pill>First {preview.length} rows</Pill>
        </div>
        {preview.length === 0 ? (
          <EmptyState
            title="Nothing to preview yet"
            hint="Upload a CSV or restore the demo dataset to see records here."
          />
        ) : (
          <div className="card-surface overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                    <th className="px-4 py-3 font-semibold">Student ID</th>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Department</th>
                    <th className="px-4 py-3 font-semibold">Year</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Company</th>
                    <th className="px-4 py-3 text-right font-semibold">Salary</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((g) => (
                    <tr key={g.id} className="border-b border-border/70 last:border-0">
                      <td className="num px-4 py-3 text-muted-foreground">{g.id}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{g.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{g.department}</td>
                      <td className="num px-4 py-3 text-muted-foreground">{g.graduationYear}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={g.employmentStatus} />
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{g.company ?? "—"}</td>
                      <td className="num px-4 py-3 text-right text-muted-foreground">
                        {g.salary !== null ? `₹${g.salary.toFixed(1)} LPA` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Expected schema */}
      <section className="card-surface mt-6 p-5">
        <h2 className="font-display text-base font-semibold text-foreground">Expected columns</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Header names are case- and spacing-insensitive; common aliases are accepted.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {CSV_COLUMNS.map((c) => (
            <span
              key={c.key}
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset ${
                c.required
                  ? "bg-primary/10 text-primary ring-primary/25"
                  : "bg-muted text-muted-foreground ring-border"
              }`}
            >
              {c.label}
              {c.required ? " *" : ""}
            </span>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
