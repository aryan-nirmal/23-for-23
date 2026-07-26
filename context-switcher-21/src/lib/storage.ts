import type { ProjectState, StorageShape, UpdateProjectInput } from "./types";

export const MAX_PROJECTS = 20;
const STORAGE_KEY = "context-switcher-store";

const defaultStorage: StorageShape = {
  version: 1,
  projects: []
};

function getLocalStorage(): chrome.storage.StorageArea {
  return chrome.storage.local;
}

export async function loadStore(): Promise<StorageShape> {
  const result = await getLocalStorage().get(STORAGE_KEY);
  const stored = result[STORAGE_KEY] as Partial<StorageShape> | undefined;
  return {
    ...defaultStorage,
    ...stored,
    projects: stored?.projects ?? []
  };
}

export async function saveStore(store: StorageShape): Promise<void> {
  await getLocalStorage().set({ [STORAGE_KEY]: store });
}

export async function listProjects(): Promise<ProjectState[]> {
  const store = await loadStore();
  return [...store.projects].sort(
    (left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
  );
}

export async function getProject(id: string): Promise<ProjectState | null> {
  const store = await loadStore();
  return store.projects.find((project) => project.id === id) ?? null;
}

export async function addProject(project: ProjectState): Promise<SaveProjectResult> {
  const store = await loadStore();

  if (store.projects.length >= MAX_PROJECTS) {
    return {
      ok: false,
      reason: `Free tier supports up to ${MAX_PROJECTS} projects. Delete one to save a new context.`
    };
  }

  const projects = [project, ...store.projects];
  await saveStore({ ...store, projects });

  return { ok: true, project };
}

export async function updateProject(input: UpdateProjectInput): Promise<ProjectState | null> {
  const store = await loadStore();
  const index = store.projects.findIndex((project) => project.id === input.id);

  if (index === -1) {
    return null;
  }

  const current = store.projects[index];
  const updated: ProjectState = {
    ...current,
    name: input.name?.trim() || current.name,
    note: input.note ?? current.note,
    checklist: input.checklist ?? current.checklist,
    updatedAt: new Date().toISOString()
  };

  const projects = [...store.projects];
  projects[index] = updated;
  await saveStore({ ...store, projects });

  return updated;
}

export async function deleteProject(id: string): Promise<boolean> {
  const store = await loadStore();
  const nextProjects = store.projects.filter((project) => project.id !== id);

  if (nextProjects.length === store.projects.length) {
    return false;
  }

  await saveStore({ ...store, projects: nextProjects });
  return true;
}

export async function setSelectedProjectId(id: string | null): Promise<void> {
  await getLocalStorage().set({ "context-switcher-selected-project": id });
}

export async function getSelectedProjectId(): Promise<string | null> {
  const result = await getLocalStorage().get("context-switcher-selected-project");
  const value = result["context-switcher-selected-project"];
  return typeof value === "string" ? value : null;
}

interface SaveProjectResult {
  ok: boolean;
  project?: ProjectState;
  reason?: string;
}