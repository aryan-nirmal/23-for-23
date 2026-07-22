import { useEffect, useState } from "react";
import { defaultSettings } from "../lib/defaults";
import type {
  ActiveContext,
  EmailDraft,
  GmailExtractResponse,
  LinkedInExtractResponse,
  Settings,
  StorageShape
} from "../lib/types";

type ErrorLike = { error?: string; reason?: string };

async function sendRuntimeMessage<T>(message: unknown): Promise<T> {
  return chrome.runtime.sendMessage(message) as Promise<T>;
}

export function SidePanelApp() {
  const [store, setStore] = useState<StorageShape | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [promptText, setPromptText] = useState("");
  const [draft, setDraft] = useState<EmailDraft | null>(null);
  const [refineText, setRefineText] = useState("");
  const [status, setStatus] = useState("Ready to extract.");
  const [busy, setBusy] = useState(false);

  // Settings form states
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("openrouter/auto");
  const [endpoint, setEndpoint] = useState("https://openrouter.ai/api/v1/chat/completions");

  useEffect(() => {
    void initialize();
  }, []);

  async function initialize() {
    try {
      const nextStore = await sendRuntimeMessage<StorageShape>({ type: "background.getStore" });
      setStore(nextStore);
      if (nextStore?.settings?.provider) {
        setApiKey(nextStore.settings.provider.apiKey || "");
        setModel(nextStore.settings.provider.model || "openrouter/auto");
        setEndpoint(nextStore.settings.provider.endpoint || "https://openrouter.ai/api/v1/chat/completions");
        setShowSettings(!nextStore.settings.provider.apiKey);
      }
    } catch {
      setStatus("Could not load settings.");
    }
  }

  async function handleExtract() {
    setBusy(true);
    setStatus("Fetching fresh context from active tab...");
    setDraft(null);

    try {
      const context = await sendRuntimeMessage<ActiveContext>({ type: "background.getActiveContext" });
      const response = await sendRuntimeMessage<
        LinkedInExtractResponse | GmailExtractResponse | { ok: boolean; context?: { latestMessage?: string; quotedContext?: string }; reason?: string } | ErrorLike
      >({ type: "background.extractCurrentPage" });

      if ("error" in response && response.error) {
        throw new Error(response.error);
      }

      let extractedInfo = "";
      let pageType: string = String(context?.page || "page");

      if ("snapshot" in response && response.snapshot) {
        pageType = "LinkedIn Profile";
        const s = response.snapshot;
        const parts = [
          s.fullName ? `Name: ${s.fullName}` : "",
          s.headline ? `Headline: ${s.headline}` : "",
          s.company ? `Company: ${s.company}` : "",
          s.about ? `About:\n${s.about}` : "",
          s.experienceHighlights?.length ? `\nWork Experience:\n• ${s.experienceHighlights.join("\n• ")}` : "",
          s.certifications?.length ? `\nLicenses & Certifications:\n• ${s.certifications.join("\n• ")}` : "",
          s.education?.length ? `\nEducation:\n• ${s.education.join("\n• ")}` : "",
          s.skills?.length ? `\nSkills:\n• ${s.skills.join("\n• ")}` : "",
          s.projects?.length ? `\nProjects:\n• ${s.projects.join("\n• ")}` : ""
        ].filter(Boolean);

        const structuredText = parts.join("\n");

        if (structuredText.trim().length > 30) {
          extractedInfo = structuredText;
        } else if (s.rawBodyText) {
          extractedInfo = `Name: ${s.fullName || "LinkedIn User"}\n${s.headline ? `Headline: ${s.headline}\n` : ""}\nProfile Details:\n${s.rawBodyText}`;
        } else {
          extractedInfo = structuredText;
        }
      } else if ("context" in response && response.context) {
        pageType = "Gmail Email Thread";
        const c = response.context;
        extractedInfo = [
          c.latestMessage ? `Latest Message:\n${c.latestMessage}` : "",
          c.quotedContext ? `Previous Context:\n${c.quotedContext}` : ""
        ].filter(Boolean).join("\n\n");
      } else if ("reason" in response && response.reason) {
        throw new Error(response.reason);
      }

      if (!extractedInfo.trim()) {
        throw new Error("No text content found on current page. Make sure you are on a profile or email page.");
      }

      const formattedPrompt = `[CONTEXT FROM ${pageType.toUpperCase()}]
${extractedInfo}

---
[INSTRUCTION]
(Note: Type in what kind of email you want — e.g. formal cold outreach, casual networking, internship pitch, follow-up, or any custom tone/goal...)
`;

      setPromptText(formattedPrompt);
      setStatus(`Fresh context extracted from ${pageType}!`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Extraction failed.");
    } finally {
      setBusy(false);
    }
  }

  async function handleGenerate(customPrompt?: string) {
    const textToUse = customPrompt || promptText;
    if (!textToUse.trim()) {
      setStatus("Extract context or write a prompt first.");
      return;
    }

    if (!apiKey.trim()) {
      setShowSettings(true);
      setStatus("Please enter your API Key in Settings first.");
      return;
    }

    setBusy(true);
    setStatus("Generating email draft...");

    try {
      await saveSettings();

      const response = await sendRuntimeMessage<EmailDraft | ErrorLike>({
        type: "background.generateDraft",
        payload: {
          mode: "cold_email",
          pitch: textToUse,
          cta: defaultSettings.defaultCta,
          tone: defaultSettings.defaultTone
        }
      });

      if ("error" in response && response.error) {
        throw new Error(response.error);
      }

      setDraft(response as EmailDraft);
      setRefineText("");
      setStatus("Email draft generated! You can edit or refine it below.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Generation failed.");
    } finally {
      setBusy(false);
    }
  }

  async function handleRefine() {
    if (!draft || !refineText.trim()) return;

    const fullRefinePrompt = `[CURRENT DRAFT]
Subject: ${draft.subject}
Body: ${draft.body}

---
[REFINEMENT INSTRUCTION]
${refineText}

---
Rewrite and refine the email according to the refinement instruction above. Return JSON with subject and body.`;

    await handleGenerate(fullRefinePrompt);
  }

  async function saveSettings() {
    const updatedSettings: Settings = {
      provider: {
        providerName: "OpenRouter",
        endpoint: endpoint.trim() || "https://openrouter.ai/api/v1/chat/completions",
        apiKey: apiKey.trim(),
        model: model.trim() || "openrouter/auto"
      },
      defaultTone: "formal",
      defaultCta: defaultSettings.defaultCta,
      maxBodyWords: 150
    };

    const nextStore = await sendRuntimeMessage<StorageShape>({
      type: "background.updateSettings",
      payload: updatedSettings
    });
    setStore(nextStore);
  }

  async function handleInsert(targetType: "subject" | "body" | "both") {
    if (!draft) return;
    setBusy(true);

    const textToCopy =
      targetType === "subject"
        ? draft.subject
        : targetType === "body"
        ? draft.body
        : `Subject: ${draft.subject}\n\n${draft.body}`;

    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch {
      // Ignore clipboard failure
    }

    try {
      const response = await sendRuntimeMessage<{ ok?: boolean; reason?: string; error?: string }>({
        type: "background.insertIntoGmail",
        payload: { subject: draft.subject, body: draft.body, targetType }
      });

      if (response.error || !response.ok) {
        throw new Error(response.error || response.reason || "Copied to clipboard! Press Ctrl+V / Cmd+V to paste.");
      }
      setStatus(`Inserted ${targetType === "both" ? "subject & body" : targetType} directly into text field!`);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Copied to clipboard! Press Ctrl+V / Cmd+V to paste.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ padding: "16px", fontFamily: "system-ui, -apple-system, sans-serif", color: "#e4e4e7", background: "#09090b", minHeight: "100vh" }}>
      {/* Top Header Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", borderBottom: "1px solid #27272a", paddingBottom: "10px" }}>
        <h2 style={{ fontSize: "15px", fontWeight: 600, margin: 0, color: "#f4f4f5" }}>
          ✉️ Email Personalizer AI
        </h2>
        <button
          onClick={() => setShowSettings(!showSettings)}
          style={{
            background: showSettings ? "#27272a" : "#18181b",
            color: "#a1a1aa",
            border: "1px solid #3f3f46",
            borderRadius: "6px",
            padding: "4px 8px",
            fontSize: "12px",
            cursor: "pointer"
          }}
        >
          {showSettings ? "▲ Hide Model" : "⚙️ Model Settings"}
        </button>
      </div>

      {/* Collapsible Model Settings */}
      {showSettings && (
        <div style={{ background: "#18181b", border: "1px solid #27272a", borderRadius: "8px", padding: "12px", marginBottom: "16px" }}>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", fontSize: "11px", color: "#a1a1aa", marginBottom: "4px" }}>API Key (OpenRouter)</label>
            <input
              type="password"
              placeholder="sk-or-v1-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              style={{ width: "100%", padding: "6px 8px", background: "#09090b", border: "1px solid #3f3f46", borderRadius: "4px", color: "#fff", fontSize: "12px", boxSizing: "border-box" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", fontSize: "11px", color: "#a1a1aa", marginBottom: "4px" }}>Model Slug</label>
            <input
              type="text"
              placeholder="openrouter/auto"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              style={{ width: "100%", padding: "6px 8px", background: "#09090b", border: "1px solid #3f3f46", borderRadius: "4px", color: "#fff", fontSize: "12px", boxSizing: "border-box" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", fontSize: "11px", color: "#a1a1aa", marginBottom: "4px" }}>Endpoint</label>
            <input
              type="text"
              placeholder="https://openrouter.ai/api/v1/chat/completions"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              style={{ width: "100%", padding: "6px 8px", background: "#09090b", border: "1px solid #3f3f46", borderRadius: "4px", color: "#fff", fontSize: "12px", boxSizing: "border-box" }}
            />
          </div>
          <button
            onClick={() => void saveSettings().then(() => { setShowSettings(false); setStatus("Settings saved."); })}
            style={{ width: "100%", padding: "6px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "4px", fontSize: "12px", fontWeight: 500, cursor: "pointer" }}
          >
            Save & Hide Settings
          </button>
        </div>
      )}

      {/* Primary Action Button */}
      <button
        disabled={busy}
        onClick={() => void handleExtract()}
        style={{
          width: "100%",
          padding: "10px",
          background: "#10b981",
          color: "#000",
          border: "none",
          borderRadius: "8px",
          fontSize: "13px",
          fontWeight: 600,
          cursor: busy ? "not-allowed" : "pointer",
          marginBottom: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px"
        }}
      >
        ⚡ Extract Active Page Context
      </button>

      {/* Single Prompt Text Area */}
      <div style={{ marginBottom: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
          <label style={{ fontSize: "12px", fontWeight: 500, color: "#d4d4d8" }}>Context & Prompt</label>
          {promptText && (
            <button
              onClick={() => setPromptText("")}
              style={{ background: "none", border: "none", color: "#71717a", fontSize: "11px", cursor: "pointer" }}
            >
              Clear
            </button>
          )}
        </div>
        <textarea
          rows={8}
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          placeholder="Click '⚡ Extract Active Page Context' above to load context automatically, then type what kind of email you want under [INSTRUCTION] (formal, casual, internship pitch, etc.)..."
          style={{
            width: "100%",
            padding: "10px",
            background: "#18181b",
            border: "1px solid #27272a",
            borderRadius: "8px",
            color: "#f4f4f5",
            fontSize: "12px",
            fontFamily: "monospace",
            lineHeight: 1.4,
            resize: "vertical",
            boxSizing: "border-box"
          }}
        />
      </div>

      {/* Generate Email Button */}
      <button
        disabled={busy || !promptText.trim()}
        onClick={() => void handleGenerate()}
        style={{
          width: "100%",
          padding: "10px",
          background: busy || !promptText.trim() ? "#27272a" : "#2563eb",
          color: busy || !promptText.trim() ? "#71717a" : "#fff",
          border: "none",
          borderRadius: "8px",
          fontSize: "13px",
          fontWeight: 600,
          cursor: busy || !promptText.trim() ? "not-allowed" : "pointer",
          marginBottom: "12px"
        }}
      >
        {busy ? "Generating..." : "🚀 Generate Email Draft"}
      </button>

      {/* Status Bar */}
      <div style={{ fontSize: "11px", color: "#a1a1aa", marginBottom: "16px", background: "#18181b", padding: "6px 10px", borderRadius: "6px", border: "1px solid #27272a" }}>
        {status}
      </div>

      {/* Generated Email Result */}
      {draft && (
        <div style={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px", padding: "12px", marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#10b981" }}>Generated Email (Editable)</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`Subject: ${draft.subject}\n\n${draft.body}`);
                setStatus("Copied subject & body to clipboard!");
              }}
              style={{ background: "#27272a", color: "#e4e4e7", border: "none", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", cursor: "pointer" }}
            >
              📋 Copy All
            </button>
          </div>

          {/* Editable Subject Field */}
          <div style={{ marginBottom: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
              <label style={{ fontSize: "11px", color: "#a1a1aa" }}>Subject Line:</label>
              <button
                onClick={() => void handleInsert("subject")}
                style={{ background: "#27272a", color: "#60a5fa", border: "none", padding: "2px 6px", borderRadius: "4px", fontSize: "10px", cursor: "pointer" }}
              >
                📌 Insert Subject
              </button>
            </div>
            <input
              type="text"
              value={draft.subject}
              onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
              style={{ width: "100%", padding: "6px 8px", background: "#09090b", border: "1px solid #3f3f46", borderRadius: "4px", color: "#fff", fontSize: "12px", boxSizing: "border-box" }}
            />
          </div>

          {/* Editable Body Field */}
          <div style={{ marginBottom: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
              <label style={{ fontSize: "11px", color: "#a1a1aa" }}>Body Copy:</label>
              <button
                onClick={() => void handleInsert("body")}
                style={{ background: "#27272a", color: "#34d399", border: "none", padding: "2px 6px", borderRadius: "4px", fontSize: "10px", cursor: "pointer" }}
              >
                📝 Insert Body
              </button>
            </div>
            <textarea
              rows={6}
              value={draft.body}
              onChange={(e) => setDraft({ ...draft, body: e.target.value })}
              style={{ width: "100%", padding: "8px", background: "#09090b", border: "1px solid #3f3f46", borderRadius: "4px", color: "#e4e4e7", fontSize: "12px", fontFamily: "sans-serif", lineHeight: 1.4, resize: "vertical", boxSizing: "border-box" }}
            />
          </div>

          {/* Re-prompt / Refinement Input */}
          <div style={{ background: "#09090b", border: "1px solid #27272a", borderRadius: "6px", padding: "8px", marginBottom: "12px" }}>
            <label style={{ display: "block", fontSize: "11px", color: "#a1a1aa", marginBottom: "4px" }}>🔄 Re-prompt / Refine Email:</label>
            <div style={{ display: "flex", gap: "6px" }}>
              <input
                type="text"
                value={refineText}
                onChange={(e) => setRefineText(e.target.value)}
                placeholder="e.g. Make it shorter, more casual, add a call..."
                style={{ flex: 1, padding: "6px", background: "#18181b", border: "1px solid #3f3f46", borderRadius: "4px", color: "#fff", fontSize: "11px" }}
              />
              <button
                disabled={busy || !refineText.trim()}
                onClick={() => void handleRefine()}
                style={{ padding: "6px 10px", background: "#8b5cf6", color: "#fff", border: "none", borderRadius: "4px", fontSize: "11px", fontWeight: 600, cursor: busy || !refineText.trim() ? "not-allowed" : "pointer" }}
              >
                Refine
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <button
            onClick={() => void handleInsert("both")}
            style={{ width: "100%", padding: "8px", background: "#059669", color: "#fff", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
          >
            ⚡ Insert Subject & Body into Active Tab
          </button>
        </div>
      )}
    </div>
  );
}
