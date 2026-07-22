import { compactText } from "./utils";
import type { ProspectSnapshot } from "./types";

function queryText(selectors: string[]): string {
  for (const selector of selectors) {
    try {
      const node = document.querySelector<HTMLElement>(selector);
      const text = compactText(node?.innerText || node?.textContent || "");
      if (text) {
        return text;
      }
    } catch {
      // Continue
    }
  }
  return "";
}

function extractSectionItems(sectionKeywords: string[]): string[] {
  const allSections = Array.from(document.querySelectorAll<HTMLElement>("section, div.artdeco-card"));
  const matchedSections: HTMLElement[] = [];

  for (const sec of allSections) {
    const id = sec.getAttribute("id") || "";
    const headerText = compactText(sec.querySelector("h2, h3, .pvs-header__title, span.t-bold")?.textContent || "").toLowerCase();
    
    const matchesKeyword = sectionKeywords.some(
      (kw) => id.toLowerCase().includes(kw) || headerText.includes(kw)
    );

    if (matchesKeyword) {
      matchedSections.push(sec);
    }
  }

  const items: string[] = [];

  for (const sec of matchedSections) {
    const listNodes = Array.from(
      sec.querySelectorAll<HTMLElement>(
        ".pvs-list__paged-list-item, li.artdeco-list__item, li, .pvs-entity, div.display-flex.flex-column.full-width"
      )
    );

    for (const node of listNodes) {
      const text = compactText(node.innerText || node.textContent || "");
      // Filter out meta buttons like "Show all 5 experiences"
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

  return items;
}

export function extractLinkedInProfile(doc: Document = document): ProspectSnapshot | null {
  const metaTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute("content") || "";
  const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute("content") || "";

  const fullName =
    queryText([
      "h1.text-heading-xlarge",
      "h1",
      ".pv-text-details__left-panel h1",
      ".top-card-layout__title",
      "div.ph5 h1"
    ]) ||
    compactText(metaTitle.replace(/\s*[-|]\s*LinkedIn.*/i, "")) ||
    compactText(doc.title.replace(/\s*[-|]\s*LinkedIn.*/i, ""));

  const headline = queryText([
    ".text-body-medium.break-words",
    ".pv-text-details__left-panel .text-body-medium",
    ".top-card-layout__headline",
    "div.text-body-medium",
    "[data-generated-suggestion-target]"
  ]) || compactText(metaDesc);

  const company = queryText([
    "#experience ~ div .t-bold span[aria-hidden='true']",
    "section:has(#experience) .t-bold span[aria-hidden='true']",
    ".pv-text-details__left-panel .inline-show-more-text",
    ".top-card-layout__first-subline",
    "div.pv-entity__company-summary-info"
  ]);

  const about = queryText([
    "#about ~ div .display-flex.ph5.pv3 .full-width",
    "section:has(#about) .pv-shared-text-with-see-more",
    "section:has(#about) .inline-show-more-text",
    "#about ~ * .inline-show-more-text",
    "section.artdeco-card p"
  ]);

  const experiences = extractSectionItems(["experience"]);
  const certifications = extractSectionItems(["license", "certification", "certifications"]);
  const education = extractSectionItems(["education"]);
  const skills = extractSectionItems(["skill", "skills"]);
  const projects = extractSectionItems(["project", "projects", "honor", "award"]);

  if (!fullName && !headline && !about && experiences.length === 0) {
    return null;
  }

  return {
    sourceUrl: doc.location.href,
    fullName,
    headline,
    company,
    about,
    experienceHighlights: experiences,
    certifications,
    education,
    skills,
    projects
  };
}
