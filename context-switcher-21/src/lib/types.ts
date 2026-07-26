export interface TabSnapshot {
  url: string;
  title: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface ProjectState {
  id: string;
  name: string;
  tabs: TabSnapshot[];
  note: string;
  checklist: ChecklistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface StorageShape {
  version: number;
  projects: ProjectState[];
}

export interface SaveProjectInput {
  name: string;
  note?: string;
  checklist?: ChecklistItem[];
}

export interface UpdateProjectInput {
  id: string;
  name?: string;
  note?: string;
  checklist?: ChecklistItem[];
}

export interface RestoreResult {
  ok: boolean;
  openedCount: number;
  reason?: string;
}

export interface SaveResult {
  ok: boolean;
  project?: ProjectState;
  reason?: string;
}

export interface DeleteResult {
  ok: boolean;
  reason?: string;
}

export interface CurrentTabsInfo {
  tabCount: number;
  tabs: TabSnapshot[];
}