import type { EmploymentStatus, Graduate } from "@/data/graduates";

/* ------------------------------------------------------------------ */
/* Minimal RFC4180-ish CSV parser (quote aware, no dependencies)       */
/* ------------------------------------------------------------------ */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  const src = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < src.length; i++) {
    const c = src[i]!;
    if (quoted) {
      if (c === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += c;
      continue;
    }
    if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && src[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.some((v) => v.trim() !== "")) rows.push(row);
      row = [];
    } else field += c;
  }
  row.push(field);
  if (row.some((v) => v.trim() !== "")) rows.push(row);
  return rows;
}

/* ------------------------------------------------------------------ */
/* Column mapping + validation                                         */
/* ------------------------------------------------------------------ */
type FieldKey =
  | "id"
  | "name"
  | "department"
  | "graduationYear"
  | "cgpa"
  | "internship"
  | "employmentStatus"
  | "company"
  | "role"
  | "industry"
  | "location"
  | "salary"
  | "timeToEmployment"
  | "degreeRelevance"
  | "higherStudies";

type Spec = { key: FieldKey; label: string; aliases: string[]; required: boolean };

export const CSV_COLUMNS: Spec[] = [
  { key: "id", label: "Student ID", aliases: ["studentid", "id", "rollno", "rollnumber"], required: true },
  { key: "name", label: "Name", aliases: ["name", "studentname", "fullname"], required: true },
  { key: "department", label: "Department", aliases: ["department", "branch", "dept"], required: true },
  { key: "graduationYear", label: "Graduation Year", aliases: ["graduationyear", "year", "passoutyear", "batch"], required: true },
  { key: "cgpa", label: "CGPA", aliases: ["cgpa", "gpa"], required: false },
  { key: "internship", label: "Internship", aliases: ["internship", "internshipexperience", "hasinternship"], required: false },
  { key: "employmentStatus", label: "Employment Status", aliases: ["employmentstatus", "status"], required: true },
  { key: "company", label: "Company", aliases: ["company", "employer", "organisation", "organization"], required: false },
  { key: "role", label: "Job Role", aliases: ["jobrole", "role", "designation", "jobtitle"], required: false },
  { key: "industry", label: "Industry", aliases: ["industry", "sector"], required: false },
  { key: "location", label: "Location", aliases: ["location", "city", "workLocation".toLowerCase()], required: false },
  { key: "salary", label: "Salary", aliases: ["salary", "salarylpa", "package", "ctc", "startingsalary"], required: false },
  { key: "timeToEmployment", label: "Time to Employment", aliases: ["timetoemployment", "monthstoemployment", "timetojob"], required: false },
  { key: "degreeRelevance", label: "Degree Relevance", aliases: ["degreerelevance", "relevance"], required: false },
  { key: "higherStudies", label: "Higher Studies", aliases: ["higherstudies", "postgraduation", "furtherstudies"], required: false },
];

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

const STATUS_MAP: Record<string, EmploymentStatus> = {
  employed: "Employed",
  placed: "Employed",
  unemployed: "Unemployed",
  seeking: "Unemployed",
  higherstudies: "Higher Studies",
  highereducation: "Higher Studies",
  studying: "Higher Studies",
  selfemployed: "Self Employed",
  entrepreneur: "Self Employed",
  freelance: "Self Employed",
};

const RELEVANCE = ["High", "Moderate", "Low", "Not Applicable"] as const;

export type CsvResult = {
  ok: boolean;
  rows: Graduate[];
  missingColumns: string[];
  matchedColumns: string[];
  errors: string[];
  warnings: string[];
  totalRows: number;
  skippedRows: number;
};

const num = (v: string | undefined) => {
  if (!v) return null;
  const n = Number(String(v).replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(n) ? n : null;
};

const truthy = (v: string | undefined) =>
  ["yes", "y", "true", "1", "completed", "done"].includes(norm(v ?? ""));

export function parseGraduateCsv(text: string): CsvResult {
  const table = parseCsv(text);
  const empty: CsvResult = {
    ok: false,
    rows: [],
    missingColumns: [],
    matchedColumns: [],
    errors: [],
    warnings: [],
    totalRows: 0,
    skippedRows: 0,
  };

  if (table.length < 2) {
    return { ...empty, errors: ["The file is empty or has no data rows below the header."] };
  }

  const header = table[0]!.map(norm);
  const index: Partial<Record<FieldKey, number>> = {};
  const matched: string[] = [];
  const missing: string[] = [];

  for (const spec of CSV_COLUMNS) {
    const i = header.findIndex((h) => h === norm(spec.label) || spec.aliases.includes(h));
    if (i >= 0) {
      index[spec.key] = i;
      matched.push(spec.label);
    } else {
      missing.push(spec.label);
      if (!spec.required) continue;
    }
  }

  const missingRequired = CSV_COLUMNS.filter((s) => s.required && index[s.key] === undefined).map(
    (s) => s.label,
  );

  if (missingRequired.length) {
    return {
      ...empty,
      missingColumns: missing,
      matchedColumns: matched,
      errors: [`Missing required column${missingRequired.length > 1 ? "s" : ""}: ${missingRequired.join(", ")}.`],
    };
  }

  const errors: string[] = [];
  const warnings: string[] = [];
  const rows: Graduate[] = [];
  let skipped = 0;

  const cell = (r: string[], key: FieldKey) => {
    const i = index[key];
    return i === undefined ? undefined : (r[i] ?? "").trim();
  };

  for (let r = 1; r < table.length; r++) {
    const line = table[r]!;
    const lineNo = r + 1;
    const name = cell(line, "name");
    const department = cell(line, "department");
    const yearRaw = cell(line, "graduationYear");
    const statusRaw = cell(line, "employmentStatus");

    if (!name || !department || !yearRaw || !statusRaw) {
      skipped++;
      if (errors.length < 6)
        errors.push(`Row ${lineNo}: missing a required value (name, department, year or status).`);
      continue;
    }

    const year = num(yearRaw);
    if (!year || year < 1950 || year > 2100) {
      skipped++;
      if (errors.length < 6) errors.push(`Row ${lineNo}: "${yearRaw}" is not a valid graduation year.`);
      continue;
    }

    const status = STATUS_MAP[norm(statusRaw)];
    if (!status) {
      skipped++;
      if (errors.length < 6)
        errors.push(
          `Row ${lineNo}: unknown employment status "${statusRaw}" (expected Employed, Unemployed, Higher Studies or Self Employed).`,
        );
      continue;
    }

    const cgpa = num(cell(line, "cgpa"));
    if (cgpa !== null && (cgpa < 0 || cgpa > 10) && warnings.length < 6) {
      warnings.push(`Row ${lineNo}: CGPA ${cgpa} is outside the 0–10 range.`);
    }

    const relevanceRaw = cell(line, "degreeRelevance") ?? "";
    const relevance =
      RELEVANCE.find((x) => norm(x) === norm(relevanceRaw)) ??
      (status === "Employed" || status === "Self Employed" ? "Moderate" : "Not Applicable");

    const salary = num(cell(line, "salary"));
    const higher = cell(line, "higherStudies") || null;

    rows.push({
      id: cell(line, "id") || `CSV-${String(r).padStart(4, "0")}`,
      name,
      department,
      graduationYear: year,
      cgpa: cgpa !== null ? Math.round(cgpa * 100) / 100 : 0,
      internship: truthy(cell(line, "internship")),
      employmentStatus: status,
      company: cell(line, "company") || null,
      role: cell(line, "role") || null,
      industry: cell(line, "industry") || null,
      location: cell(line, "location") || null,
      salary: salary !== null && salary > 0 ? Math.round(salary * 100) / 100 : null,
      timeToEmployment: num(cell(line, "timeToEmployment")),
      degreeRelevance: relevance,
      higherStudies: higher && norm(higher) !== "no" ? higher : null,
    });
  }

  if (missing.length) {
    warnings.unshift(
      `Optional column${missing.length > 1 ? "s" : ""} not found: ${missing.join(", ")}. Related metrics may be incomplete.`,
    );
  }
  if (skipped) {
    warnings.unshift(`${skipped} row${skipped > 1 ? "s were" : " was"} skipped because of invalid data.`);
  }

  return {
    ok: rows.length > 0,
    rows,
    missingColumns: missing,
    matchedColumns: matched,
    errors: rows.length === 0 ? [...errors, "No valid rows could be imported from this file."] : errors,
    warnings,
    totalRows: table.length - 1,
    skippedRows: skipped,
  };
}

export const CSV_TEMPLATE_HEADER = CSV_COLUMNS.map((c) => c.label).join(",");
