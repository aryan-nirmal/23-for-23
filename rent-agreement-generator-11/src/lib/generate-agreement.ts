import {
  FURNISHING_LABELS,
  getStatePreset,
  PROPERTY_TYPE_LABELS,
} from "./templates";
import type { AgreementFormData } from "./types";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function addMonths(dateStr: string, months: number): string {
  const date = new Date(dateStr);
  date.setMonth(date.getMonth() + months);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function numberToWords(num: number): string {
  if (num === 0) return "Zero";

  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  function convert(n: number): string {
    if (n < 20) return ones[n];
    if (n < 100)
      return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    if (n < 1000)
      return (
        ones[Math.floor(n / 100)] +
        " Hundred" +
        (n % 100 ? " " + convert(n % 100) : "")
      );
    if (n < 100000)
      return (
        convert(Math.floor(n / 1000)) +
        " Thousand" +
        (n % 1000 ? " " + convert(n % 1000) : "")
      );
    if (n < 10000000)
      return (
        convert(Math.floor(n / 100000)) +
        " Lakh" +
        (n % 100000 ? " " + convert(n % 100000) : "")
      );
    return (
      convert(Math.floor(n / 10000000)) +
      " Crore" +
      (n % 10000000 ? " " + convert(n % 10000000) : "")
    );
  }

  return convert(num) + " Rupees Only";
}

export interface AgreementSection {
  title: string;
  content: string;
}

export function generateAgreement(data: AgreementFormData): AgreementSection[] {
  const preset = getStatePreset(data.state);
  const endDate = addMonths(data.rent.startDate, data.rent.durationMonths);
  const totalRent = data.rent.monthlyRent * data.rent.durationMonths;

  const sections: AgreementSection[] = [
    {
      title: "RESIDENTIAL RENT AGREEMENT",
      content: `This Rent Agreement ("Agreement") is executed on ${formatDate(data.rent.startDate)} at ${data.property.city}, ${data.state}, India, between the parties named below.`,
    },
    {
      title: "1. PARTIES",
      content: `LANDLORD / LICENSOR
Name: ${data.landlord.fullName}
Father's Name: ${data.landlord.fatherName}
Address: ${data.landlord.address}
Phone: ${data.landlord.phone}
Email: ${data.landlord.email}${data.landlord.pan ? `\nPAN: ${data.landlord.pan}` : ""}${data.landlord.aadhaar ? `\nAadhaar: ${data.landlord.aadhaar}` : ""}

TENANT / LICENSEE
Name: ${data.tenant.fullName}
Father's Name: ${data.tenant.fatherName}
Address: ${data.tenant.address}
Phone: ${data.tenant.phone}
Email: ${data.tenant.email}${data.tenant.pan ? `\nPAN: ${data.tenant.pan}` : ""}${data.tenant.aadhaar ? `\nAadhaar: ${data.tenant.aadhaar}` : ""}`,
    },
    {
      title: "2. PROPERTY DETAILS",
      content: `The Landlord hereby lets and the Tenant hereby takes on rent the residential property described below:

Address: ${data.property.address}
City: ${data.property.city}
State: ${data.state}
Pincode: ${data.property.pincode}
Property Type: ${PROPERTY_TYPE_LABELS[data.property.propertyType]}
Furnishing: ${FURNISHING_LABELS[data.property.furnishing]}${data.property.areaSqFt ? `\nArea: ${data.property.areaSqFt} sq. ft.` : ""}${data.property.bedrooms ? `\nBedrooms: ${data.property.bedrooms}` : ""}${data.property.bathrooms ? `\nBathrooms: ${data.property.bathrooms}` : ""}`,
    },
    {
      title: "3. RENT AND DEPOSIT",
      content: `Monthly Rent: ${formatCurrency(data.rent.monthlyRent)} (${numberToWords(data.rent.monthlyRent)})
Security Deposit: ${formatCurrency(data.rent.securityDeposit)} (${numberToWords(data.rent.securityDeposit)})
Maintenance Charges: ${formatCurrency(data.rent.maintenanceCharges)} per month
Total Rent for ${data.rent.durationMonths} months: ${formatCurrency(totalRent)}

The monthly rent shall be paid on or before the ${data.rent.rentDueDay}${getOrdinal(data.rent.rentDueDay)} day of each calendar month through bank transfer, UPI, or cheque as mutually agreed.`,
    },
    {
      title: "4. TERM AND NOTICE",
      content: `Commencement Date: ${formatDate(data.rent.startDate)}
End Date: ${endDate}
Duration: ${data.rent.durationMonths} months
Lock-in Period: ${data.rent.lockInMonths} months
Notice Period: ${data.rent.noticePeriodDays} days

Either party may terminate this Agreement by giving ${data.rent.noticePeriodDays} days' written notice to the other party, subject to the lock-in period of ${data.rent.lockInMonths} months. Upon termination, the Tenant shall vacate the premises and the Landlord shall refund the security deposit after deducting any dues or damages.`,
    },
    {
      title: "5. OBLIGATIONS OF THE TENANT",
      content: `The Tenant agrees to:
• Pay rent and maintenance charges on time as specified herein.
• Use the premises solely for residential purposes.
• Not sub-let or assign the premises without written consent of the Landlord.
• Maintain the premises in good condition and report any damage promptly.
• Allow the Landlord to inspect the premises with reasonable prior notice.
• Comply with all applicable laws, society rules, and municipal regulations.
• Hand over peaceful possession of the premises upon expiry or termination.`,
    },
    {
      title: "6. OBLIGATIONS OF THE LANDLORD",
      content: `The Landlord agrees to:
• Provide peaceful and vacant possession of the premises on the commencement date.
• Not interfere with the Tenant's quiet enjoyment of the premises.
• Carry out major structural repairs at the Landlord's cost.
• Provide rent receipts for all payments received.
• Refund the security deposit within 30 days of vacating, subject to lawful deductions.`,
    },
    {
      title: `7. STATE-SPECIFIC CLAUSES (${data.state})`,
      content: `${preset.additionalClauses.map((clause, i) => `${i + 1}. ${clause}`).join("\n")}`,
    },
    {
      title: "8. STAMP DUTY AND REGISTRATION",
      content: `Stamp Duty: ${preset.stampDutyNote}

Registration: ${preset.registrationNote}

The parties acknowledge that this Agreement must be executed on appropriate stamp paper and registered/notarised as required by the laws of ${data.state}.`,
    },
    {
      title: "9. DISPUTE RESOLUTION AND JURISDICTION",
      content: `Any dispute arising out of or in connection with this Agreement shall be subject to the exclusive jurisdiction of the ${preset.jurisdictionCourt}.

The parties agree to attempt amicable resolution through mutual discussion before initiating legal proceedings.`,
    },
    {
      title: "10. SIGNATURES",
      content: `IN WITNESS WHEREOF, the parties have executed this Agreement on the date first written above.

___________________________          ___________________________
LANDLORD: ${data.landlord.fullName}          TENANT: ${data.tenant.fullName}

Date: _______________                Date: _______________

WITNESS 1: _______________           WITNESS 2: _______________`,
    },
  ];

  return sections;
}

function getOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

export function generatePlainText(data: AgreementFormData): string {
  return generateAgreement(data)
    .map((section) => `${section.title}\n\n${section.content}`)
    .join("\n\n---\n\n");
}