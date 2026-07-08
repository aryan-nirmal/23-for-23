import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PulsePrompt | Medication Reminder with WhatsApp",
  description:
    "A caregiver-first medication reminder system with mock WhatsApp flows, escalation logic, and adherence summaries.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
