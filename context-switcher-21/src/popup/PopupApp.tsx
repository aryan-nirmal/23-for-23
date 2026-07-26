import { useEffect, useState } from "react";
import { MAX_PROJECTS } from "../lib/storage";
import { formatRelativeDate } from "../lib/utils";
import type {
  CurrentTabsInfo,
  DeleteResult,
  ProjectState,
  RestoreResult,
  SaveResult
} from "../lib/types";

type ErrorLike = { error?: string };

async function sendRuntimeMessage<T>(message: unknown): Promise<T> {
  return chrome.runtime.sendMessage(message) as Promise<T>;
}

const isMac = navigator.platform.toLowerCase().includes("mac");
const shortcutLabel = isMac ? "⌘⇧K" : "Ctrl+Shift+K";

export function PopupApp() {
  const [projects, setProjects] = useState<ProjectState[]>([]);
  const [projectName, setProjectName] = useState("");
  const [tabCount, setTabCount] = useState(0);
  const [status, setStatus] = useState("Ready.");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void refresh();
  }, []);

  async function refresh() {
    const [nextProjects, currentTabs] = await Promise.all([
      sendRuntimeMessage<ProjectState[]>({ type: "background.listProjects" }),
      sendRuntimeMessage<CurrentTabsInfo>({ type: "background.getCurrentTabs" })
    ]);

    setProjects(nextProjects);
    setTabCount(currentTabs.tabCount);
  }

  async function handleSave() {
    if (!projectName.trim()) {
      setStatus("Enter a project name before saving.");
      return;
    }

    setBusy(true);
    setStatus("Saving current window tabs...");

    try {
      const response = await sendRuntimeMessage<SaveResult | ErrorLike>({
        type: "background.saveCurrentProject",
        payload: { name: projectName.trim() }
      });

      if ("error" in response && response.error) {
        throw new Error(response.error);
      }

      const result = response as SaveResult;
      if (!result.ok) {
        throw new Error(result.reason || "Could not save project.");
      }

      setProjectName("");
      await refresh();
      setStatus(`Saved "${result.project?.name}" with ${result.project?.tabs.length ?? 0} tabs.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setBusy(false);
    }
  }

  async function handleRestore(id: string, name: string) {
    setBusy(true);
    setStatus(`Restoring "${name}"...`);

    try {
      const response = await sendRuntimeMessage<RestoreResult | ErrorLike>({
        type: "background.restoreProject",
        payload: { id }
      });

      if ("error" in response && response.error) {
        throw new Error(response.error);
      }

      const result = response as RestoreResult;
      if (!result.ok) {
        throw new Error(result.reason || "Restore failed.");
      }

      setStatus(`Opened ${result.openedCount} tabs for "${name}".`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Restore failed.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    const confirmed = window.confirm(`Delete project "${name}"? This cannot be undone.`);
    if (!confirmed) {
      return;
    }

    setBusy(true);
    setStatus(`Deleting "${name}"...`);

    try {
      const response = await sendRuntimeMessage<DeleteResult | ErrorLike>({
        type: "background.deleteProject",
        payload: { id }
      });

      if ("error" in response && response.error) {
        throw new Error(response.error);
      }

      const result = response as DeleteResult;
      if (!result.ok) {
        throw new Error(result.reason || "Delete failed.");
      }

      await refresh();
      setStatus(`Deleted "${name}".`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Delete failed.");
    } finally {
      setBusy(false);
    }
  }

  async function handleEdit(id: string) {
    await sendRuntimeMessage({ type: "background.openSidePanel", payload: { id } });
    setStatus("Opened side panel for detailed editing.");
  }

  return (
    <div className="popupShell">
      <p className="eyebrow">Context Switcher</p>
      <h1>Save and restore project browser context in one click.</h1>
      <p className="subtle">
        Capture tabs, notes, and checklists so you can jump between client work without rebuilding state.
      </p>

      <p className="shortcutHint">
        Keyboard shortcut: <kbd>{shortcutLabel}</kbd> opens this popup from anywhere in Chrome.
      </p>

      <section className="card saveForm">
        <label>
          Save current window
          <input
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
            placeholder="e.g. Acme redesign sprint"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                void handleSave();
              }
            }}
          />
        </label>
        <p className="hint">{tabCount} savable tabs in the current window</p>
        <button className="primaryButton" disabled={busy || projects.length >= MAX_PROJECTS} onClick={() => void handleSave()}>
          {busy ? "Working..." : "Save project state"}
        </button>
        {projects.length >= MAX_PROJECTS ? (
          <p className="hint">Free tier limit reached ({MAX_PROJECTS} projects). Delete one to save another.</p>
        ) : null}
      </section>

      <section className="card projectList">
        <div className="listHeader">
          <h2>Saved projects</h2>
          <span className="subtle">
            {projects.length}/{MAX_PROJECTS}
          </span>
        </div>

        {projects.length ? (
          projects.map((project) => (
            <article className="projectItem" key={project.id}>
              <div className="projectMeta">
                <strong>{project.name}</strong>
                <span>
                  {project.tabs.length} tabs • {formatRelativeDate(project.updatedAt)}
                  {project.note ? " • has note" : ""}
                  {project.checklist.length ? ` • ${project.checklist.length} checklist items` : ""}
                </span>
              </div>
              <div className="projectActions">
                <button
                  className="primaryButton"
                  disabled={busy}
                  onClick={() => void handleRestore(project.id, project.name)}
                >
                  Restore
                </button>
                <button className="secondaryButton" disabled={busy} onClick={() => void handleEdit(project.id)}>
                  Edit details
                </button>
                <button
                  className="dangerButton"
                  disabled={busy}
                  onClick={() => void handleDelete(project.id, project.name)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))
        ) : (
          <p className="emptyState">No saved projects yet. Name your current tabs and save your first context.</p>
        )}
      </section>

      <p className="status">{status}</p>
    </div>
  );
}