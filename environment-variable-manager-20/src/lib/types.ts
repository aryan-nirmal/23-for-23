export type Environment = "dev" | "staging" | "production";

export const ENVIRONMENTS: Environment[] = ["dev", "staging", "production"];

export interface EnvVar {
  id: string;
  key: string;
  value: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: "create" | "update" | "delete" | "pull";
  resource: string;
  details: string;
}

export interface PullToken {
  token: string;
  projectId: string;
  env: Environment;
  label: string;
}

export type EnvVarsByEnvironment = Record<Environment, EnvVar[]>;