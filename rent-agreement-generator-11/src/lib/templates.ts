import type { AgreementFormData, StateClausePreset } from "./types";

export const STATE_CLAUSE_PRESETS: Record<
  AgreementFormData["state"],
  StateClausePreset
> = {
  Maharashtra: {
    state: "Maharashtra",
    stampDutyNote:
      "As per the Maharashtra Stamp Act, leave and licence agreements are typically stamped at 0.25% of the total rent plus deposit for agreements up to 60 months, payable within the state.",
    registrationNote:
      "Registration with the Sub-Registrar is mandatory if the agreement period exceeds 11 months. For shorter periods, notarisation is commonly accepted.",
    additionalClauses: [
      "The Licensor shall pay property tax and society maintenance as applicable, unless otherwise agreed in writing.",
      "The Licensee shall not sub-let, assign, or part with possession of the premises without prior written consent of the Licensor.",
      "The premises shall be used solely for residential purposes and not for any commercial or illegal activity.",
      "Any structural alterations to the premises require prior written approval from the Licensor.",
    ],
    jurisdictionCourt: "Courts at Mumbai / Pune, as applicable",
  },
  Karnataka: {
    state: "Karnataka",
    stampDutyNote:
      "Under the Karnataka Stamp Act, rental agreements attract stamp duty based on the total rent and deposit amount for the lease term.",
    registrationNote:
      "Agreements exceeding 11 months should be registered with the Sub-Registrar. Stamp paper of appropriate value must be used.",
    additionalClauses: [
      "The Tenant shall comply with all bye-laws of the apartment owners' association, if applicable.",
      "Electricity, water, gas, and internet charges shall be borne by the Tenant unless expressly stated otherwise.",
      "The Tenant shall maintain the premises in good condition and return it in the same state, fair wear and tear excepted.",
      "Parking facilities, if provided, shall be used only for the Tenant's personal vehicle.",
    ],
    jurisdictionCourt: "Courts at Bengaluru / respective district headquarters",
  },
  Delhi: {
    state: "Delhi",
    stampDutyNote:
      "Delhi rental agreements require stamp duty at 2% of the average annual rent for agreements up to 5 years, plus registration charges.",
    registrationNote:
      "Registration is mandatory for all rental agreements in Delhi under the Registration Act, 1908. Both parties must be present or represented by power of attorney.",
    additionalClauses: [
      "The Tenant shall not cause nuisance to neighbours and shall abide by Delhi Rent Control norms where applicable.",
      "The Landlord shall provide a rent receipt for every payment made by the Tenant.",
      "Any increase in rent during the tenancy shall be as per mutual agreement and applicable law.",
      "The Tenant shall not keep hazardous or inflammable materials on the premises.",
    ],
    jurisdictionCourt: "Courts at New Delhi / Delhi",
  },
  "Tamil Nadu": {
    state: "Tamil Nadu",
    stampDutyNote:
      "Tamil Nadu stamp duty on rental agreements is calculated on the total rent and deposit for the lease period as per the Indian Stamp Act applicable to the state.",
    registrationNote:
      "Registration is recommended for agreements beyond 11 months. Notarised agreements are accepted for shorter durations.",
    additionalClauses: [
      "The Tenant shall pay electricity and water charges directly to the concerned authorities.",
      "The Landlord shall be responsible for major structural repairs; minor repairs shall be borne by the Tenant.",
      "The premises shall not be used for any purpose other than residential accommodation.",
      "Either party may terminate the agreement by giving notice as specified herein, subject to lock-in provisions.",
    ],
    jurisdictionCourt: "Courts at Chennai / respective district headquarters",
  },
  Gujarat: {
    state: "Gujarat",
    stampDutyNote:
      "Gujarat levies stamp duty on rental agreements based on the aggregate rent and security deposit for the full term of the agreement.",
    registrationNote:
      "Registration with the Sub-Registrar is advised for agreements exceeding 11 months to ensure enforceability.",
    additionalClauses: [
      "The Tenant shall not make any permanent fixtures without written consent of the Landlord.",
      "Society charges and maintenance, if not included in rent, shall be paid by the Tenant.",
      "The Landlord shall ensure peaceful possession of the premises at the commencement of the tenancy.",
      "Disputes shall first be attempted to be resolved through mutual discussion before legal recourse.",
    ],
    jurisdictionCourt: "Courts at Ahmedabad / respective district headquarters",
  },
  "West Bengal": {
    state: "West Bengal",
    stampDutyNote:
      "Stamp duty in West Bengal for rental agreements is payable on the total consideration including rent and deposit for the lease period.",
    registrationNote:
      "Registration is mandatory for tenancy agreements exceeding one year under the West Bengal Premises Tenancy Act.",
    additionalClauses: [
      "The Tenant shall comply with the West Bengal Premises Tenancy Act, 1997, where applicable.",
      "The Landlord shall not unreasonably withhold consent for essential repairs requested by the Tenant.",
      "Rent receipts shall be issued within 7 days of receipt of rent payment.",
      "The Tenant shall permit the Landlord to inspect the premises with 24 hours prior notice.",
    ],
    jurisdictionCourt: "Courts at Kolkata / respective district headquarters",
  },
  Telangana: {
    state: "Telangana",
    stampDutyNote:
      "Telangana stamp duty on leave and licence agreements is calculated on the total licence fee and deposit for the agreement period.",
    registrationNote:
      "Registration is recommended for agreements beyond 11 months. Stamp paper must be purchased in Telangana.",
    additionalClauses: [
      "The Licensee shall not use the premises for any unlawful purpose.",
      "The Licensor shall hand over the premises in habitable condition with all agreed fixtures.",
      "Monthly licence fee shall be paid by the 5th of every month unless otherwise specified.",
      "Either party shall provide written notice before termination as per the notice period herein.",
    ],
    jurisdictionCourt: "Courts at Hyderabad / respective district headquarters",
  },
  "Uttar Pradesh": {
    state: "Uttar Pradesh",
    stampDutyNote:
      "UP rental agreements require stamp duty based on annual rent. Stamp paper of appropriate denomination must be used.",
    registrationNote:
      "Registration with the Sub-Registrar is mandatory for agreements exceeding 11 months in Uttar Pradesh.",
    additionalClauses: [
      "The Tenant shall abide by all municipal and housing society rules applicable to the premises.",
      "The Landlord shall be responsible for property tax; the Tenant shall bear utility charges.",
      "No pets shall be kept on the premises without prior written consent of the Landlord.",
      "The Tenant shall not make structural changes to the property.",
    ],
    jurisdictionCourt: "Courts at Lucknow / Noida / respective district headquarters",
  },
  Rajasthan: {
    state: "Rajasthan",
    stampDutyNote:
      "Rajasthan stamp duty on rental agreements is payable on the total rent and security deposit for the lease term.",
    registrationNote:
      "Notarisation is common for agreements up to 11 months; registration is advised for longer terms.",
    additionalClauses: [
      "The Tenant shall maintain cleanliness and hygiene of the premises.",
      "The Landlord shall provide basic amenities as agreed at the time of handover.",
      "Rent shall be revised only upon renewal and with mutual written consent.",
      "The Tenant shall vacate the premises upon expiry or termination of this agreement.",
    ],
    jurisdictionCourt: "Courts at Jaipur / respective district headquarters",
  },
  Kerala: {
    state: "Kerala",
    stampDutyNote:
      "Kerala stamp duty on rental agreements is calculated on the aggregate rent and deposit amount for the full lease period.",
    registrationNote:
      "Registration is recommended for tenancy agreements exceeding 11 months under the Kerala Registration Act.",
    additionalClauses: [
      "The Tenant shall comply with the Kerala Municipality Act and building rules where applicable.",
      "The Landlord shall bear property tax; utility bills shall be paid by the Tenant.",
      "The premises shall be used only for residential purposes by the Tenant and immediate family.",
      "Any dispute shall be subject to the exclusive jurisdiction of courts in Kerala.",
    ],
    jurisdictionCourt: "Courts at Kochi / Thiruvananthapuram / respective district headquarters",
  },
};

export function getStatePreset(state: AgreementFormData["state"]): StateClausePreset {
  return STATE_CLAUSE_PRESETS[state];
}

export const PROPERTY_TYPE_LABELS: Record<
  AgreementFormData["property"]["propertyType"],
  string
> = {
  apartment: "Apartment / Flat",
  independent_house: "Independent House",
  villa: "Villa",
  studio: "Studio Apartment",
  other: "Other",
};

export const FURNISHING_LABELS: Record<
  AgreementFormData["property"]["furnishing"],
  string
> = {
  unfurnished: "Unfurnished",
  semi_furnished: "Semi-Furnished",
  fully_furnished: "Fully Furnished",
};