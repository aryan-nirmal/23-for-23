import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "RestPath — Non-Prescription Sleep Solution Finder",
  description:
    "Take a personalized sleep quiz, get evidence-informed recommendations, and track your progress with a 2-week sleep diary.",
  keywords: [
    "sleep quiz",
    "insomnia",
    "sleep hygiene",
    "CBT-I",
    "sleep diary",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased bg-slate-950 text-slate-100 min-h-screen`}
      >
        <Nav />
        {children}
      </body>
    </html>
  );
}