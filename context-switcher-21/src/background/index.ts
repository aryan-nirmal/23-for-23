import {
  addProject,
  deleteProject,
  getProject,
  listProjects,
  setSelectedProjectId,
  updateProject
} from "../lib/storage";
import { createId } from "../lib/utils";
import type {
  CurrentTabsInfo,
  DeleteResult,
  ProjectState,
  RestoreResult,
  SaveProjectInput,
  SaveResult,
  TabSnapshot,
  UpdateProjectInput
} from "../lib/types";

async function captureCurrentWindowTabs(): Promise<TabSnapshot[]> {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  return tabs
    .filter((tab) => tab.url && !tab.url.startsWith("chrome://") && !tab.url.startsWith("chrome-extension://"))
    .map((tab) => ({
      url: tab.url!,
      title: tab.title || tab.url!
    }));
}

async function saveCurrentProject(input: SaveProjectInput): Promise<SaveResult> {
  const name = input.name.trim();

  if (!name) {
    return { ok: false, reason: "Project name is required." };
  }

  const tabs = await captureCurrentWindowTabs();

  if (!tabs.length) {
    return { ok: false, reason: "No savable tabs found in the current window." };
  }

  const now = new Date().toISOString();
  const project: ProjectState = {
    id: createId("project"),
    name,
    tabs,
    note: input.note?.trim() ?? "",
    checklist: input.checklist ?? [],
    createdAt: now,
    updatedAt: now
  };

  const result = await addProject(project);

  if (!result.ok) {
    return { ok: false, reason: result.reason };
  }

  return { ok: true, project: result.project };
}

async function restoreProject(id: string): Promise<RestoreResult> {
  const project = await getProject(id);

  if (!project) {
    return { ok: false, openedCount: 0, reason: "Project not found." };
  }

  if (!project.tabs.length) {
    return { ok: false, openedCount: 0, reason: "This project has no tabs to restore." };
  }

  const [firstTab, ...remainingTabs] = project.tabs;

  await chrome.tabs.create({ url: firstTab.url, active: true });

  for (const tab of remainingTabs) {
    await chrome.tabs.create({ url: tab.url, active: false });
  }

  return { ok: true, openedCount: project.tabs.length };
}

async function removeProject(id: string): Promise<DeleteResult> {
  const deleted = await deleteProject(id);
  return deleted
    ? { ok: true }
    : { ok: false, reason: "Project not found." };
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false });
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  (async () => {
    switch (message.type) {
      case "background.listProjects":
        sendResponse(await listProjects());
        break;
      case "background.getProject":
        sendResponse(await getProject(message.payload.id));
        break;
      case "background.getCurrentTabs":
        sendResponse({
          tabCount: (await captureCurrentWindowTabs()).length,
          tabs: await captureCurrentWindowTabs()
        } satisfies CurrentTabsInfo);
        break;
      case "background.saveCurrentProject":
        sendResponse(await saveCurrentProject(message.payload as SaveProjectInput));
        break;
      case "background.restoreProject":
        sendResponse(await restoreProject(message.payload.id));
        break;
      case "background.deleteProject":
        sendResponse(await removeProject(message.payload.id));
        break;
      case "background.updateProject":
        sendResponse(await updateProject(message.payload as UpdateProjectInput));
        break;
      case "background.selectProjectForEdit":
        await setSelectedProjectId(message.payload.id);
        sendResponse({ ok: true });
        break;
      case "background.openSidePanel": {
        if (message.payload?.id) {
          await setSelectedProjectId(message.payload.id);
        }
        const currentWindow = await chrome.windows.getCurrent();
        if (currentWindow.id !== undefined) {
          await chrome.sidePanel.open({ windowId: currentWindow.id });
        }
        sendResponse({ ok: true });
        break;
      }
      default:
        sendResponse(null);
    }
  })().catch((error: unknown) => {
    const messageText = error instanceof Error ? error.message : "Unexpected extension error.";
    sendResponse({ error: messageText });
  });

  return true;
});