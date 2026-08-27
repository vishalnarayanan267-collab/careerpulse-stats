export type EmploymentStatus =
  | "Employed"
  | "Unemployed"
  | "Higher Studies"
  | "Self Employed";

export type Graduate = {
  id: string;
  name: string;
  department: string;
  graduationYear: number;
  cgpa: number;
  internship: boolean;
  employmentStatus: EmploymentStatus;
  company: string | null;
  role: string | null;
  industry: string | null;
  location: string | null;
  salary: number | null; // LPA in rupees (annual)
  timeToEmployment: number | null; // months
  degreeRelevance: "High" | "Moderate" | "Low" | "Not Applicable";
  higherStudies: string | null;
};

export const DEPARTMENTS = [
  "Computer Science",
  "AI & ML",
  "Information Technology",
  "Electronics & Communication",
  "Electrical",
  "Mechanical",
  "Civil",
] as const;

export const YEARS = [2021, 2022, 2023, 2024, 2025] as const;

export const STATUSES: EmploymentStatus[] = [
  "Employed",
  "Unemployed",
  "Higher Studies",
  "Self Employed",
];

export const INDUSTRIES = [
  "Information Technology",
  "Product & SaaS",
  "Core Engineering",
  "Manufacturing",
  "Infrastructure",
  "Analytics & Data",
  "Consulting",
  "Telecom",
  "Energy & Power",
];

/* ------------------------------------------------------------------ */
/* Deterministic pseudo-random generator (mulberry32)                  */
/* ------------------------------------------------------------------ */
function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIRST_NAMES = [
  "Aarav", "Ananya", "Rohit", "Sneha", "Vikram", "Priya", "Karthik", "Divya",
  "Rahul", "Meera", "Arjun", "Ishita", "Nikhil", "Kavya", "Siddharth", "Neha",
  "Aditya", "Pooja", "Manish", "Shreya", "Harsh", "Ritika", "Varun", "Tanvi",
  "Abhishek", "Lakshmi", "Sandeep", "Anjali", "Gaurav", "Swathi", "Yash",
  "Nandini", "Rakesh", "Bhavana", "Kunal", "Aishwarya", "Deepak", "Sanjana",
  "Praveen", "Madhuri",
];

const LAST_NAMES = [
  "Sharma", "Iyer", "Reddy", "Patel", "Nair", "Menon", "Verma", "Singh",
  "Gupta", "Rao", "Joshi", "Desai", "Kulkarni", "Chatterjee", "Bose",
  "Mehta", "Pillai", "Naidu", "Agarwal", "Bhat",
];

const COMPANIES: Record<string, { name: string; industry: string }[]> = {
  tech: [
    { name: "Infosys", industry: "Information Technology" },
    { name: "TCS", industry: "Information Technology" },
    { name: "Wipro", industry: "Information Technology" },
    { name: "Tech Mahindra", industry: "Information Technology" },
    { name: "HCLTech", industry: "Information Technology" },
    { name: "Zoho", industry: "Product & SaaS" },
    { name: "Freshworks", industry: "Product & SaaS" },
    { name: "Razorpay", industry: "Product & SaaS" },
    { name: "Swiggy", industry: "Product & SaaS" },
    { name: "Flipkart", industry: "Product & SaaS" },
    { name: "Mu Sigma", industry: "Analytics & Data" },
    { name: "Fractal Analytics", industry: "Analytics & Data" },
    { name: "Deloitte India", industry: "Consulting" },
  ],
  core: [
    { name: "Larsen & Toubro", industry: "Infrastructure" },
    { name: "Tata Motors", industry: "Manufacturing" },
    { name: "Mahindra & Mahindra", industry: "Manufacturing" },
    { name: "Bharat Heavy Electricals", industry: "Energy & Power" },
    { name: "Siemens India", industry: "Core Engineering" },
    { name: "ABB India", industry: "Energy & Power" },
    { name: "Ashok Leyland", industry: "Manufacturing" },
    { name: "Godrej & Boyce", industry: "Core Engineering" },
    { name: "Shapoorji Pallonji", industry: "Infrastructure" },
    { name: "Bharti Airtel", industry: "Telecom" },
    { name: "Jio Platforms", industry: "Telecom" },
    { name: "NTPC", industry: "Energy & Power" },
  ],
};

const ROLES: Record<string, string[]> = {
  "Computer Science": ["Software Engineer", "Backend Developer", "SDE-1", "QA Engineer"],
  "AI & ML": ["ML Engineer", "Data Scientist", "AI Research Associate", "Data Analyst"],
  "Information Technology": ["Systems Engineer", "Cloud Engineer", "Support Engineer", "Full Stack Developer"],
  "Electronics & Communication": ["Embedded Engineer", "VLSI Design Engineer", "Network Engineer", "Test Engineer"],
  Electrical: ["Electrical Design Engineer", "Power Systems Engineer", "Graduate Engineer Trainee"],
  Mechanical: ["Design Engineer", "Production Engineer", "Graduate Engineer Trainee", "Quality Engineer"],
  Civil: ["Site Engineer", "Structural Engineer", "Project Engineer", "Planning Engineer"],
};

const LOCATIONS = [
  "Bengaluru", "Hyderabad", "Chennai", "Pune", "Mumbai", "Delhi NCR",
  "Kochi", "Coimbatore", "Ahmedabad", "Kolkata",
];

const HIGHER_STUDIES = [
  "M.Tech — IIT Madras",
  "M.Tech — NIT Trichy",
  "MS — Arizona State University",
  "MS — TU Munich",
  "MBA — IIM Indore",
  "M.E — Anna University",
  "GATE preparation",
];

/** Department behaviour profiles — creates believable differences. */
const PROFILE: Record<
  string,
  { employ: number; higher: number; self: number; salary: number; ttm: number; core: boolean }
> = {
  "Computer Science": { employ: 0.84, higher: 0.09, self: 0.03, salary: 8.4, ttm: 2.6, core: false },
  "AI & ML": { employ: 0.88, higher: 0.07, self: 0.02, salary: 10.2, ttm: 2.2, core: false },
  "Information Technology": { employ: 0.8, higher: 0.08, self: 0.03, salary: 6.8, ttm: 3.1, core: false },
  "Electronics & Communication": { employ: 0.71, higher: 0.13, self: 0.03, salary: 5.6, ttm: 4.1, core: false },
  Electrical: { employ: 0.66, higher: 0.12, self: 0.04, salary: 4.9, ttm: 4.8, core: true },
  Mechanical: { employ: 0.61, higher: 0.11, self: 0.05, salary: 4.4, ttm: 5.4, core: true },
  Civil: { employ: 0.56, higher: 0.1, self: 0.07, salary: 4.0, ttm: 6.1, core: true },
};

const COUNTS: Record<string, number> = {
  "Computer Science": 26,
  "AI & ML": 20,
  "Information Technology": 22,
  "Electronics & Communication": 20,
  Electrical: 16,
  Mechanical: 18,
  Civil: 14,
};

function build(): Graduate[] {
  const rand = rng(20260135);
  const out: Graduate[] = [];
  let n = 0;

  for (const dept of DEPARTMENTS) {
    const p = PROFILE[dept]!;
    for (let i = 0; i < COUNTS[dept]!; i++) {
      n++;
      const year = YEARS[Math.floor(rand() * YEARS.length)]!;
      const yearLift = (year - 2021) * 0.018; // outcomes improve slightly year over year
      const internship = rand() < (p.core ? 0.55 : 0.74);
      const internLift = internship ? 0.14 : -0.16;
      const cgpa = Math.round((6.2 + rand() * 3.6) * 100) / 100;
      const cgpaLift = (cgpa - 7.5) * 0.05;

      const employChance = Math.min(
        0.96,
        Math.max(0.2, p.employ + yearLift + internLift + cgpaLift),
      );

      const roll = rand();
      let status: EmploymentStatus;
      if (roll < employChance) status = "Employed";
      else if (roll < employChance + p.higher) status = "Higher Studies";
      else if (roll < employChance + p.higher + p.self) status = "Self Employed";
      else status = "Unemployed";

      const name = `${FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)]!} ${
        LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)]!
      }`;
      const id = `CP${year}${String(n).padStart(3, "0")}`;

      if (status === "Employed") {
        const pool = p.core
          ? rand() < 0.78
            ? COMPANIES.core
            : COMPANIES.tech
          : rand() < 0.85
            ? COMPANIES.tech
            : COMPANIES.core;
        const company = pool[Math.floor(rand() * pool.length)]!;
        const roles = ROLES[dept]!;
        const relevanceRoll = rand() + (internship ? 0.12 : 0) + (p.core ? -0.1 : 0.05);
        const salary =
          Math.round(
            (p.salary * (0.72 + rand() * 0.75) + (internship ? 0.7 : 0) + cgpaLift * 4) * 10,
          ) / 10;
        out.push({
          id,
          name,
          department: dept,
          graduationYear: year,
          cgpa,
          internship,
          employmentStatus: status,
          company: company.name,
          role: roles[Math.floor(rand() * roles.length)]!,
          industry: company.industry,
          location: LOCATIONS[Math.floor(rand() * LOCATIONS.length)]!,
          salary: Math.max(2.6, salary),
          timeToEmployment: Math.max(
            0,
            Math.round(p.ttm * (0.5 + rand() * 1.3) - (internship ? 1.1 : -0.6)),
          ),
          degreeRelevance:
            relevanceRoll > 0.72 ? "High" : relevanceRoll > 0.36 ? "Moderate" : "Low",
          higherStudies: null,
        });
      } else if (status === "Higher Studies") {
        out.push({
          id,
          name,
          department: dept,
          graduationYear: year,
          cgpa,
          internship,
          employmentStatus: status,
          company: null,
          role: null,
          industry: null,
          location: LOCATIONS[Math.floor(rand() * LOCATIONS.length)]!,
          salary: null,
          timeToEmployment: null,
          degreeRelevance: "Not Applicable",
          higherStudies: HIGHER_STUDIES[Math.floor(rand() * HIGHER_STUDIES.length)]!,
        });
      } else if (status === "Self Employed") {
        const salary = Math.round(p.salary * (0.5 + rand() * 0.9) * 10) / 10;
        out.push({
          id,
          name,
          department: dept,
          graduationYear: year,
          cgpa,
          internship,
          employmentStatus: status,
          company: "Self Venture",
          role: rand() < 0.5 ? "Founder" : "Independent Consultant",
          industry: p.core ? "Core Engineering" : "Product & SaaS",
          location: LOCATIONS[Math.floor(rand() * LOCATIONS.length)]!,
          salary: Math.max(2.2, salary),
          timeToEmployment: Math.max(1, Math.round(p.ttm * (0.8 + rand()))),
          degreeRelevance: rand() < 0.5 ? "Moderate" : "Low",
          higherStudies: null,
        });
      } else {
        out.push({
          id,
          name,
          department: dept,
          graduationYear: year,
          cgpa,
          internship,
          employmentStatus: status,
          company: null,
          role: null,
          industry: null,
          location: LOCATIONS[Math.floor(rand() * LOCATIONS.length)]!,
          salary: null,
          timeToEmployment: null,
          degreeRelevance: "Not Applicable",
          higherStudies: null,
        });
      }
    }
  }

  return out;
}

export const GRADUATES: Graduate[] = build();
