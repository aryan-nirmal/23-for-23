const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  demoAuthEnabled: process.env.NEXT_PUBLIC_ENABLE_DEMO_AUTH !== "false",
  internalJobKey: process.env.INTERNAL_JOB_KEY ?? "local-dev-job-key",
};

export function hasSupabaseEnv() {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}

export function getEnv() {
  return env;
}
