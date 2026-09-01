import { useSyncExternalStore } from "react";

import { GRADUATES, type Graduate } from "./graduates";

/**
 * Active dataset store.
 *
 * Frontend-only for now: the dashboard, explorer and insights pages all read
 * from here, so swapping this module for a real API-backed store later does
 * not require touching any page.
 */
export type DatasetSource = "demo" | "upload";

export type DatasetState = {
  rows: Graduate[];
  source: DatasetSource;
  label: string;
  updatedAt: string | null;
};

const DEMO_STATE: DatasetState = {
  rows: GRADUATES,
  source: "demo",
  label: "Demo Dataset",
  updatedAt: null,
};

let state: DatasetState = DEMO_STATE;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setUploadedDataset(rows: Graduate[], fileName: string) {
  state = {
    rows,
    source: "upload",
    label: fileName,
    updatedAt: new Date().toISOString(),
  };
  emit();
}

export function resetToDemoDataset() {
  state = DEMO_STATE;
  emit();
}

export function getDatasetState(): DatasetState {
  return state;
}

export function useDataset(): DatasetState {
  return useSyncExternalStore(subscribe, getDatasetState, () => DEMO_STATE);
}

/** Filter option values derived from whatever dataset is active. */
export function datasetOptions(rows: Graduate[]) {
  const uniq = <T,>(vals: T[]) => Array.from(new Set(vals));
  return {
    years: uniq(rows.map((g) => g.graduationYear)).sort((a, b) => a - b),
    departments: uniq(rows.map((g) => g.department)).sort(),
    statuses: uniq(rows.map((g) => g.employmentStatus)).sort(),
    industries: uniq(
      rows.map((g) => g.industry).filter((i): i is string => Boolean(i)),
    ).sort(),
  };
}
