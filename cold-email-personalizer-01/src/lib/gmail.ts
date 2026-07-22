import { compactText } from "./utils";
import type { InsertDraftRequest, ThreadContext } from "./types";

function queryAllText(selectors: string[]): string[] {
  for (const selector of selectors) {
    try {
      const nodes = Array.from(document.querySelectorAll<HTMLElement>(selector))
        .map((node) => compactText(node.innerText || node.textContent || ""))
        .filter(Boolean);
      if (nodes.length > 0) {
        return nodes;
      }
    } catch {
      // Continue
    }
  }
  return [];
}

function findActiveComposeBody(): HTMLElement | null {
  const candidates = Array.from(
    document.querySelectorAll<HTMLElement>(
      "div[role='textbox'][g_editable='true'], div[role='textbox'][aria-label*='Body'], div.Am.Al.editable, div[contenteditable='true'][role='textbox']"
    )
  );

  return candidates.find((node) => node.offsetParent !== null) ?? candidates[0] ?? null;
}

function findActiveSubjectInput(): HTMLInputElement | null {
  const candidates = Array.from(
    document.querySelectorAll<HTMLInputElement>(
      "input[name='subjectbox'], input[name='subject'], input[aria-label='Subject']"
    )
  );

  return candidates.find((node) => node.offsetParent !== null) ?? candidates[0] ?? null;
}

function setNativeValue(input: HTMLInputElement | HTMLElement, value: string): void {
  if (input instanceof HTMLInputElement) {
    const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
    descriptor?.set?.call(input, value);
  } else {
    input.innerText = value;
  }
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

export function extractGmailThread(doc: Document = document): ThreadContext | null {
  const messageBodies = queryAllText([
    "div.a3s.aiL",
    "div.a3s",
    "div[role='listitem'] div.a3s",
    "div[aria-label*='Message body']",
    "div.ii.gt"
  ]);

  const participants = queryAllText([
    "span[email]",
    ".gD",
    "span.zF",
    "span.hb",
    ".g2"
  ]);

  const subject =
    doc.querySelector<HTMLElement>("h2.hP")?.innerText ||
    doc.querySelector<HTMLElement>(".ha h2")?.innerText ||
    compactText(doc.title.replace(/\s*[-|]\s*Gmail.*/i, ""));

  const latestMessage = messageBodies.at(-1) || compactText(doc.body?.innerText || "").slice(0, 500);
  const quotedContext = messageBodies.length > 1 ? messageBodies.slice(0, -1).join("\n\n").slice(0, 3000) : "";

  if (!latestMessage && !subject) {
    return null;
  }

  return {
    threadUrl: doc.location.href,
    participants: Array.from(new Set(participants)).slice(0, 8),
    latestMessage: subject ? `Subject: ${subject}\n\n${latestMessage}` : latestMessage,
    quotedContext,
    replyGoal: "Reply helpfully to the most recent email and move the conversation forward."
  };
}

export function insertDraftIntoCompose(payload: InsertDraftRequest): boolean {
  const body = findActiveComposeBody();
  if (!body) {
    return false;
  }

  const subject = findActiveSubjectInput();
  if (subject && payload.subject) {
    setNativeValue(subject, payload.subject);
  }

  body.focus();
  setNativeValue(body, payload.body);
  return true;
}

