import type { SupplierData } from "./types";
import { normalizeGSTIN } from "./gstin";

const INDIAN_STATES: Record<string, string> = {
  "01": "Jammu & Kashmir",
  "02": "Himachal Pradesh",
  "03": "Punjab",
  "04": "Chandigarh",
  "05": "Uttarakhand",
  "06": "Haryana",
  "07": "Delhi",
  "08": "Rajasthan",
  "09": "Uttar Pradesh",
  "10": "Bihar",
  "11": "Sikkim",
  "12": "Arunachal Pradesh",
  "13": "Nagaland",
  "14": "Manipur",
  "15": "Mizoram",
  "16": "Tripura",
  "17": "Meghalaya",
  "18": "Assam",
  "19": "West Bengal",
  "20": "Jharkhand",
  "21": "Odisha",
  "22": "Chhattisgarh",
  "23": "Madhya Pradesh",
  "24": "Gujarat",
  "26": "Dadra & Nagar Haveli and Daman & Diu",
  "27": "Maharashtra",
  "29": "Karnataka",
  "30": "Goa",
  "31": "Lakshadweep",
  "32": "Kerala",
  "33": "Tamil Nadu",
  "34": "Puducherry",
  "35": "Andaman & Nicobar Islands",
  "36": "Telangana",
  "37": "Andhra Pradesh",
  "38": "Ladakh",
};

const BUSINESS_PREFIXES = [
  "Shree",
  "Bharat",
  "Apex",
  "Prime",
  "Global",
  "Metro",
  "Sunrise",
  "Heritage",
  "Nova",
  "Elite",
];

const BUSINESS_SUFFIXES = [
  "Traders Pvt Ltd",
  "Industries",
  "Enterprises",
  "Manufacturing Co",
  "Exports",
  "Suppliers",
  "Distributors",
  "Works",
  "Solutions",
  "Commodities",
];

function hashGSTIN(gstin: string): number {
  let hash = 0;
  for (let i = 0; i < gstin.length; i++) {
    hash = (hash * 31 + gstin.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function seededValue(hash: number, seed: number, min: number, max: number): number {
  const val = ((hash * seed) % 1000) / 1000;
  return Math.round((min + val * (max - min)) * 10) / 10;
}

export function generateMockSupplier(gstin: string): SupplierData {
  const normalized = normalizeGSTIN(gstin);
  const hash = hashGSTIN(normalized);
  const stateCode = normalized.slice(0, 2);
  const state = INDIAN_STATES[stateCode] ?? "Unknown State";

  const prefixIdx = hash % BUSINESS_PREFIXES.length;
  const suffixIdx = (hash >> 4) % BUSINESS_SUFFIXES.length;
  const businessName = `${BUSINESS_PREFIXES[prefixIdx]} ${BUSINESS_SUFFIXES[suffixIdx]}`;

  const statusRoll = hash % 10;
  const status: SupplierData["status"] =
    statusRoll < 7 ? "Active" : statusRoll < 9 ? "Suspended" : "Cancelled";

  const yearOffset = (hash % 8) + 2016;
  const month = (hash % 12) + 1;
  const day = (hash % 28) + 1;
  const registrationDate = `${yearOffset}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const deliveryScore = seededValue(hash, 7, 55, 98);
  const paymentReliability = seededValue(hash, 13, 50, 97);

  return {
    gstin: normalized,
    businessName,
    state,
    status,
    registrationDate,
    deliveryScore,
    paymentReliability,
  };
}