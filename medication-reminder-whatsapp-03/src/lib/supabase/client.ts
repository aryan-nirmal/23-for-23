import { createBrowserClient } from "@supabase/ssr";
import { getEnv, hasSupabaseEnv } from "@/lib/env";

export function createSupabaseBrowserClient() {
  if (!hasSupabaseEnv()) {
    return null;
  }

  const env = getEnv();
  return createBrowserClient(env.supabaseUrl, env.supabaseAnonKey);
}
