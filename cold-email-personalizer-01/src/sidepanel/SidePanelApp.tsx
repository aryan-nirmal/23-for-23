import { useEffect, useMemo, useState } from "react";
import { defaultSettings } from "../lib/defaults";
import { createId } from "../lib/utils";
import type {
  ActiveContext,
  EmailDraft,
  GenerationInput,
  GmailExtractResponse,
  LinkedInExtractResponse,
  ProspectSnapshot,
  SavedPitch,
  Settings,
  StorageShape,
  ThreadContext,
  Tone,
  ProviderSettings
} from "../lib/types";

type ErrorLike = { error?: string; reason?: string };

async function sendRuntimeMessage<T>(message: unknown): Promise<T> {
  return chrome.runtime.sendMessage(message) as Promise<T>;
}

function emptyProspect(): ProspectSnapshot {
  return {
    sourceUrl: "",
    fullName: "",
    headline: "",
    company: "",
    about: "",
    experienceHighlights: []
  };
}

function emptyThread(): ThreadContext {
  return {
    threadUrl: "",
    participants: [],
    latestMessage: "",
    quotedContext: "",
    replyGoal: "Reply helpfully and move the conversation forward."
  };
}

export function SidePanelApp() {
  const [activeContext, setActiveContext] = useState<ActiveContext | null>(null);
  const [store, setStore] = useState<StorageShape | null>(null);
  const [snapshot, setSnapshot] = useState<ProspectSnapshot>(emptyProspect());
  const [threadContext, setThreadContext] = useState<ThreadContext>(emptyThread());
  const [pitchName, setPitchName] = useState("");
  const [pitch, setPitch] = useState("");
  const [cta, setCta] = useState(defaultSettings.defaultCta);
  const [tone, setTone] = useState<Tone>(defaultSettings.defaultTone);
  const [draft, setDraft] = useState<EmailDraft | null>(null);
  const [status, setStatus] = useState("Ready.");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void initialize();
  }, []);

  async function initialize() {
    const [context, nextStore] = await Promise.all([
      sendRuntimeMessage<ActiveContext>({ type: "background.getActiveContext" }),
      sendRuntimeMessage<StorageShape>({ type: "background.getStore" })
    ]);

    setActiveContext(context);
    setStore(nextStore);
    setCta(nextStore.settings.defaultCta);
    setTone(nextStore.settings.defaultTone);
  }

  const isLinkedIn = activeContext?.page === "linkedin";
  const isGmail = activeContext?.page === "gmail";

  const canGenerateColdEmail = Boolean(
    (snapshot.fullName || snapshot.about || snapshot.headline) && pitch.trim().length >= 20
  );
  const canGenerateReply = Boolean(
    (threadContext.latestMessage || threadContext.quotedContext) && pitch.trim().length >= 20
  );

  const prospectSummary = useMemo(
    () =>
      [snapshot.fullName, snapshot.headline, snapshot.company]
        .filter(Boolean)
        .join(" • "),
    [snapshot]
  );

  async function handleExtract() {
    setBusy(true);
    setStatus("Extracting context from the current page...");
    setDraft(null);

    try {
      const response = await sendRuntimeMessage<
        LinkedInExtractResponse | GmailExtractResponse | ErrorLike
      >({ type: "background.extractCurrentPage" });

      if ("error" in response && response.error) {
        throw new Error(response.error);
      }

      if (isLinkedIn) {
        const result = response as LinkedInExtractResponse;
        if (!result.ok || !result.snapshot) {
          throw new Error(result.reason || "LinkedIn extraction failed.");
        }
        setSnapshot(result.snapshot);
        setStatus("LinkedIn profile extracted. Review and edit before generating.");
        return;
      }

      if (isGmail) {
        const result = response as GmailExtractResponse;
        if (!result.ok || !result.context) {
          throw new Error(result.reason || "Gmail extraction failed.");
        }
        setThreadContext(result.context);
        setStatus("Gmail thread extracted. Review the draft goal and generate a reply.");
        return;
      }

      setStatus("This page is not supported. Use the manual paste fields below.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Extraction failed.");
    } finally {
      setBusy(false);
    }
  }

  async function handleGenerate(mode: GenerationInput["mode"]) {
    if (!store) {
      return;
    }

    setBusy(true);
    setStatus("Generating draft...");

    try {
      const input: GenerationInput =
        mode === "cold_email"
          ? {
              mode,
              prospectSnapshot: snapshot,
              pitch,
              cta,
              tone
            }
          : {
              mode,
              threadContext,
              pitch,
              cta,
              tone
            };

      const response = await sendRuntimeMessage<EmailDraft | ErrorLike>({
        type: "background.generateDraft",
        payload: input
      });

      if ("error" in response && response.error) {
        throw new Error(response.error);
      }

      setDraft(response as EmailDraft);
      setStatus("Draft generated. Edit before copying or inserting.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Generation failed.");
    } finally {
      setBusy(false);
    }
  }

  async function handleInsertIntoGmail() {
    if (!draft) {
      return;
    }

    setBusy(true);
    setStatus("Trying to insert the draft into Gmail...");

    try {
      const response = await sendRuntimeMessage<{ ok?: boolean; reason?: string; error?: string }>({
        type: "background.insertIntoGmail",
        payload: { subject: draft.subject, body: draft.body }
      });

      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.ok) {
        throw new Error(response.reason || "Could not insert into Gmail.");
      }

      setStatus("Draft inserted into the active Gmail compose box.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Insert failed.");
    } finally {
      setBusy(false);
    }
  }

  async function handleSavePitch() {
    if (!pitch.trim()) {
      setStatus("Enter a pitch before saving it.");
      return;
    }

    const payload: SavedPitch = {
      id: createId("local"),
      name: pitchName.trim() || "Untitled pitch",
      pitch,
      targetPersona: isGmail ? "gmail-reply" : "cold-outreach",
      cta,
      createdAt: new Date().toISOString()
    };

    const next = await sendRuntimeMessage<SavedPitch[]>({
      type: "background.savePitch",
      payload
    });

    if (store) {
      setStore({ ...store, savedPitches: next });
    }

    setStatus("Pitch saved locally.");
  }

  async function handleDeletePitch(id: string) {
    const next = await sendRuntimeMessage<SavedPitch[]>({
      type: "background.deletePitch",
      payload: { id }
    });

    if (store) {
      setStore({ ...store, savedPitches: next });
    }

    setStatus("Saved pitch removed.");
  }

  async function handleUpdateSettings(partial: SettingsPatch) {
    if (!store) {
      return;
    }

    const nextSettings = {
      ...store.settings,
      ...partial,
      provider: {
        ...store.settings.provider,
        ...(partial.provider ?? {})
      }
    };

    const response = await sendRuntimeMessage<Settings>({
      type: "background.updateSettings",
      payload: nextSettings
    });

    const nextStore = { ...store, settings: response };
    setStore(nextStore);
    setTone(response.defaultTone);
    setCta(response.defaultCta);
    setStatus("Settings updated locally.");
  }

  function applySavedPitch(savedPitch: SavedPitch) {
    setPitchName(savedPitch.name);
    setPitch(savedPitch.pitch);
    setCta(savedPitch.cta);
    setStatus(`Loaded saved pitch "${savedPitch.name}".`);
  }

  async function copyText(label: string, text: string) {
    await navigator.clipboard.writeText(text);
    setStatus(`${label} copied to clipboard.`);
  }

  return (
    <div className="shell">
      <header className="hero">
        <p className="eyebrow">Cold Email Personalizer</p>
        <h1>Turn live profile and inbox context into send-ready drafts.</h1>
        <p className="subtle">
          LinkedIn for outbound. Gmail for reply assist. Your API key stays in local extension storage.
        </p>
      </header>

      <section className="statusCard">
        <div>
          <strong>Current page</strong>
          <p>{activeContext ? `${activeContext.page} • ${activeContext.title || activeContext.url}` : "Loading..."}</p>
        </div>
        <button className="primaryButton" disabled={busy} onClick={handleExtract}>
          {busy ? "Working..." : isGmail ? "Extract Gmail Thread" : isLinkedIn ? "Extract LinkedIn Profile" : "Refresh Context"}
        </button>
      </section>

      <section className="grid">
        <article className="panel">
          <div className="panelHeader">
            <h2>Context</h2>
            <span>{isGmail ? "Gmail" : isLinkedIn ? "LinkedIn" : "Manual"}</span>
          </div>

          {isGmail ? (
            <>
              <label>
                Participants
                <input
                  value={threadContext.participants.join(", ")}
                  onChange={(event) =>
                    setThreadContext({
                      ...threadContext,
                      participants: event.target.value
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean)
                    })
                  }
                />
              </label>
              <label>
                Reply goal
                <input
                  value={threadContext.replyGoal}
                  onChange={(event) =>
                    setThreadContext({ ...threadContext, replyGoal: event.target.value })
                  }
                />
              </label>
              <label>
                Latest message
                <textarea
                  rows={6}
                  value={threadContext.latestMessage}
                  onChange={(event) =>
                    setThreadContext({ ...threadContext, latestMessage: event.target.value })
                  }
                />
              </label>
              <label>
                Quoted context
                <textarea
                  rows={5}
                  value={threadContext.quotedContext}
                  onChange={(event) =>
                    setThreadContext({ ...threadContext, quotedContext: event.target.value })
                  }
                />
              </label>
            </>
          ) : (
            <>
              <label>
                Full name
                <input
                  value={snapshot.fullName}
                  onChange={(event) => setSnapshot({ ...snapshot, fullName: event.target.value })}
                />
              </label>
              <label>
                Headline
                <input
                  value={snapshot.headline}
                  onChange={(event) => setSnapshot({ ...snapshot, headline: event.target.value })}
                />
              </label>
              <label>
                Company
                <input
                  value={snapshot.company}
                  onChange={(event) => setSnapshot({ ...snapshot, company: event.target.value })}
                />
              </label>
              <label>
                About / pasted profile text
                <textarea
                  rows={6}
                  value={snapshot.about}
                  onChange={(event) => setSnapshot({ ...snapshot, about: event.target.value })}
                />
              </label>
              <label>
                Experience highlights
                <textarea
                  rows={4}
                  value={snapshot.experienceHighlights.join("\n")}
                  onChange={(event) =>
                    setSnapshot({
                      ...snapshot,
                      experienceHighlights: event.target.value
                        .split("\n")
                        .map((item) => item.trim())
                        .filter(Boolean)
                    })
                  }
                />
              </label>
              {prospectSummary ? <p className="summary">{prospectSummary}</p> : null}
            </>
          )}
        </article>

        <article className="panel">
          <div className="panelHeader">
            <h2>Pitch and settings</h2>
            <span>Prompt inputs</span>
          </div>

          <label>
            Pitch template name
            <input value={pitchName} onChange={(event) => setPitchName(event.target.value)} />
          </label>
          <label>
            Product pitch
            <textarea
              rows={6}
              value={pitch}
              onChange={(event) => setPitch(event.target.value)}
              placeholder="Describe the product, the pain it solves, and who it helps."
            />
          </label>
          <label>
            CTA
            <input value={cta} onChange={(event) => setCta(event.target.value)} />
          </label>
          <label>
            Tone
            <select value={tone} onChange={(event) => setTone(event.target.value as Tone)}>
              <option value="formal">Formal</option>
              <option value="casual">Casual</option>
              <option value="startup-friendly">Startup-friendly</option>
            </select>
          </label>

          <div className="row">
            <button
              className="primaryButton"
              disabled={busy || !canGenerateColdEmail}
              onClick={() => handleGenerate("cold_email")}
            >
              Generate cold email
            </button>
            <button
              className="secondaryButton"
              disabled={busy || !canGenerateReply}
              onClick={() => handleGenerate("gmail_reply")}
            >
              Generate Gmail reply
            </button>
          </div>

          <div className="row">
            <button className="secondaryButton" onClick={handleSavePitch}>
              Save pitch
            </button>
            <button
              className="secondaryButton"
              onClick={() =>
                void handleUpdateSettings({
                  defaultTone: tone,
                  defaultCta: cta
                })
              }
            >
              Save defaults
            </button>
          </div>

          <div className="miniSettings">
            <h3>Provider</h3>
            <label>
              Provider name
              <input
                value={store?.settings.provider.providerName ?? ""}
                onChange={(event) =>
                  void handleUpdateSettings({
                    provider: {
                      providerName: event.target.value
                    }
                  })
                }
              />
            </label>
            <label>
              Endpoint
              <input
                value={store?.settings.provider.endpoint ?? ""}
                onChange={(event) =>
                  void handleUpdateSettings({
                    provider: {
                      endpoint: event.target.value
                    }
                  })
                }
              />
            </label>
            <label>
              Model
              <input
                value={store?.settings.provider.model ?? ""}
                onChange={(event) =>
                  void handleUpdateSettings({
                    provider: {
                      model: event.target.value
                    }
                  })
                }
              />
            </label>
            <label>
              API key
              <input
                type="password"
                value={store?.settings.provider.apiKey ?? ""}
                onChange={(event) =>
                  void handleUpdateSettings({
                    provider: {
                      apiKey: event.target.value
                    }
                  })
                }
              />
            </label>
          </div>

          <div className="savedList">
            <div className="panelHeader">
              <h3>Saved pitches</h3>
              <span>{store?.savedPitches.length ?? 0}</span>
            </div>
            {store?.savedPitches.length ? (
              store.savedPitches.map((item) => (
                <div className="savedItem" key={item.id}>
                  <button className="textButton" onClick={() => applySavedPitch(item)}>
                    <strong>{item.name}</strong>
                    <span>{item.pitch}</span>
                  </button>
                  <button className="dangerButton" onClick={() => void handleDeletePitch(item.id)}>
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <p className="subtle">No saved pitches yet.</p>
            )}
          </div>
        </article>
      </section>

      <section className="panel draftPanel">
        <div className="panelHeader">
          <h2>Draft</h2>
          <span>Edit before you send</span>
        </div>

        {draft ? (
          <>
            <label>
              Subject
              <input
                value={draft.subject}
                onChange={(event) => setDraft({ ...draft, subject: event.target.value })}
              />
            </label>
            <label>
              Body
              <textarea
                rows={10}
                value={draft.body}
                onChange={(event) => setDraft({ ...draft, body: event.target.value })}
              />
            </label>
            <label>
              Follow-up
              <textarea
                rows={5}
                value={draft.followUp ?? ""}
                onChange={(event) => setDraft({ ...draft, followUp: event.target.value })}
              />
            </label>
            <div className="row">
              <button className="primaryButton" onClick={() => void copyText("Body", draft.body)}>
                Copy body
              </button>
              <button
                className="secondaryButton"
                onClick={() => void copyText("Subject", draft.subject)}
              >
                Copy subject
              </button>
              <button
                className="secondaryButton"
                disabled={!isGmail}
                onClick={() => void handleInsertIntoGmail()}
              >
                Insert into Gmail
              </button>
            </div>

            <div className="rationale">
              <h3>Why this personalization</h3>
              {draft.rationale.map((item, index) => (
                <p key={`${item}-${index}`}>{item}</p>
              ))}
            </div>
          </>
        ) : (
          <p className="subtle">
            Generate a draft to review the subject line, reply copy, and personalization rationale here.
          </p>
        )}
      </section>

      <footer className="footerStatus">{status}</footer>
    </div>
  );
}
type SettingsPatch = Omit<Partial<Settings>, "provider"> & {
  provider?: Partial<ProviderSettings>;
};
