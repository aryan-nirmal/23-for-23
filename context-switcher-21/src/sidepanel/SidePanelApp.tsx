import { useEffect, useState } from "react";
import { getSelectedProjectId } from "../lib/storage";
import { createId, formatRelativeDate } from "../lib/utils";
import type { ChecklistItem, ProjectState } from "../lib/types";

type ErrorLike = { error?: string };

async function sendRuntimeMessage<T>(message: unknown): Promise<T> {
  return chrome.runtime.sendMessage(message) as Promise<T>;
}

export function SidePanelApp() {
  const [projects, setProjects] = useState<ProjectState[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newItemText, setNewItemText] = useState("");
  const [status, setStatus] = useState("Select a project to edit.");
  const [busy, setBusy] = useState(false);

  const selectedProject = projects.find((project) => project.id === selectedId) ?? null;

  useEffect(() => {
    void initialize();
  }, []);

  useEffect(() => {
    if (!selectedProject) {
      return;
    }

    setName(selectedProject.name);
    setNote(selectedProject.note);
    setChecklist(selectedProject.checklist);
  }, [selectedProject]);

  async function initialize() {
    const nextProjects = await sendRuntimeMessage<ProjectState[]>({ type: "background.listProjects" });
    setProjects(nextProjects);

    const storedId = await getSelectedProjectId();
    const initialId = storedId && nextProjects.some((project) => project.id === storedId)
      ? storedId
      : nextProjects[0]?.id ?? null;

    setSelectedId(initialId);

    if (initialId) {
      setStatus("Editing project details. Changes save locally on this device.");
    }
  }

  async function handleSelectProject(id: string) {
    setSelectedId(id);
    await sendRuntimeMessage({ type: "background.selectProjectForEdit", payload: { id } });
    setStatus("Loaded project for editing.");
  }

  async function handleSave() {
    if (!selectedId) {
      return;
    }

    setBusy(true);
    setStatus("Saving changes...");

    try {
      const response = await sendRuntimeMessage<ProjectState | null | ErrorLike>({
        type: "background.updateProject",
        payload: {
          id: selectedId,
          name: name.trim(),
          note,
          checklist
        }
      });

      if (!response || (typeof response === "object" && "error" in response && response.error)) {
        throw new Error(
          response && typeof response === "object" && "error" in response && response.error
            ? response.error
            : "Project not found."
        );
      }

      const updated = response as ProjectState;
      setProjects((current) =>
        current
          .map((project) => (project.id === updated.id ? updated : project))
          .sort(
            (left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
          )
      );
      setStatus(`Saved "${updated.name}".`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setBusy(false);
    }
  }

  function handleAddChecklistItem() {
    const text = newItemText.trim();
    if (!text) {
      setStatus("Enter checklist item text before adding.");
      return;
    }

    setChecklist((current) => [
      ...current,
      {
        id: createId("task"),
        text,
        done: false
      }
    ]);
    setNewItemText("");
    setStatus("Checklist item added. Click Save changes to persist.");
  }

  function handleToggleItem(id: string) {
    setChecklist((current) =>
      current.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  }

  function handleRemoveItem(id: string) {
    setChecklist((current) => current.filter((item) => item.id !== id));
    setStatus("Checklist item removed. Click Save changes to persist.");
  }

  function handleUpdateItemText(id: string, text: string) {
    setChecklist((current) =>
      current.map((item) => (item.id === id ? { ...item, text } : item))
    );
  }

  return (
    <div className="shell">
      <header className="hero">
        <p className="eyebrow">Context Switcher</p>
        <h1>Edit project notes, checklists, and names.</h1>
        <p className="subtle">
          Use the popup to save or restore tabs. This side panel is for richer project context editing.
        </p>
      </header>

      <section className="panel">
        <div className="panelHeader">
          <h2>Project</h2>
          <span>{projects.length} saved</span>
        </div>

        {projects.length ? (
          <label>
            Select project
            <select
              value={selectedId ?? ""}
              onChange={(event) => void handleSelectProject(event.target.value)}
              style={{
                width: "100%",
                marginTop: "6px",
                border: "1px solid rgba(50, 67, 84, 0.14)",
                borderRadius: "14px",
                background: "#fffdf9",
                padding: "12px 13px",
                color: "#152230"
              }}
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <p className="emptyState">No projects yet. Save one from the popup first.</p>
        )}
      </section>

      {selectedProject ? (
        <>
          <section className="panel">
            <div className="panelHeader">
              <h2>Details</h2>
              <span>{formatRelativeDate(selectedProject.updatedAt)}</span>
            </div>

            <label>
              Project name
              <input value={name} onChange={(event) => setName(event.target.value)} />
            </label>

            <label>
              Context note
              <textarea
                rows={6}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="What were you working on? What should you do next?"
              />
            </label>

            <button className="primaryButton" disabled={busy || !name.trim()} onClick={() => void handleSave()}>
              {busy ? "Saving..." : "Save changes"}
            </button>
          </section>

          <section className="panel">
            <div className="panelHeader">
              <h2>Checklist</h2>
              <span>{checklist.length} items</span>
            </div>

            <div className="checklist">
              {checklist.map((item) => (
                <div className="checklistItem" key={item.id}>
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => handleToggleItem(item.id)}
                  />
                  <input
                    type="text"
                    value={item.text}
                    onChange={(event) => handleUpdateItemText(item.id, event.target.value)}
                  />
                  <button className="dangerButton" onClick={() => handleRemoveItem(item.id)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <label>
              Add checklist item
              <input
                value={newItemText}
                onChange={(event) => setNewItemText(event.target.value)}
                placeholder="e.g. Send revised mockups to client"
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleAddChecklistItem();
                  }
                }}
              />
            </label>

            <div className="row">
              <button className="secondaryButton" onClick={handleAddChecklistItem}>
                Add item
              </button>
            </div>
          </section>

          <section className="panel">
            <div className="panelHeader">
              <h2>Saved tabs</h2>
              <span>{selectedProject.tabs.length}</span>
            </div>

            <div className="tabList">
              {selectedProject.tabs.map((tab, index) => (
                <div className="tabItem" key={`${tab.url}-${index}`}>
                  <strong>{tab.title}</strong>
                  <span>{tab.url}</span>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : null}

      <footer className="footerStatus">{status}</footer>
    </div>
  );
}