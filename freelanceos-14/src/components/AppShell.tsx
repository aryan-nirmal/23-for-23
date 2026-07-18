import { Sidebar } from "./Sidebar";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-zinc-900">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}