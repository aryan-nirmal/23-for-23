import { z } from "zod";
import { INDIAN_STATES } from "./types";

const personSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  fatherName: z.string().min(2, "Father's / guardian's name is required"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  email: z.string().email("Enter a valid email address"),
  pan: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Enter a valid PAN (e.g. ABCDE1234F)")
    .optional()
    .or(z.literal("")),
  aadhaar: z
    .string()
    .regex(/^\d{12}$/, "Enter a valid 12-digit Aadhaar number")
    .optional()
    .or(z.literal("")),
});

const propertySchema = z.object({
  address: z.string().min(10, "Property address is required"),
  city: z.string().min(2, "City is required"),
  pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
  propertyType: z.enum([
    "apartment",
    "independent_house",
    "villa",
    "studio",
    "other",
  ]),
  furnishing: z.enum(["unfurnished", "semi_furnished", "fully_furnished"]),
  areaSqFt: z.string().optional(),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
});

const rentSchema = z.object({
  monthlyRent: z.number().min(1, "Monthly rent is required"),
  securityDeposit: z.number().min(0, "Security deposit is required"),
  maintenanceCharges: z.number().min(0, "Enter 0 if not applicable"),
  startDate: z.string().min(1, "Start date is required"),
  durationMonths: z
    .number()
    .min(1, "Duration must be at least 1 month")
    .max(60, "Duration cannot exceed 60 months"),
  noticePeriodDays: z
    .number()
    .min(15, "Notice period must be at least 15 days")
    .max(90, "Notice period cannot exceed 90 days"),
  rentDueDay: z
    .number()
    .min(1, "Rent due day must be between 1 and 28")
    .max(28, "Rent due day must be between 1 and 28"),
  lockInMonths: z
    .number()
    .min(0, "Lock-in period cannot be negative")
    .max(24, "Lock-in period cannot exceed 24 months"),
});

export const stateSchema = z.object({
  state: z.enum(INDIAN_STATES),
});

export const landlordSchema = z.object({
  landlord: personSchema,
});

export const tenantSchema = z.object({
  tenant: personSchema,
});

export const propertyFormSchema = z.object({
  property: propertySchema,
});

export const rentFormSchema = z.object({
  rent: rentSchema,
});

export const agreementSchema = z.object({
  state: z.enum(INDIAN_STATES),
  landlord: personSchema,
  tenant: personSchema,
  property: propertySchema,
  rent: rentSchema,
});

export type StateFormValues = z.infer<typeof stateSchema>;
export type LandlordFormValues = z.infer<typeof landlordSchema>;
export type TenantFormValues = z.infer<typeof tenantSchema>;
export type PropertyFormValues = z.infer<typeof propertyFormSchema>;
export type RentFormValues = z.infer<typeof rentFormSchema>;
export type AgreementFormValues = z.infer<typeof agreementSchema>;