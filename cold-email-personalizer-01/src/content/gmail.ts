import { extractGmailThread, insertDraftIntoCompose } from "../lib/gmail";
import type { GmailExtractResponse, InsertDraftResponse } from "../lib/types";

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "gmail.extractThread") {
    const context = extractGmailThread();
    const response: GmailExtractResponse = context
      ? { ok: true, context }
      : {
          ok: false,
          reason: "Open a Gmail thread first, or paste the email text manually in the side panel."
        };
    sendResponse(response);
    return;
  }

  if (message.type === "gmail.insertDraft") {
    const ok = insertDraftIntoCompose(message.payload);
    const response: InsertDraftResponse = ok
      ? { ok: true }
      : {
          ok: false,
          reason: "No active Gmail compose box was found. Open Reply or Compose, then try again."
        };
    sendResponse(response);
  }
});
