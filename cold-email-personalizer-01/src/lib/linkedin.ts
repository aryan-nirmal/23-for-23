import { compactText } from "./utils";
import type { ProspectSnapshot } from "./types";

function queryText(selectors: string[]): string {
  for (const selector of selectors) {
    const node = document.querySelector<HTMLElement>(selector);
    const text = compactText(node?.innerText || node?.textContent || "");
    if (text) {
      return text;
    }
  }
  return "";
}

function collectHighlights(): string[] {
  const selectors = [
    "#experience ~ div .pvs-list__paged-list-item",
    "#experience ~ * .pvs-list__paged-list-item",
    "section:has(#experience) li",
    "main section li.artdeco-list__item"
  ];

  for (const selector of selectors) {
    const items = Array.from(document.querySelectorAll<HTMLElement>(selector))
      .map((node) => compactText(node.innerText))
      .filter((text) => text.length > 20)
      .slice(0, 4);

    if (items.length > 0) {
      return items;
    }
  }

  return [];
}

export function extractLinkedInProfile(doc: Document = document): ProspectSnapshot | null {
  const fullName =
    queryText(["h1", ".text-heading-xlarge", ".pv-text-details__left-panel h1"]) ||
    compactText(doc.title.replace("| LinkedIn", ""));

  const headline = queryText([
    ".text-body-medium.break-words",
    ".pv-text-details__left-panel .text-body-medium",
    ".top-card-layout__headline"
  ]);

  const company = queryText([
    "#experience ~ div .t-bold span[aria-hidden='true']",
    ".pv-text-details__left-panel .inline-show-more-text",
    ".top-card-layout__first-subline"
  ]);

  const about = queryText([
    "#about ~ div .display-flex.ph5.pv3 .full-width",
    "#about ~ * .inline-show-more-text",
    "section.artdeco-card p"
  ]);

  if (!fullName && !headline && !about) {
    return null;
  }

  return {
    sourceUrl: doc.location.href,
    fullName,
    headline,
    company,
    about,
    experienceHighlights: collectHighlights()
  };
}
