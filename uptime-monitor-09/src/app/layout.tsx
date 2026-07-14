import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "PingWatch — Uptime Monitoring for Indie Hackers",
  description: "Know when your site goes down before your users do. Simple, fast uptime monitoring with Slack and email alerts.",
  keywords: ["uptime monitor", "website monitoring", "indie hacker", "status page"],
  openGraph: {
    title: "PingWatch — Uptime Monitoring for Indie Hackers",
    description: "Know when your site goes down before your users do.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-gray-950 text-gray-100`}>
        {children}
      </body>
    </html>
  );
}
