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
  if (!tab?.id || !tab.url) {
    return { ok: false, reason: "No active tab found. Please switch to a browser tab." };
  }

  const url = tab.url;

  if (url.includes("linkedin.com")) {
    try {
      const scriptResults = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          function compactText(str: string): string {
            return (str || "").replace(/\s+/g, " ").trim();
          }

          function cleanLinkedInText(text: string): string {
            let cleaned = text;
            const footerMarkers = [
              "Select language",
              "Select Language",
              "About Accessibility Talent Solutions",
              "LinkedIn Corporation",
              "providers you might be interested in",
              "Recommendation transparency",
              "Questions? Visit our Help Center",
              "Manage your account and privacy",
              "Showcase your services as a section"
            ];

            for (const marker of footerMarkers) {
              const idx = cleaned.indexOf(marker);
              if (idx !== -1) {
                cleaned = cleaned.substring(0, idx);
              }
            }
            return cleaned.trim();
          }

          const isCompany = window.location.href.includes("/company/") || Boolean(document.querySelector(".org-top-card-summary__title, .org-top-card-summary-info-list"));

          if (isCompany) {
            const companyName = compactText(
              document.querySelector("h1.org-top-card-summary__title, .org-top-card-summary__title, h1")?.textContent ||
              document.title.replace(/\s*[-|]\s*LinkedIn.*/i, "").replace(/^\(\d+\)\s*/, "")
            );

            const tagline = compactText(
              document.querySelector(".org-top-card-summary__headline, .org-top-card-summary-info-list, p.break-words")?.textContent || ""
            );

            const aboutCompany = compactText(
              document.querySelector("section:has(#about) p, .org-about-organization-description, .org-about-module__description, section.artdeco-card p")?.textContent || ""
            );

            const companyDetails = Array.from(document.querySelectorAll("dl.overflow-hidden, .org-page-details-module__card, section.artdeco-card"))
              .map(el => compactText((el as HTMLElement).innerText || el.textContent || ""))
              .filter(t => t.length > 15 && !t.includes("Select language"))
              .slice(0, 5);

            const rawMainText = cleanLinkedInText(compactText((document.querySelector("main") as HTMLElement)?.innerText || document.body?.innerText || ""));

            return {
              sourceUrl: window.location.href,
              fullName: companyName,
              headline: tagline || "Company Overview",
              company: companyName,
              about: aboutCompany || rawMainText.slice(0, 3000),
              experienceHighlights: companyDetails,
              certifications: [],
              education: [],
              skills: [],
              projects: [],
              rawBodyText: rawMainText
            };
          }

          function extractSectionItems(keywords: string[]): string[] {
            const allSections = Array.from(document.querySelectorAll<HTMLElement>("section, div.artdeco-card"));
            const items: string[] = [];

            for (const sec of allSections) {
              const id = (sec.getAttribute("id") || "").toLowerCase();
              const anchor = sec.querySelector("[id]");
              const anchorId = (anchor?.getAttribute("id") || "").toLowerCase();
              const headerText = compactText(sec.querySelector("h2, h3, .pvs-header__title, span.t-bold")?.textContent || "").toLowerCase();

              if (headerText.includes("activity") || id.includes("activity") || anchorId.includes("activity")) {
                continue;
              }

              const matchesKeyword = keywords.some(
                (kw) => id.includes(kw) || anchorId.includes(kw) || headerText.includes(kw)
              );

              if (matchesKeyword) {
                const listNodes = Array.from(
                  sec.querySelectorAll<HTMLElement>(
                    ".pvs-list__paged-list-item, li.artdeco-list__item, li, .pvs-entity, div.display-flex.flex-column.full-width"
                  )
                );

                for (const node of listNodes) {
                  const text = cleanLinkedInText(compactText(node.innerText || node.textContent || ""));
                  if (
                    text.length > 10 &&
                    !/^show all/i.test(text) &&
                    !/^see all/i.test(text) &&
                    !items.includes(text)
                  ) {
                    items.push(text);
                  }
                }
              }
            }
            return items;
          }

          const metaTitle = document.querySelector('meta[property="og:title"]')?.getAttribute("content") || "";
          const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute("content") || "";

          const nameNode = document.querySelector("h1.text-heading-xlarge, h1, .pv-text-details__left-panel h1, .top-card-layout__title");
          const fullName = compactText(nameNode?.textContent || "") || compactText(metaTitle.replace(/\s*[-|]\s*LinkedIn.*/i, "")) || compactText(document.title.replace(/\s*[-|]\s*LinkedIn.*/i, ""));

          const cleanFullName = fullName.replace(/^\(\d+\)\s*/, "");

          const headlineNode = document.querySelector(".text-body-medium.break-words, .pv-text-details__left-panel .text-body-medium, .top-card-layout__headline, [data-generated-suggestion-target]");
          const headline = compactText(headlineNode?.textContent || "") || compactText(metaDesc);

          const companyNode = document.querySelector("#experience ~ div .t-bold span[aria-hidden='true'], section:has(#experience) .t-bold span[aria-hidden='true'], .top-card-layout__first-subline");
          const company = compactText(companyNode?.textContent || "");

          const aboutNode = document.querySelector("#about ~ div .display-flex.ph5.pv3 .full-width, section:has(#about) .pv-shared-text-with-see-more, section:has(#about) .inline-show-more-text, section.artdeco-card p");
          const about = compactText(aboutNode?.textContent || "");

          const experiences = extractSectionItems(["experience"]);
          const certifications = extractSectionItems(["license", "certification", "certifications"]);
          const education = extractSectionItems(["education"]);
          const skills = extractSectionItems(["skill", "skills"]);
          const projects = extractSectionItems(["project", "projects", "honor", "award"]);

          const mainEl = document.querySelector("main") || document.querySelector("div.scaffold-layout__main") || document.body;
          const rawBodyText = cleanLinkedInText(compactText(mainEl?.innerText || mainEl?.textContent || "").slice(0, 15000));

          return {
            sourceUrl: window.location.href,
            fullName: cleanFullName,
            headline,
            company,
            about,
            experienceHighlights: experiences,
            certifications,
            education,
            skills,
            projects,
            rawBodyText
          };
        }
      });

      const snapshot = scriptResults?.[0]?.result;
      if (snapshot && (snapshot.fullName || snapshot.headline || snapshot.rawBodyText)) {
        return { ok: true, snapshot };
      }
    } catch (e) {
      console.error("LinkedIn script execution failed", e);
    }
  }

  if (url.includes("mail.google.com")) {
    try {
      const scriptResults = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          function compactText(str: string): string {
            return (str || "").replace(/\s+/g, " ").trim();
          }

          const subject = compactText(
            document.querySelector<HTMLElement>("h2.hP")?.innerText ||
            document.querySelector<HTMLElement>(".ha h2")?.innerText ||
            document.title.replace(/\s*[-|]\s*Gmail.*/i, "")
          );

          const bodyNodes = Array.from(
            document.querySelectorAll<HTMLElement>("div.a3s.aiL, div.a3s, div[role='listitem'] div.a3s, div.ii.gt")
          ).map(n => compactText(n.innerText || n.textContent || "")).filter(Boolean);

          const participants = Array.from(
            document.querySelectorAll<HTMLElement>("span[email], .gD, span.zF, span.hb")
          ).map(n => compactText(n.innerText || n.textContent || "")).filter(Boolean);

          const latestMessage = bodyNodes.at(-1) || compactText(document.body?.innerText || "").slice(0, 5000);
          const quotedContext = bodyNodes.length > 1 ? bodyNodes.slice(0, -1).join("\n\n").slice(0, 8000) : "";

          return {
            threadUrl: window.location.href,
            subject,
            participants: Array.from(new Set(participants)).slice(0, 8),
            latestMessage: subject ? `Subject: ${subject}\n\n${latestMessage}` : latestMessage,
            quotedContext
          };
        }
      });

      const context = scriptResults?.[0]?.result;
      if (context) {
        return { ok: true, context };
      }
    } catch (e) {
      console.error("Gmail script execution failed", e);
    }
  }

  // Execute in-page extraction script directly on tab DOM
  try {
    const scriptResults = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        function compactText(str: string): string {
          return (str || "").replace(/\s+/g, " ").trim();
        }
        const title = compactText(document.title);
        const text = compactText(document.body?.innerText || "").slice(0, 10000);
        return { title, text, url: window.location.href };
      }
    });

    const pageData = scriptResults?.[0]?.result;
    if (pageData) {
      return {
        ok: true,
        context: {
          threadUrl: pageData.url,
          participants: [],
          latestMessage: `Page Title: ${pageData.title}\n\nContent:\n${pageData.text}`,
          quotedContext: "",
          replyGoal: "Write a relevant response based on the page content."
        }
      };
    }
  } catch (e) {
    console.error("Script execution failed", e);
  }

  return { ok: false, reason: "Could not extract context from the active tab." };
}

async function insertIntoGmail(subject: string, body: string, targetType: "subject" | "body" | "both" = "both"): Promise<InsertDraftResponse> {
  const tab = await getActiveTab();
  if (!tab?.id) {
    return { ok: false, reason: "No active tab found." };
  }

  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      args: [subject, body, targetType],
      func: (subjText, bodyText, mode) => {
        function insertTextIntoElement(el: HTMLElement, text: string): boolean {
          if (!el) return false;
          if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
            el.focus();
            const nativeSetter = Object.getOwnPropertyDescriptor(
              el instanceof HTMLInputElement ? HTMLInputElement.prototype : HTMLTextAreaElement.prototype,
              "value"
            )?.set;
            if (nativeSetter) {
              nativeSetter.call(el, text);
            } else {
              el.value = text;
            }
            el.dispatchEvent(new Event("input", { bubbles: true }));
            el.dispatchEvent(new Event("change", { bubbles: true }));
            return true;
          }
          if (el.isContentEditable || el.getAttribute("contenteditable") === "true" || el.getAttribute("role") === "textbox") {
            el.focus();
            try {
              document.execCommand("selectAll", false);
              document.execCommand("insertText", false, text);
              return true;
            } catch {
              el.innerText = text;
              el.dispatchEvent(new Event("input", { bubbles: true }));
              return true;
            }
          }
          return false;
        }

        let insertedSubject = false;
        let insertedBody = false;

        if (mode === "subject" || mode === "both") {
          const subjBox = document.querySelector<HTMLInputElement>(
            "input[name='subjectbox'], input[name='subject'], input[aria-label*='Subject'], input[aria-label*='subject']"
          );
          if (subjBox && subjText) {
            insertedSubject = insertTextIntoElement(subjBox, subjText);
          }
        }

        if (mode === "body" || mode === "both") {
          const active = document.activeElement as HTMLElement | null;
          if (active && active !== document.body && !active.getAttribute("name")?.includes("subject")) {
            insertedBody = insertTextIntoElement(active, bodyText);
          }

          if (!insertedBody) {
            const composeBoxes = Array.from(
              document.querySelectorAll<HTMLElement>(
                "div[role='textbox'][g_editable='true'], div.Am.Al.editable, div[role='textbox'], div[contenteditable='true'], textarea"
              )
            ).filter(el => !el.getAttribute("name")?.includes("subject"));

            const target = composeBoxes.find(el => el.offsetParent !== null) || composeBoxes[0];
            if (target) {
              insertedBody = insertTextIntoElement(target, bodyText);
            }
          }
        }

        if (insertedSubject || insertedBody) {
          return { ok: true, insertedSubject, insertedBody };
        }

        return { ok: false, reason: "No text field found. Click into your subject box or compose body first!" };
      }
    });

    const res = results?.[0]?.result;
    if (res && res.ok) {
      return { ok: true };
    }
    return { ok: false, reason: res?.reason || "Could not insert text into active field." };
  } catch (e) {
    return { ok: false, reason: e instanceof Error ? e.message : "Failed to execute insertion." };
  }
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
          await insertIntoGmail(message.payload.subject, message.payload.body, message.payload.targetType || "both")
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
