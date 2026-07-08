import { useEffect, useState, type ChangeEvent } from "react";
import type { StorageShape } from "../lib/types";

export function OptionsApp() {
  const [store, setStore] = useState<StorageShape | null>(null);
  const [status, setStatus] = useState("Loading local extension data...");

  useEffect(() => {
    chrome.runtime
      .sendMessage({ type: "background.getStore" })
      .then((payload: StorageShape) => {
        setStore(payload);
        setStatus("Local storage loaded.");
      })
      .catch(() => setStatus("Could not load extension storage."));
  }, []);

  async function handleExport() {
    if (!store) {
      return;
    }

    const blob = new Blob([JSON.stringify(store, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "cold-email-personalizer-backup.json";
    anchor.click();
    URL.revokeObjectURL(url);
    setStatus("Backup exported.");
  }

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const text = await file.text();
    const parsed = JSON.parse(text) as StorageShape;
    const next = await chrome.runtime.sendMessage({
      type: "background.importStore",
      payload: parsed
    });
    setStore(next as StorageShape);
    setStatus("Backup imported into local extension storage.");
  }

  return (
    <div className="optionsShell">
      <div className="header">
        <p className="eyebrow">Local-first settings</p>
        <h1>Manage your provider config and back up everything you save in the extension.</h1>
      </div>

      <div className="panel">
        <h2>What is stored locally</h2>
        <ul>
          <li>Provider settings and API key</li>
          <li>Saved pitch templates</li>
          <li>LinkedIn draft history</li>
          <li>Gmail reply history</li>
        </ul>
      </div>

      <div className="panel">
        <h2>Import / export</h2>
        <div className="actions">
          <button className="primaryButton" onClick={() => void handleExport()}>
            Export JSON backup
          </button>
          <label className="fileLabel">
            Import JSON backup
            <input type="file" accept="application/json" onChange={(event) => void handleImport(event)} />
          </label>
        </div>
      </div>

      <div className="panel">
        <h2>Current counts</h2>
        <p>Saved pitches: {store?.savedPitches.length ?? 0}</p>
        <p>Prospect history: {store?.prospectHistory.length ?? 0}</p>
        <p>Gmail history: {store?.gmailDraftHistory.length ?? 0}</p>
      </div>

      <p className="status">{status}</p>
    </div>
  );
}
