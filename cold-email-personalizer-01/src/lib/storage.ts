import { defaultStorage } from "./defaults";
import type {
  GmailDraftHistoryItem,
  ProspectHistoryItem,
  SavedPitch,
  Settings,
  StorageShape
} from "./types";

const STORAGE_KEY = "cold-email-personalizer-store";

function getLocalStorage(): chrome.storage.StorageArea {
  return chrome.storage.local;
}

export async function loadStore(): Promise<StorageShape> {
  const result = await getLocalStorage().get(STORAGE_KEY);
  return { ...defaultStorage, ...(result[STORAGE_KEY] as Partial<StorageShape> | undefined) };
}

export async function saveStore(store: StorageShape): Promise<void> {
  await getLocalStorage().set({ [STORAGE_KEY]: store });
}

export async function updateSettings(settings: Settings): Promise<Settings> {
  const store = await loadStore();
  const next = { ...store, settings };
  await saveStore(next);
  return settings;
}

export async function addSavedPitch(pitch: SavedPitch): Promise<SavedPitch[]> {
  const store = await loadStore();
  const savedPitches = [pitch, ...store.savedPitches].slice(0, 25);
  await saveStore({ ...store, savedPitches });
  return savedPitches;
}

export async function deleteSavedPitch(id: string): Promise<SavedPitch[]> {
  const store = await loadStore();
  const savedPitches = store.savedPitches.filter((item) => item.id !== id);
  await saveStore({ ...store, savedPitches });
  return savedPitches;
}

export async function addProspectHistory(item: ProspectHistoryItem): Promise<void> {
  const store = await loadStore();
  const prospectHistory = [item, ...store.prospectHistory].slice(0, 30);
  await saveStore({ ...store, prospectHistory });
}

export async function addGmailHistory(item: GmailDraftHistoryItem): Promise<void> {
  const store = await loadStore();
  const gmailDraftHistory = [item, ...store.gmailDraftHistory].slice(0, 30);
  await saveStore({ ...store, gmailDraftHistory });
}

export async function importStore(payload: StorageShape): Promise<StorageShape> {
  const merged: StorageShape = {
    settings: payload.settings ?? defaultStorage.settings,
    savedPitches: payload.savedPitches ?? [],
    prospectHistory: payload.prospectHistory ?? [],
    gmailDraftHistory: payload.gmailDraftHistory ?? []
  };
  await saveStore(merged);
  return merged;
}
