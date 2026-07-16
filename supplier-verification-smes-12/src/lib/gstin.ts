const GSTIN_REGEX =
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

export function validateGSTIN(gstin: string): {
  valid: boolean;
  error?: string;
} {
  const normalized = gstin.trim().toUpperCase();

  if (!normalized) {
    return { valid: false, error: "GSTIN is required" };
  }

  if (normalized.length !== 15) {
    return {
      valid: false,
      error: `GSTIN must be exactly 15 characters (got ${normalized.length})`,
    };
  }

  if (!GSTIN_REGEX.test(normalized)) {
    return {
      valid: false,
      error:
        "Invalid GSTIN format. Expected: 2 digits + PAN (10 chars) + entity + Z + checksum",
    };
  }

  return { valid: true };
}

export function normalizeGSTIN(gstin: string): string {
  return gstin.trim().toUpperCase();
}