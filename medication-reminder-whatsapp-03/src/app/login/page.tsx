import { redirect } from "next/navigation";
import { LoginCard } from "@/features/auth/components/login-card";
import { getSession } from "@/lib/auth";
import { hasSupabaseEnv } from "@/lib/env";

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen px-6 py-10 md:px-10">
      <LoginCard supabaseEnabled={hasSupabaseEnv()} />
    </main>
  );
}
