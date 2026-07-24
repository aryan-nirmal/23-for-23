import { CURRENT_USER } from "./auth";
import type {
  AuditEntry,
  EnvVar,
  EnvVarsByEnvironment,
  Environment,
  Project,
  PullToken,
} from "./types";
import { generateId } from "./utils";

interface Store {
  projects: Project[];
  envVars: Record<string, EnvVarsByEnvironment>;
  auditLog: AuditEntry[];
  tokens: PullToken[];
}

function createEmptyEnvVars(): EnvVarsByEnvironment {
  return { dev: [], staging: [], production: [] };
}

function seedStore(): Store {
  const project1: Project = {
    id: "proj_web_app",
    name: "Web Application",
    description: "Main customer-facing Next.js application",
    createdAt: "2026-01-15T10:00:00.000Z",
  };

  const project2: Project = {
    id: "proj_api_gateway",
    name: "API Gateway",
    description: "Internal microservices API gateway",
    createdAt: "2026-02-20T14:30:00.000Z",
  };

  const project3: Project = {
    id: "proj_mobile_backend",
    name: "Mobile Backend",
    description: "Backend services for iOS and Android apps",
    createdAt: "2026-03-10T09:15:00.000Z",
  };

  const envVars: Record<string, EnvVarsByEnvironment> = {
    proj_web_app: {
      dev: [
        { id: "v1", key: "DATABASE_URL", value: "postgres://localhost:5432/webapp_dev" },
        { id: "v2", key: "NEXT_PUBLIC_API_URL", value: "http://localhost:3001" },
        { id: "v3", key: "STRIPE_SECRET_KEY", value: "sk_test_REDACTED" },
      ],
      staging: [
        { id: "v4", key: "DATABASE_URL", value: "postgres://staging.db.acme.dev:5432/webapp" },
        { id: "v5", key: "NEXT_PUBLIC_API_URL", value: "https://api-staging.acme.dev" },
        { id: "v6", key: "STRIPE_SECRET_KEY", value: "sk_test_REDACTED2" },
      ],
      production: [
        { id: "v7", key: "DATABASE_URL", value: "postgres://prod.db.acme.dev:5432/webapp" },
        { id: "v8", key: "NEXT_PUBLIC_API_URL", value: "https://api.acme.dev" },
        { id: "v9", key: "STRIPE_SECRET_KEY", value: "sk_live_51HxYzKqLmNpQrStUvWxYz" },
        { id: "v10", key: "JWT_SECRET", value: "prod_jwt_super_secret_key_2026" },
      ],
    },
    proj_api_gateway: {
      dev: [
        { id: "v11", key: "REDIS_URL", value: "redis://localhost:6379" },
        { id: "v12", key: "AUTH_SERVICE_URL", value: "http://localhost:4001" },
      ],
      staging: [
        { id: "v13", key: "REDIS_URL", value: "redis://staging-redis.acme.dev:6379" },
        { id: "v14", key: "AUTH_SERVICE_URL", value: "https://auth-staging.acme.dev" },
      ],
      production: [
        { id: "v15", key: "REDIS_URL", value: "redis://prod-redis.acme.dev:6379" },
        { id: "v16", key: "AUTH_SERVICE_URL", value: "https://auth.acme.dev" },
        { id: "v17", key: "RATE_LIMIT_MAX", value: "1000" },
      ],
    },
    proj_mobile_backend: {
      dev: [
        { id: "v18", key: "FIREBASE_PROJECT_ID", value: "acme-mobile-dev" },
        { id: "v19", key: "APNS_KEY_ID", value: "DEVKEY123" },
      ],
      staging: [
        { id: "v20", key: "FIREBASE_PROJECT_ID", value: "acme-mobile-staging" },
        { id: "v21", key: "APNS_KEY_ID", value: "STGKEY456" },
      ],
      production: [
        { id: "v22", key: "FIREBASE_PROJECT_ID", value: "acme-mobile-prod" },
        { id: "v23", key: "APNS_KEY_ID", value: "PRDKEY789" },
        { id: "v24", key: "SENTRY_DSN", value: "https://sentry.io/acme-mobile/12345" },
      ],
    },
  };

  const tokens: PullToken[] = [
    {
      token: "evm_prod_web_app_7f3a9c2e1b8d4f6a",
      projectId: "proj_web_app",
      env: "production",
      label: "Web App Production",
    },
    {
      token: "evm_staging_web_app_2d5e8a1c9b7f3e4d",
      projectId: "proj_web_app",
      env: "staging",
      label: "Web App Staging",
    },
    {
      token: "evm_prod_api_gateway_9a1b2c3d4e5f6a7b",
      projectId: "proj_api_gateway",
      env: "production",
      label: "API Gateway Production",
    },
    {
      token: "evm_dev_mobile_3c4d5e6f7a8b9c0d",
      projectId: "proj_mobile_backend",
      env: "dev",
      label: "Mobile Backend Dev",
    },
  ];

  const auditLog: AuditEntry[] = [
    {
      id: "a1",
      timestamp: "2026-06-07T16:45:00.000Z",
      user: "alex@acme.dev",
      action: "update",
      resource: "proj_web_app / production",
      details: "Updated STRIPE_SECRET_KEY",
    },
    {
      id: "a2",
      timestamp: "2026-06-07T14:20:00.000Z",
      user: "sarah@acme.dev",
      action: "create",
      resource: "proj_api_gateway / staging",
      details: "Added AUTH_SERVICE_URL",
    },
    {
      id: "a3",
      timestamp: "2026-06-06T11:00:00.000Z",
      user: "alex@acme.dev",
      action: "delete",
      resource: "proj_web_app / dev",
      details: "Removed DEBUG_MODE",
    },
    {
      id: "a4",
      timestamp: "2026-06-05T09:30:00.000Z",
      user: "mike@acme.dev",
      action: "pull",
      resource: "proj_web_app / production",
      details: "Pulled env vars via CLI",
    },
    {
      id: "a5",
      timestamp: "2026-06-04T18:15:00.000Z",
      user: "sarah@acme.dev",
      action: "create",
      resource: "proj_mobile_backend / production",
      details: "Added SENTRY_DSN",
    },
  ];

  return {
    projects: [project1, project2, project3],
    envVars,
    auditLog,
    tokens,
  };
}

const globalStore = globalThis as unknown as { __evmStore?: Store };

if (!globalStore.__evmStore) {
  globalStore.__evmStore = seedStore();
}

const store = globalStore.__evmStore;

function addAudit(
  action: AuditEntry["action"],
  resource: string,
  details: string,
  user: string = CURRENT_USER
) {
  store.auditLog.unshift({
    id: generateId(),
    timestamp: new Date().toISOString(),
    user,
    action,
    resource,
    details,
  });
}

export function getProjects(): Project[] {
  return [...store.projects];
}

export function getProject(id: string): Project | undefined {
  return store.projects.find((p) => p.id === id);
}

export function createProject(name: string, description: string): Project {
  const project: Project = {
    id: `proj_${generateId()}`,
    name,
    description,
    createdAt: new Date().toISOString(),
  };
  store.projects.push(project);
  store.envVars[project.id] = createEmptyEnvVars();
  addAudit("create", project.id, `Created project "${name}"`);
  return project;
}

export function getEnvVars(projectId: string, env: Environment): EnvVar[] {
  const projectVars = store.envVars[projectId];
  if (!projectVars) return [];
  return [...projectVars[env]];
}

export function getAllEnvVarsForProject(projectId: string): EnvVarsByEnvironment {
  const projectVars = store.envVars[projectId];
  if (!projectVars) return createEmptyEnvVars();
  return {
    dev: [...projectVars.dev],
    staging: [...projectVars.staging],
    production: [...projectVars.production],
  };
}

export function addEnvVar(
  projectId: string,
  env: Environment,
  key: string,
  value: string
): EnvVar | null {
  const projectVars = store.envVars[projectId];
  if (!projectVars) return null;

  const envVar: EnvVar = { id: generateId(), key, value };
  projectVars[env].push(envVar);
  addAudit("create", `${projectId} / ${env}`, `Added ${key}`);
  return envVar;
}

export function updateEnvVar(
  projectId: string,
  env: Environment,
  id: string,
  key: string,
  value: string
): EnvVar | null {
  const projectVars = store.envVars[projectId];
  if (!projectVars) return null;

  const index = projectVars[env].findIndex((v) => v.id === id);
  if (index === -1) return null;

  const oldKey = projectVars[env][index].key;
  projectVars[env][index] = { id, key, value };
  addAudit("update", `${projectId} / ${env}`, `Updated ${oldKey} → ${key}`);
  return projectVars[env][index];
}

export function deleteEnvVar(
  projectId: string,
  env: Environment,
  id: string
): boolean {
  const projectVars = store.envVars[projectId];
  if (!projectVars) return false;

  const index = projectVars[env].findIndex((v) => v.id === id);
  if (index === -1) return false;

  const deleted = projectVars[env][index];
  projectVars[env].splice(index, 1);
  addAudit("delete", `${projectId} / ${env}`, `Removed ${deleted.key}`);
  return true;
}

export function getAuditLog(): AuditEntry[] {
  return [...store.auditLog];
}

export function getTokens(): PullToken[] {
  return [...store.tokens];
}

export function getTokensForProject(projectId: string): PullToken[] {
  return store.tokens.filter((t) => t.projectId === projectId);
}

export function logPull(projectId: string, env: Environment, user?: string) {
  addAudit("pull", `${projectId} / ${env}`, "Pulled env vars via CLI", user ?? "cli-user");
}