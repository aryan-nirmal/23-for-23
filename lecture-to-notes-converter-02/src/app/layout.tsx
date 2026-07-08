import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lecture Notes Converter | Study Faster",
  description: "Turn lecture recordings into study-ready notes and flashcards fast enough to use the same day.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <div className="flex flex-col min-h-screen">
          <header className="px-6 py-4 border-b border-card-border flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center font-bold text-white shadow-lg shadow-primary-500/20">
                LN
              </div>
              <h1 className="text-xl font-bold tracking-tight">LectNotes</h1>
            </div>
            <nav className="flex items-center gap-4">
              <span className="text-sm text-muted">Free Plan (3/3 uploads remaining)</span>
            </nav>
          </header>
          <main className="flex-grow flex flex-col items-center justify-center p-4">
            {children}
          </main>
          <footer className="py-6 text-center text-sm text-muted border-t border-card-border mt-auto">
            &copy; {new Date().getFullYear()} LectNotes. Built for students.
          </footer>
        </div>
      </body>
    </html>
  );
}
