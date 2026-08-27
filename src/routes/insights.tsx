import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, ArrowUpRight, Lightbulb, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { AppShell, PageHeader } from "@/components/app-shell";
import { Pill } from "@/components/ui-bits";
import { insights, type Insight } from "@/data/analytics";
import { GRADUATES } from "@/data/graduates";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Outcome Insights & Recommendations | CareerPulse" },
      {
        name: "description",
        content:
          "Automated findings on placement strengths, departments needing attention, and recommended institutional actions.",
      },
      { property: "og:title", content: "Outcome Insights | CareerPulse" },
      {
        property: "og:description",
        content:
          "Strengths, risk areas and recommended actions derived from graduate employment outcomes.",
      },
    ],
  }),
  component: InsightsPage,
});

function Section({
  title,
  description,
  icon: Icon,
  tone,
  items,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  tone: "success" | "warning" | "primary";
  items: Insight[];
}) {
  const tones = {
    success: "bg-success/10 text-success ring-success/20",
    warning: "bg-warning/15 text-warning ring-warning/25",
    primary: "bg-primary/10 text-primary ring-primary/20",
  } as const;

  return (
    <section className="mb-8">
      <div className="mb-4 flex items-center gap-3">
        <span className={`flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-inset ${tones[tone]}`}>
          <Icon className="h-4.5 w-4.5" />
        </span>
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground">{title}</h2>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((i) => (
          <article key={i.title} className="card-surface card-interactive flex flex-col p-5">
            <h3 className="font-display text-sm font-semibold leading-snug text-foreground">
              {i.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{i.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function InsightsPage() {
  const { positive, attention, recommendations, kpis } = insights();

  return (
    <AppShell>
      <PageHeader
        title="Insights & Recommendations"
        subtitle="Findings generated from the full outcomes dataset — what is working, where outcomes lag, and the actions that would move the needle."
        meta={<Pill>Based on {GRADUATES.length} graduate records</Pill>}
      />

      <div className="card-surface mb-8 flex flex-wrap gap-6 p-5">
        {[
          { label: "Employment rate", value: `${kpis.employmentRate.toFixed(1)}%` },
          { label: "Average salary", value: `₹${kpis.avgSalary.toFixed(1)} LPA` },
          { label: "Avg. time to job", value: `${kpis.avgTimeToEmployment.toFixed(1)} mo` },
          { label: "Degree-relevant roles", value: `${kpis.degreeRelevantRate.toFixed(1)}%` },
        ].map((s) => (
          <div key={s.label} className="min-w-[130px]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {s.label}
            </p>
            <p className="num mt-1.5 font-display text-xl font-bold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      <Section
        title="What's working"
        description="Strengths visible across the tracked cohorts."
        icon={TrendingUp}
        tone="success"
        items={positive}
      />
      <Section
        title="Needs attention"
        description="Areas where outcomes trail the institutional average."
        icon={AlertTriangle}
        tone="warning"
        items={attention}
      />
      <Section
        title="Recommended actions"
        description="Interventions mapped directly to the gaps above."
        icon={Lightbulb}
        tone="primary"
        items={recommendations}
      />

      <div className="card-surface flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-display text-sm font-semibold text-foreground">
            Take these findings back to the data
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Filter the dashboard by department or cohort to validate any insight on this page.
          </p>
        </div>
        <a
          href="/"
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Open dashboard <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </AppShell>
  );
}
