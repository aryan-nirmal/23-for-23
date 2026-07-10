import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FileText, Home, Users } from "lucide-react";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Micro-SME Invoice Manager",
  description: "Simple invoicing and payment tracking for micro-businesses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground antialiased pb-20 md:pb-0`}>
        <div className="flex flex-col min-h-screen">
          <header className="px-4 py-3 bg-white border-b border-card-border sticky top-0 z-50 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-primary-600 flex items-center justify-center text-white font-bold">
                M
              </div>
              <h1 className="font-bold text-lg">MicroInvoice</h1>
            </div>
          </header>
          
          <main className="flex-grow w-full max-w-3xl mx-auto p-4 md:p-6">
            {children}
          </main>

          {/* Mobile Bottom Navigation */}
          <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-card-border md:hidden flex justify-around items-center p-3 z-50">
            <Link href="/" className="flex flex-col items-center text-muted hover:text-primary-600 text-xs gap-1">
              <Home size={20} />
              <span>Home</span>
            </Link>
            <Link href="/invoices/new" className="flex flex-col items-center text-primary-600 font-medium text-xs gap-1">
              <div className="bg-primary-50 p-2 rounded-full mb-1">
                <FileText size={20} />
              </div>
              <span className="-mt-1">New Invoice</span>
            </Link>
            <Link href="/clients" className="flex flex-col items-center text-muted hover:text-primary-600 text-xs gap-1">
              <Users size={20} />
              <span>Clients</span>
            </Link>
          </nav>
        </div>
      </body>
    </html>
  );
}
