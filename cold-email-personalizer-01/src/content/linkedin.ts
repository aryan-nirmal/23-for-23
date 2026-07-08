import { extractLinkedInProfile } from "../lib/linkedin";
import type { LinkedInExtractResponse } from "../lib/types";

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type !== "linkedin.extract") {
    return;
  }

  const snapshot = extractLinkedInProfile();
  const response: LinkedInExtractResponse = snapshot
    ? { ok: true, snapshot }
    : {
        ok: false,
        reason: "No visible LinkedIn profile data was found. Try scrolling the profile or use manual paste."
      };

  sendResponse(response);
});
