import type { AgreementFormData } from "./types";

const STORAGE_KEY = "rent-agreement-form-data";

export function saveAgreementData(data: AgreementFormData): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadAgreementData(): AgreementFormData | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AgreementFormData;
  } catch {
    return null;
  }
}

export function clearAgreementData(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}