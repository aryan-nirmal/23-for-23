# Rent Agreement Generator

A Next.js app for generating Indian residential rent agreements with state-specific clause presets, multi-step form input, live preview, and PDF download.

## Features

- **Landing page** — Overview of the tool with supported states and how-it-works guide
- **Multi-step form** (`/create`) — State selection, landlord details, tenant details, property details, and rent terms
- **State-specific clauses** — Presets for Maharashtra, Karnataka, Delhi, Tamil Nadu, Gujarat, West Bengal, Telangana, Uttar Pradesh, Rajasthan, and Kerala
- **Agreement preview** (`/preview`) — Full merged agreement with all entered data
- **PDF download** — Export the agreement as a formatted PDF via jsPDF

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [react-hook-form](https://react-hook-form.com/) + [Zod](https://zod.dev/) for form validation
- [jsPDF](https://github.com/parallax/jsPDF) for PDF generation
- [lucide-react](https://lucide.dev/) for icons

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Landing page
│   ├── create/page.tsx   # Multi-step agreement form
│   └── preview/page.tsx  # Agreement preview & PDF download
├── components/
│   ├── AgreementForm.tsx
│   ├── AgreementPreview.tsx
│   ├── Header.tsx
│   ├── PersonFields.tsx
│   ├── StepIndicator.tsx
│   └── ui/               # Reusable form components
└── lib/
    ├── templates.ts      # State-specific clause presets
    ├── schema.ts         # Zod validation schemas
    ├── generate-agreement.ts
    ├── pdf.ts            # PDF export
    ├── storage.ts        # Session storage helpers
    └── types.ts
```

## Usage

1. Visit the landing page and click **Create Agreement**
2. Select the state where the property is located
3. Fill in landlord and tenant details
4. Enter property address, type, and furnishing
5. Set monthly rent, security deposit, duration, and notice period
6. Preview the generated agreement
7. Download as PDF for printing on stamp paper

## Supported States

Maharashtra · Karnataka · Delhi · Tamil Nadu · Gujarat · West Bengal · Telangana · Uttar Pradesh · Rajasthan · Kerala

## Disclaimer

This tool generates **draft** rent agreements for informational purposes only. It does not constitute legal advice. Consult a qualified advocate and ensure proper stamp duty payment and registration per your state's laws before executing the agreement.

## Build

```bash
npm run build
npm start
```