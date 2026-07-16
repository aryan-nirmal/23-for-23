"use client";

import { useState } from "react";
import { useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { StepIndicator } from "@/components/StepIndicator";
import { PersonFields } from "@/components/PersonFields";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { agreementSchema, type AgreementFormValues } from "@/lib/schema";
import { INDIAN_STATES } from "@/lib/types";
import { getStatePreset } from "@/lib/templates";
import { saveAgreementData } from "@/lib/storage";

const DEFAULT_VALUES: AgreementFormValues = {
  state: "Maharashtra",
  landlord: {
    fullName: "",
    fatherName: "",
    address: "",
    phone: "",
    email: "",
    pan: "",
    aadhaar: "",
  },
  tenant: {
    fullName: "",
    fatherName: "",
    address: "",
    phone: "",
    email: "",
    pan: "",
    aadhaar: "",
  },
  property: {
    address: "",
    city: "",
    pincode: "",
    propertyType: "apartment",
    furnishing: "semi_furnished",
    areaSqFt: "",
    bedrooms: "",
    bathrooms: "",
  },
  rent: {
    monthlyRent: 0,
    securityDeposit: 0,
    maintenanceCharges: 0,
    startDate: "",
    durationMonths: 11,
    noticePeriodDays: 30,
    rentDueDay: 5,
    lockInMonths: 0,
  },
};

export function AgreementForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<AgreementFormValues>({
    resolver: zodResolver(agreementSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onBlur",
  });

  const selectedState = watch("state");
  const statePreset = getStatePreset(selectedState);

  async function goNext() {
    const fieldsToValidate = getFieldsForStep(step);
    const valid = await trigger(fieldsToValidate);
    if (valid) setStep((s) => Math.min(s + 1, 5));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 1));
  }

  function onSubmit(data: AgreementFormValues) {
    saveAgreementData(data);
    router.push("/preview");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-3xl">
      <StepIndicator currentStep={step} />

      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Select State
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Choose the state where the property is located. Clause presets
              will be tailored accordingly.
            </p>
          </div>
          <Select
            label="State"
            options={INDIAN_STATES.map((s) => ({ value: s, label: s }))}
            {...register("state")}
            error={errors.state?.message}
          />
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <div>
                <p className="text-sm font-medium text-emerald-900">
                  {selectedState} — State-Specific Notes
                </p>
                <p className="mt-1 text-sm text-emerald-800">
                  {statePreset.stampDutyNote}
                </p>
                <p className="mt-2 text-sm text-emerald-700">
                  {statePreset.registrationNote}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Landlord Details
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Enter the property owner&apos;s information.
            </p>
          </div>
          <PersonFields prefix="landlord" register={register} errors={errors} />
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Tenant Details
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Enter the tenant&apos;s information.
            </p>
          </div>
          <PersonFields prefix="tenant" register={register} errors={errors} />
        </div>
      )}

      {step === 4 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Property Details
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Describe the residential property being rented.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Textarea
                label="Property Address"
                placeholder="Flat/House number, building, street, locality"
                {...register("property.address")}
                error={errors.property?.address?.message}
              />
            </div>
            <Input
              label="City"
              placeholder="e.g. Mumbai"
              {...register("property.city")}
              error={errors.property?.city?.message}
            />
            <Input
              label="Pincode"
              placeholder="6-digit pincode"
              maxLength={6}
              {...register("property.pincode")}
              error={errors.property?.pincode?.message}
            />
            <Select
              label="Property Type"
              options={[
                { value: "apartment", label: "Apartment / Flat" },
                { value: "independent_house", label: "Independent House" },
                { value: "villa", label: "Villa" },
                { value: "studio", label: "Studio Apartment" },
                { value: "other", label: "Other" },
              ]}
              {...register("property.propertyType")}
              error={errors.property?.propertyType?.message}
            />
            <Select
              label="Furnishing"
              options={[
                { value: "unfurnished", label: "Unfurnished" },
                { value: "semi_furnished", label: "Semi-Furnished" },
                { value: "fully_furnished", label: "Fully Furnished" },
              ]}
              {...register("property.furnishing")}
              error={errors.property?.furnishing?.message}
            />
            <Input
              label="Area (sq. ft.) — Optional"
              placeholder="e.g. 1200"
              {...register("property.areaSqFt")}
            />
            <Input
              label="Bedrooms — Optional"
              placeholder="e.g. 2"
              {...register("property.bedrooms")}
            />
            <Input
              label="Bathrooms — Optional"
              placeholder="e.g. 2"
              {...register("property.bathrooms")}
            />
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Rent Terms</h2>
            <p className="mt-1 text-sm text-slate-500">
              Set the financial terms and duration of the agreement.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Monthly Rent (₹)"
              type="number"
              min={1}
              placeholder="e.g. 25000"
              {...register("rent.monthlyRent", { valueAsNumber: true })}
              error={errors.rent?.monthlyRent?.message}
            />
            <Input
              label="Security Deposit (₹)"
              type="number"
              min={0}
              placeholder="e.g. 50000"
              {...register("rent.securityDeposit", { valueAsNumber: true })}
              error={errors.rent?.securityDeposit?.message}
            />
            <Input
              label="Monthly Maintenance (₹)"
              type="number"
              min={0}
              placeholder="0 if not applicable"
              {...register("rent.maintenanceCharges", { valueAsNumber: true })}
              error={errors.rent?.maintenanceCharges?.message}
            />
            <Input
              label="Agreement Start Date"
              type="date"
              {...register("rent.startDate")}
              error={errors.rent?.startDate?.message}
            />
            <Input
              label="Duration (months)"
              type="number"
              min={1}
              max={60}
              {...register("rent.durationMonths", { valueAsNumber: true })}
              error={errors.rent?.durationMonths?.message}
            />
            <Input
              label="Notice Period (days)"
              type="number"
              min={15}
              max={90}
              {...register("rent.noticePeriodDays", { valueAsNumber: true })}
              error={errors.rent?.noticePeriodDays?.message}
            />
            <Input
              label="Rent Due Day (1–28)"
              type="number"
              min={1}
              max={28}
              {...register("rent.rentDueDay", { valueAsNumber: true })}
              error={errors.rent?.rentDueDay?.message}
            />
            <Input
              label="Lock-in Period (months)"
              type="number"
              min={0}
              max={24}
              {...register("rent.lockInMonths", { valueAsNumber: true })}
              error={errors.rent?.lockInMonths?.message}
            />
          </div>
        </div>
      )}

      <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={goBack}
          disabled={step === 1}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        {step < 5 ? (
          <Button type="button" onClick={goNext}>
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button type="submit">
            Preview Agreement
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </form>
  );
}

function getFieldsForStep(step: number): FieldPath<AgreementFormValues>[] {
  switch (step) {
    case 1:
      return ["state"];
    case 2:
      return [
        "landlord.fullName",
        "landlord.fatherName",
        "landlord.address",
        "landlord.phone",
        "landlord.email",
        "landlord.pan",
        "landlord.aadhaar",
      ];
    case 3:
      return [
        "tenant.fullName",
        "tenant.fatherName",
        "tenant.address",
        "tenant.phone",
        "tenant.email",
        "tenant.pan",
        "tenant.aadhaar",
      ];
    case 4:
      return [
        "property.address",
        "property.city",
        "property.pincode",
        "property.propertyType",
        "property.furnishing",
      ];
    case 5:
      return [
        "rent.monthlyRent",
        "rent.securityDeposit",
        "rent.maintenanceCharges",
        "rent.startDate",
        "rent.durationMonths",
        "rent.noticePeriodDays",
        "rent.rentDueDay",
        "rent.lockInMonths",
      ];
    default:
      return [];
  }
}