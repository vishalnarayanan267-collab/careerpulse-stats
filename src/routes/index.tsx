import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BadgeCheck,
  Banknote,
  GraduationCap,
  Lightbulb,
  Target,
  Timer,
  TrendingUp,
  Users,
} from "lucide-react";

import { AppShell, PageHeader } from "@/components/app-shell";
import {
  CHART_COLORS,
  ChartCard,
  EmptyState,
  FilterSelect,
  KpiCard,
  Pill,
  tooltipStyle,
} from "@/components/ui-bits";
import {
  applyFilters,
  departmentRates,
  EMPTY_FILTERS,
  keyTakeaways,
  kpis,
  relevanceBreakdown,
  salaryDistribution,
  statusBreakdown,
  timeToEmployment,
  yearTrend,
  type Filters,
} from "@/data/analytics";
import { datasetOptions, useDataset } from "@/data/dataset-store";
import { useIsMobile } from "@/hooks/use-mobile";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Employment Outcomes Dashboard | CareerPulse" },
      {
        name: "description",
        content:
          "CareerPulse tracks graduate employment rates, salaries, time-to-employment and department trends for placement officers.",
      },
      { property: "og:title", content: "Employment Outcomes Dashboard | CareerPulse" },
      {
        property: "og:description",
        content:
          "Institutional analytics for graduate employment outcomes — employment rate, salary bands, department comparison and trends.",
      },
    ],
  }),
  component: Dashboard,
});

const STATUS_COLOR: Record<string, string> = {
  Employed: "var(--chart-3)",
  "Higher Studies": "var(--chart-1)",
  "Self Employed": "var(--chart-6)",
  Unemployed: "var(--chart-5)",
};

const opt = (values: readonly (string | number)[], allLabel: string) => [
  { value: "all", label: allLabel },
  ...values.map((v) => ({ value: String(v), label: String(v) })),
];

function Dashboard() {
  const isMobile = useIsMobile();
  const dataset = useDataset();
  const all = dataset.rows;
  const options = useMemo(() => datasetOptions(all), [all]);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const set = (key: keyof Filters) => (v: string) =>
    setFilters((f) => ({ ...f, [key]: v }));

  const rows = useMemo(() => applyFilters(all, filters), [all, filters]);
  const k = useMemo(() => kpis(rows), [rows]);
  const status = useMemo(() => statusBreakdown(rows), [rows]);
  const depts = useMemo(() => departmentRates(rows), [rows]);
  const trend = useMemo(() => yearTrend(rows), [rows]);
  const salary = useMemo(() => salaryDistribution(rows), [rows]);
  const ttm = useMemo(() => timeToEmployment(rows), [rows]);
  const relevance = useMemo(() => relevanceBreakdown(rows), [rows]);
  const takeaways = useMemo(() => keyTakeaways(rows), [rows]);

  const activeFilters = Object.values(filters).filter((v) => v !== "all").length;

  return (
    <AppShell>
      <PageHeader
        title="Employment Outcomes Dashboard"
        subtitle="Track graduate employment, career outcomes and institutional trends."
        meta={
          <div className="flex flex-wrap items-center gap-2">
            <Pill>
              Data source: {dataset.source === "demo" ? "Demo Dataset" : "Uploaded Dataset"}
            </Pill>
            <Pill>{all.length} graduates tracked</Pill>
            <Pill>{activeFilters} filters active</Pill>
            <Pill>
              {dataset.source === "demo"
                ? "Built-in institutional sample"
                : `${dataset.label} · imported ${new Date(dataset.updatedAt ?? Date.now()).toLocaleString()}`}
            </Pill>
          </div>
        }
      />

      <div className="card-surface mb-6 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
          <FilterSelect
            label="Graduation Year"
            value={filters.year}
            onChange={set("year")}
            options={opt(options.years, "All years")}
          />
          <FilterSelect
            label="Department"
            value={filters.department}
            onChange={set("department")}
            options={opt(options.departments, "All departments")}
          />
          <FilterSelect
            label="Employment Status"
            value={filters.status}
            onChange={set("status")}
            options={opt(options.statuses, "All statuses")}
          />
          <FilterSelect
            label="Industry"
            value={filters.industry}
            onChange={set("industry")}
            options={opt(options.industries, "All industries")}
          />
          <button
            onClick={() => setFilters(EMPTY_FILTERS)}
            className="h-10 shrink-0 rounded-lg border border-border bg-muted px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
          >
            Reset
          </button>
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title="No graduates match these filters"
          hint="Try widening the year, department, status or industry selection."
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <KpiCard
              label="Total Graduates"
              value={String(k.total)}
              support={`${all.length ? ((k.total / all.length) * 100).toFixed(0) : 0}% of tracked cohort`}
              icon={Users}
            />
            <KpiCard
              label="Employment Rate"
              value={`${k.employmentRate.toFixed(1)}%`}
              support={`${k.employedCount} placed incl. self-employed`}
              icon={TrendingUp}
              tone="success"
            />
            <KpiCard
              label="Average Starting Salary"
              value={`₹${k.avgSalary.toFixed(1)} LPA`}
              support="Across employed & self-employed graduates"
              icon={Banknote}
              tone="accent"
            />
            <KpiCard
              label="Average Time to Employment"
              value={`${k.avgTimeToEmployment.toFixed(1)} mo`}
              support="From graduation to first offer"
              icon={Timer}
              tone="warning"
            />
            <KpiCard
              label="Higher Studies"
              value={String(k.higherStudies)}
              support={`${k.higherStudiesRate.toFixed(1)}% pursuing postgraduate study`}
              icon={GraduationCap}
            />
            <KpiCard
              label="Degree-Relevant Employment"
              value={`${k.degreeRelevantRate.toFixed(1)}%`}
              support={`${k.degreeRelevant} in highly relevant roles`}
              icon={BadgeCheck}
              tone="success"
            />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <ChartCard
              title="Employment Status"
              description="Outcome split for the filtered cohort"
            >
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={status}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={isMobile ? 48 : 58}
                    outerRadius={isMobile ? 72 : 88}
                    paddingAngle={3}
                    stroke="var(--card)"
                    strokeWidth={2}
                  >
                    {status.map((s) => (
                      <Cell key={s.name} fill={STATUS_COLOR[s.name]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v: number, n) => [`${v} graduates`, n as string]}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{ fontSize: isMobile ? 10 : 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Employment Rate by Department"
              description="Placed share per department (%)"
              className="xl:col-span-2"
            >
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={depts}
                  layout="vertical"
                  margin={{ left: 8, right: 24, top: 4, bottom: 4 }}
                >
                  <CartesianGrid horizontal={false} stroke="var(--border)" />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    unit="%"
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    stroke="var(--border)"
                  />
                  <YAxis
                    type="category"
                    dataKey="short"
                    width={isMobile ? 92 : 112}
                    tick={{ fontSize: isMobile ? 9 : 11, fill: "var(--muted-foreground)" }}
                    stroke="var(--border)"
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v: number) => [`${v}%`, "Employment rate"]}
                  />
                  <Bar dataKey="rate" radius={[0, 6, 6, 0]} barSize={16}>
                    {depts.map((d, i) => (
                      <Cell key={d.department} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Employment Trend by Graduation Year"
              description="Employment rate and average salary over time"
              className="xl:col-span-2"
            >
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={trend} margin={{ left: 0, right: 12, top: 8, bottom: 4 }}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="year"
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    stroke="var(--border)"
                  />
                  <YAxis
                    yAxisId="left"
                    unit="%"
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    stroke="var(--border)"
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    stroke="var(--border)"
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend iconType="plainline" wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="rate"
                    name="Employment rate (%)"
                    stroke="var(--chart-1)"
                    strokeWidth={2.5}
                    dot={{ r: 3.5 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="avgSalary"
                    name="Avg salary (LPA)"
                    stroke="var(--chart-3)"
                    strokeWidth={2.5}
                    dot={{ r: 3.5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Degree Relevance"
              description="How closely roles map to the degree"
            >
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={relevance}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={isMobile ? 44 : 52}
                    outerRadius={isMobile ? 72 : 88}
                    paddingAngle={3}
                    stroke="var(--card)"
                    strokeWidth={2}
                  >
                    {relevance.map((r, i) => (
                      <Cell key={r.name} fill={CHART_COLORS[i + 1]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v: number, n) => [`${v} graduates`, n as string]}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{ fontSize: isMobile ? 10 : 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Starting Salary Distribution"
              description="Graduates per annual salary band"
            >
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={salary} margin={{ left: 0, right: 12, top: 8, bottom: 4 }}>
                  <CartesianGrid vertical={false} stroke="var(--border)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: isMobile ? 9 : 10, fill: "var(--muted-foreground)" }}
                    stroke="var(--border)"
                    interval={0}
                    angle={isMobile ? -25 : 0}
                    textAnchor="end"
                    height={isMobile ? 55 : 30}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    stroke="var(--border)"
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v: number) => [`${v} graduates`, "Graduates"]}
                  />
                  <Bar
                    dataKey="graduates"
                    fill="var(--chart-2)"
                    radius={[6, 6, 0, 0]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Time to Employment"
              description="Months between graduation and first role"
            >
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={ttm} margin={{ left: 0, right: 12, top: 8, bottom: 4 }}>
                  <CartesianGrid vertical={false} stroke="var(--border)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: isMobile ? 9 : 10, fill: "var(--muted-foreground)" }}
                    stroke="var(--border)"
                    interval={0}
                    angle={isMobile ? -25 : 0}
                    textAnchor="end"
                    height={isMobile ? 55 : 30}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    stroke="var(--border)"
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v: number) => [`${v} graduates`, "Graduates"]}
                  />
                  <Bar
                    dataKey="graduates"
                    fill="var(--chart-4)"
                    radius={[6, 6, 0, 0]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Department Cohort Size"
              description="Graduates represented per department"
            >
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={depts} margin={{ left: 0, right: 12, top: 8, bottom: 4 }}>
                  <CartesianGrid vertical={false} stroke="var(--border)" />
                  <XAxis
                    dataKey="short"
                    tick={{ fontSize: 9, fill: "var(--muted-foreground)" }}
                    stroke="var(--border)"
                    interval={0}
                    angle={-18}
                    textAnchor="end"
                    height={54}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    stroke="var(--border)"
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v: number) => [`${v} graduates`, "Cohort"]}
                  />
                  <Bar
                    dataKey="graduates"
                    fill="var(--chart-1)"
                    radius={[6, 6, 0, 0]}
                    barSize={26}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <section className="card-surface mt-6 p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning/15 text-warning">
                <Lightbulb className="h-4 w-4" />
              </span>
              <h3 className="font-display text-base font-semibold">Key Takeaways</h3>
            </div>
            <ul className="grid gap-3 md:grid-cols-3">
              {takeaways.map((t) => (
                <li
                  key={t}
                  className="flex gap-2.5 rounded-lg border border-border bg-muted/50 p-4 text-sm text-foreground"
                >
                  <Target className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </AppShell>
  );
}
