import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { AgreementFormValues } from "@/lib/schema";

interface PersonFieldsProps {
  prefix: "landlord" | "tenant";
  register: UseFormRegister<AgreementFormValues>;
  errors: FieldErrors<AgreementFormValues>;
}

export function PersonFields({ prefix, register, errors }: PersonFieldsProps) {
  const personErrors = errors[prefix];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Input
        label="Full Name"
        placeholder="e.g. Rajesh Kumar Sharma"
        {...register(`${prefix}.fullName`)}
        error={personErrors?.fullName?.message}
      />
      <Input
        label="Father's / Guardian's Name"
        placeholder="e.g. Suresh Sharma"
        {...register(`${prefix}.fatherName`)}
        error={personErrors?.fatherName?.message}
      />
      <div className="sm:col-span-2">
        <Textarea
          label="Permanent Address"
          placeholder="Full address with city and pincode"
          {...register(`${prefix}.address`)}
          error={personErrors?.address?.message}
        />
      </div>
      <Input
        label="Mobile Number"
        placeholder="10-digit mobile number"
        maxLength={10}
        {...register(`${prefix}.phone`)}
        error={personErrors?.phone?.message}
      />
      <Input
        label="Email Address"
        type="email"
        placeholder="email@example.com"
        {...register(`${prefix}.email`)}
        error={personErrors?.email?.message}
      />
      <Input
        label="PAN (Optional)"
        placeholder="ABCDE1234F"
        {...register(`${prefix}.pan`)}
        error={personErrors?.pan?.message}
      />
      <Input
        label="Aadhaar (Optional)"
        placeholder="12-digit Aadhaar number"
        maxLength={12}
        {...register(`${prefix}.aadhaar`)}
        error={personErrors?.aadhaar?.message}
      />
    </div>
  );
}