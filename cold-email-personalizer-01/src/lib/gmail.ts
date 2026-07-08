import { compactText } from "./utils";
import type { InsertDraftRequest, ThreadContext } from "./types";

function queryAllText(selectors: string[]): string[] {
  for (const selector of selectors) {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(selector))
      .map((node) => compactText(node.innerText || node.textContent || ""))
      .filter(Boolean);
    if (nodes.length > 0) {
      return nodes;
    }
  }
  return [];
}

function findActiveComposeBody(): HTMLElement | null {
  const candidates = Array.from(
    document.querySelectorAll<HTMLElement>("div[role='textbox'][g_editable='true']")
  );

  return candidates.find((node) => node.offsetParent !== null) ?? null;
}

function findActiveSubjectInput(): HTMLInputElement | null {
  const candidates = Array.from(
    document.querySelectorAll<HTMLInputElement>("input[name='subjectbox']")
  );

  return candidates.find((node) => node.offsetParent !== null) ?? null;
}

function setNativeValue(input: HTMLInputElement | HTMLElement, value: string): void {
  if (input instanceof HTMLInputElement) {
    const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
    descriptor?.set?.call(input, value);
  } else {
    input.textContent = value;
  }
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

export function extractGmailThread(doc: Document = document): ThreadContext | null {
  const messageBodies = queryAllText(["div.a3s.aiL", "div[role='listitem'] div.a3s"]);
  const participants = queryAllText(["span[email]", ".gD"]);

  const latestMessage = messageBodies.at(-1) ?? "";
  const quotedContext = messageBodies.slice(0, -1).join("\n\n").slice(0, 3000);

  if (!latestMessage) {
    return null;
  }

  return {
    threadUrl: doc.location.href,
    participants: Array.from(new Set(participants)).slice(0, 8),
    latestMessage,
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
  if (subject) {
    setNativeValue(subject, payload.subject);
  }

  body.focus();
  setNativeValue(body, payload.body.replace(/\n/g, "\n"));
  return true;
}
