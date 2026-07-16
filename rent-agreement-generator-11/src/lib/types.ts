export const INDIAN_STATES = [
  "Maharashtra",
  "Karnataka",
  "Delhi",
  "Tamil Nadu",
  "Gujarat",
  "West Bengal",
  "Telangana",
  "Uttar Pradesh",
  "Rajasthan",
  "Kerala",
] as const;

export type IndianState = (typeof INDIAN_STATES)[number];

export interface PersonDetails {
  fullName: string;
  fatherName: string;
  address: string;
  phone: string;
  email: string;
  pan?: string;
  aadhaar?: string;
}

export interface PropertyDetails {
  address: string;
  city: string;
  pincode: string;
  propertyType: "apartment" | "independent_house" | "villa" | "studio" | "other";
  furnishing: "unfurnished" | "semi_furnished" | "fully_furnished";
  areaSqFt?: string;
  bedrooms?: string;
  bathrooms?: string;
}

export interface RentTerms {
  monthlyRent: number;
  securityDeposit: number;
  maintenanceCharges: number;
  startDate: string;
  durationMonths: number;
  noticePeriodDays: number;
  rentDueDay: number;
  lockInMonths: number;
}

export interface AgreementFormData {
  state: IndianState;
  landlord: PersonDetails;
  tenant: PersonDetails;
  property: PropertyDetails;
  rent: RentTerms;
}

export interface StateClausePreset {
  state: IndianState;
  stampDutyNote: string;
  registrationNote: string;
  additionalClauses: string[];
  jurisdictionCourt: string;
}