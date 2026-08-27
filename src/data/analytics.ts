import { DEPARTMENTS, GRADUATES, YEARS, type Graduate } from "./graduates";

export type Filters = {
  year: string;
  department: string;
  status: string;
  industry: string;
};

export const EMPTY_FILTERS: Filters = {
  year: "all",
  department: "all",
  status: "all",
  industry: "all",
};

export function applyFilters(rows: Graduate[], f: Filters): Graduate[] {
  return rows.filter(
    (g) =>
      (f.year === "all" || String(g.graduationYear) === f.year) &&
      (f.department === "all" || g.department === f.department) &&
      (f.status === "all" || g.employmentStatus === f.status) &&
      (f.industry === "all" || g.industry === f.industry),
  );
}

const avg = (nums: number[]) =>
  nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;

export function kpis(rows: Graduate[]) {
  const total = rows.length;
  const employed = rows.filter(
    (g) => g.employmentStatus === "Employed" || g.employmentStatus === "Self Employed",
  );
  const higher = rows.filter((g) => g.employmentStatus === "Higher Studies");
  const salaries = rows.map((g) => g.salary).filter((s): s is number => s !== null);
  const ttm = rows
    .map((g) => g.timeToEmployment)
    .filter((s): s is number => s !== null);
  const relevant = employed.filter((g) => g.degreeRelevance === "High").length;

  return {
    total,
    employmentRate: total ? (employed.length / total) * 100 : 0,
    employedCount: employed.length,
    avgSalary: avg(salaries),
    avgTimeToEmployment: avg(ttm),
    higherStudies: higher.length,
    higherStudiesRate: total ? (higher.length / total) * 100 : 0,
    degreeRelevant: relevant,
    degreeRelevantRate: employed.length ? (relevant / employed.length) * 100 : 0,
  };
}

export function statusBreakdown(rows: Graduate[]) {
  const keys = ["Employed", "Higher Studies", "Self Employed", "Unemployed"] as const;
  return keys
    .map((k) => ({
      name: k,
      value: rows.filter((g) => g.employmentStatus === k).length,
    }))
    .filter((d) => d.value > 0);
}

export function departmentRates(rows: Graduate[]) {
  return DEPARTMENTS.map((d) => {
    const set = rows.filter((g) => g.department === d);
    const emp = set.filter(
      (g) => g.employmentStatus === "Employed" || g.employmentStatus === "Self Employed",
    ).length;
    return {
      department: d,
      short: d === "Electronics & Communication" ? "ECE" : d === "Information Technology" ? "IT" : d,
      rate: set.length ? Math.round((emp / set.length) * 1000) / 10 : 0,
      graduates: set.length,
    };
  }).filter((d) => d.graduates > 0);
}

export function yearTrend(rows: Graduate[]) {
  return YEARS.map((y) => {
    const set = rows.filter((g) => g.graduationYear === y);
    const emp = set.filter(
      (g) => g.employmentStatus === "Employed" || g.employmentStatus === "Self Employed",
    ).length;
    const salaries = set.map((g) => g.salary).filter((s): s is number => s !== null);
    return {
      year: String(y),
      rate: set.length ? Math.round((emp / set.length) * 1000) / 10 : 0,
      avgSalary: Math.round(avg(salaries) * 10) / 10,
      graduates: set.length,
    };
  }).filter((d) => d.graduates > 0);
}

const SALARY_BANDS = [
  { name: "< 4 LPA", min: 0, max: 4 },
  { name: "4 – 6 LPA", min: 4, max: 6 },
  { name: "6 – 8 LPA", min: 6, max: 8 },
  { name: "8 – 12 LPA", min: 8, max: 12 },
  { name: "12 – 18 LPA", min: 12, max: 18 },
  { name: "18+ LPA", min: 18, max: Infinity },
];

export function salaryDistribution(rows: Graduate[]) {
  const salaries = rows.map((g) => g.salary).filter((s): s is number => s !== null);
  return SALARY_BANDS.map((b) => ({
    name: b.name,
    graduates: salaries.filter((s) => s >= b.min && s < b.max).length,
  }));
}

const TTM_BANDS = [
  { name: "0 – 1 mo", min: 0, max: 2 },
  { name: "2 – 3 mo", min: 2, max: 4 },
  { name: "4 – 6 mo", min: 4, max: 7 },
  { name: "7 – 9 mo", min: 7, max: 10 },
  { name: "10+ mo", min: 10, max: Infinity },
];

export function timeToEmployment(rows: Graduate[]) {
  const t = rows.map((g) => g.timeToEmployment).filter((s): s is number => s !== null);
  return TTM_BANDS.map((b) => ({
    name: b.name,
    graduates: t.filter((s) => s >= b.min && s < b.max).length,
  }));
}

export function relevanceBreakdown(rows: Graduate[]) {
  const keys = ["High", "Moderate", "Low"] as const;
  return keys
    .map((k) => ({ name: k, value: rows.filter((g) => g.degreeRelevance === k).length }))
    .filter((d) => d.value > 0);
}

export function internshipImpact(rows: Graduate[]) {
  const rate = (set: Graduate[]) =>
    set.length
      ? (set.filter(
          (g) =>
            g.employmentStatus === "Employed" || g.employmentStatus === "Self Employed",
        ).length /
          set.length) *
        100
      : 0;
  const withI = rows.filter((g) => g.internship);
  const withoutI = rows.filter((g) => !g.internship);
  return {
    withRate: rate(withI),
    withoutRate: rate(withoutI),
    withCount: withI.length,
    withoutCount: withoutI.length,
  };
}

export function keyTakeaways(rows: Graduate[]): string[] {
  if (rows.length === 0) return ["No graduates match the current filters."];
  const k = kpis(rows);
  const depts = departmentRates(rows).sort((a, b) => b.rate - a.rate);
  const intern = internshipImpact(rows);
  const trend = yearTrend(rows);
  const out: string[] = [];

  if (depts.length > 1) {
    out.push(
      `${depts[0]!.department} leads with a ${depts[0]!.rate}% employment rate, while ${
        depts[depts.length - 1]!.department
      } trails at ${depts[depts.length - 1]!.rate}%.`,
    );
  }
  if (intern.withCount && intern.withoutCount) {
    out.push(
      `Graduates with internship experience are employed at ${intern.withRate.toFixed(
        1,
      )}% versus ${intern.withoutRate.toFixed(1)}% without — a ${(
        intern.withRate - intern.withoutRate
      ).toFixed(1)} point gap.`,
    );
  }
  if (trend.length > 1) {
    const delta = trend[trend.length - 1]!.rate - trend[0]!.rate;
    out.push(
      `Employment outcomes have ${delta >= 0 ? "improved" : "declined"} by ${Math.abs(
        delta,
      ).toFixed(1)} points from ${trend[0]!.year} to ${trend[trend.length - 1]!.year}.`,
    );
  }
  out.push(
    `Average starting salary is ₹${k.avgSalary.toFixed(
      1,
    )} LPA with a mean time-to-employment of ${k.avgTimeToEmployment.toFixed(1)} months.`,
  );
  return out.slice(0, 3);
}

export type Insight = { title: string; detail: string };

export function insights() {
  const rows = GRADUATES;
  const k = kpis(rows);
  const depts = departmentRates(rows).sort((a, b) => b.rate - a.rate);
  const intern = internshipImpact(rows);
  const trend = yearTrend(rows);

  const slowest = [...DEPARTMENTS]
    .map((d) => {
      const t = rows
        .filter((g) => g.department === d)
        .map((g) => g.timeToEmployment)
        .filter((s): s is number => s !== null);
      return { department: d, ttm: avg(t) };
    })
    .sort((a, b) => b.ttm - a.ttm);

  const lowRelevance = [...DEPARTMENTS]
    .map((d) => {
      const set = rows.filter(
        (g) =>
          g.department === d &&
          (g.employmentStatus === "Employed" || g.employmentStatus === "Self Employed"),
      );
      const high = set.filter((g) => g.degreeRelevance === "High").length;
      return { department: d, rate: set.length ? (high / set.length) * 100 : 0 };
    })
    .sort((a, b) => a.rate - b.rate);

  const unemployedByDept = [...DEPARTMENTS]
    .map((d) => {
      const set = rows.filter((g) => g.department === d);
      const un = set.filter((g) => g.employmentStatus === "Unemployed").length;
      return { department: d, rate: set.length ? (un / set.length) * 100 : 0, count: un };
    })
    .sort((a, b) => b.rate - a.rate);

  const positive: Insight[] = [
    {
      title: `${depts[0]!.department} outperforms the institutional average`,
      detail: `${depts[0]!.department} records a ${depts[0]!.rate}% employment rate against an institutional average of ${k.employmentRate.toFixed(
        1,
      )}%, across ${depts[0]!.graduates} tracked graduates.`,
    },
    {
      title: "Internships strongly improve employment outcomes",
      detail: `Graduates with internship experience reach ${intern.withRate.toFixed(
        1,
      )}% employment compared to ${intern.withoutRate.toFixed(
        1,
      )}% without — a ${(intern.withRate - intern.withoutRate).toFixed(1)} point advantage.`,
    },
    {
      title: "Year-on-year placement momentum is positive",
      detail: `Employment rate moved from ${trend[0]!.rate}% in ${trend[0]!.year} to ${
        trend[trend.length - 1]!.rate
      }% in ${trend[trend.length - 1]!.year}, with average salary now ₹${
        trend[trend.length - 1]!.avgSalary
      } LPA.`,
    },
  ];

  const attention: Insight[] = [
    {
      title: `${unemployedByDept[0]!.department} shows the highest unemployment share`,
      detail: `${unemployedByDept[0]!.count} graduates (${unemployedByDept[0]!.rate.toFixed(
        1,
      )}%) from ${unemployedByDept[0]!.department} remain unemployed — the widest gap in the institution.`,
    },
    {
      title: `Longer time-to-employment in ${slowest[0]!.department}`,
      detail: `${slowest[0]!.department} graduates take ${slowest[0]!.ttm.toFixed(
        1,
      )} months on average to secure a role, versus an institutional mean of ${k.avgTimeToEmployment.toFixed(
        1,
      )} months.`,
    },
    {
      title: `Degree relevance is weakest in ${lowRelevance[0]!.department}`,
      detail: `Only ${lowRelevance[0]!.rate.toFixed(
        1,
      )}% of employed ${lowRelevance[0]!.department} graduates are in highly degree-relevant roles, indicating skill-to-role mismatch.`,
    },
  ];

  const recommendations: Insight[] = [
    {
      title: `Expand industry-linked internships for ${depts[depts.length - 1]!.department}`,
      detail: `With a ${depts[depts.length - 1]!.rate}% employment rate and only ${(
        (rows.filter((g) => g.department === depts[depts.length - 1]!.department && g.internship)
          .length /
          rows.filter((g) => g.department === depts[depts.length - 1]!.department).length) *
        100
      ).toFixed(0)}% internship participation, structured six-month industry internships should be mandated.`,
    },
    {
      title: `Launch a placement acceleration cell for ${slowest[0]!.department}`,
      detail: `Targeted pre-final-year aptitude drills, mock interviews and early recruiter outreach can compress the ${slowest[0]!.ttm.toFixed(
        1,
      )} month time-to-employment.`,
    },
    {
      title: "Add role-aligned electives to improve degree relevance",
      detail: `${(100 - k.degreeRelevantRate).toFixed(
        1,
      )}% of employed graduates are in moderately or weakly relevant roles. Certification-backed electives mapped to hiring roles would close the gap.`,
    },
  ];

  return { positive, attention, recommendations, kpis: k };
}
