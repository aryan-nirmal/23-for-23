import { getActiveTab, sendMessageToTab } from "../lib/chrome";
import { generateDraft } from "../lib/ai";
import { addGmailHistory, addProspectHistory, addSavedPitch, deleteSavedPitch, importStore, loadStore, updateSettings } from "../lib/storage";
import { createId } from "../lib/utils";
import type {
  ActiveContext,
  EmailDraft,
  GenerationInput,
  GmailExtractResponse,
  InsertDraftResponse,
  LinkedInExtractResponse,
  SavedPitch,
  Settings,
  StorageShape
} from "../lib/types";

async function getActiveContext(): Promise<ActiveContext> {
  const tab = await getActiveTab();
  const url = tab?.url ?? "";
  const title = tab?.title ?? "";

  if (url.includes("linkedin.com")) {
    return { page: "linkedin", url, title };
  }

  if (url.includes("mail.google.com")) {
    return { page: "gmail", url, title };
  }

  return { page: "unsupported", url, title };
}

async function extractCurrentPage() {
  const tab = await getActiveTab();
  if (!tab?.id) {
    throw new Error("No active tab found.");
  }

  const context = await getActiveContext();

  if (context.page === "linkedin") {
    return sendMessageToTab<LinkedInExtractResponse>(tab.id, { type: "linkedin.extract" });
  }

  if (context.page === "gmail") {
    return sendMessageToTab<GmailExtractResponse>(tab.id, { type: "gmail.extractThread" });
  }

  return { ok: false, reason: "Current page is not supported yet." };
}

async function insertIntoGmail(subject: string, body: string): Promise<InsertDraftResponse> {
  const tab = await getActiveTab();
  if (!tab?.id) {
    return { ok: false, reason: "No active Gmail tab found." };
  }

  const context = await getActiveContext();
  if (context.page !== "gmail") {
    return { ok: false, reason: "Open Gmail before inserting a draft." };
  }

  return sendMessageToTab<InsertDraftResponse>(tab.id, {
    type: "gmail.insertDraft",
    payload: { subject, body }
  });
}

async function generateAndPersist(input: GenerationInput): Promise<EmailDraft> {
  const store = await loadStore();
  const draft = await generateDraft(input, store.settings);

  if (input.mode === "cold_email" && input.prospectSnapshot) {
    await addProspectHistory({
      id: createId("prospect"),
      sourceUrl: input.prospectSnapshot.sourceUrl,
      snapshot: input.prospectSnapshot,
      lastPitch: input.pitch,
      lastDraft: draft,
      createdAt: new Date().toISOString()
    });
  }

  if (input.mode === "gmail_reply" && input.threadContext) {
    await addGmailHistory({
      id: createId("gmail"),
      threadUrl: input.threadContext.threadUrl,
      context: input.threadContext,
      draft,
      createdAt: new Date().toISOString()
    });
  }

  return draft;
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  (async () => {
    switch (message.type) {
      case "background.getActiveContext":
        sendResponse(await getActiveContext());
        break;
      case "background.extractCurrentPage":
        sendResponse(await extractCurrentPage());
        break;
      case "background.generateDraft":
        sendResponse(await generateAndPersist(message.payload as GenerationInput));
        break;
      case "background.getStore":
        sendResponse(await loadStore());
        break;
      case "background.updateSettings":
        sendResponse(await updateSettings(message.payload as Settings));
        break;
      case "background.savePitch":
        sendResponse(
          await addSavedPitch({
            ...(message.payload as SavedPitch),
            id: createId("pitch"),
            createdAt: new Date().toISOString()
          })
        );
        break;
      case "background.deletePitch":
        sendResponse(await deleteSavedPitch(message.payload.id));
        break;
      case "background.insertIntoGmail":
        sendResponse(
          await insertIntoGmail(message.payload.subject, message.payload.body)
        );
        break;
      case "background.importStore":
        sendResponse(await importStore(message.payload as StorageShape));
        break;
      default:
        sendResponse(null);
    }
  })().catch((error: unknown) => {
    const messageText = error instanceof Error ? error.message : "Unexpected extension error.";
    sendResponse({ error: messageText });
  });

  return true;
});
