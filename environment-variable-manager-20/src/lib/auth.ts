import type { Environment } from "./types";

export const CURRENT_USER = "alex@acme.dev";

export function validatePullToken(
  token: string,
  projectId: string,
  env: Environment,
  validTokens: { token: string; projectId: string; env: Environment }[]
): boolean {
  return validTokens.some(
    (t) => t.token === token && t.projectId === projectId && t.env === env
  );
}