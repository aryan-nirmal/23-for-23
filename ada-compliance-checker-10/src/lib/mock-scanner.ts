import type { ScanResult, ScanSummary, Severity, Violation } from "./types";

const VIOLATION_TEMPLATES: Omit<Violation, "id">[] = [
  {
    ruleId: "image-alt",
    title: "Images must have alternate text",
    description:
      "Ensures <img> elements have alternate text or a role of none or presentation.",
    severity: "critical",
    category: "Images",
    selector: "img.hero-banner",
    fix: 'Add a descriptive alt attribute: <img src="hero.jpg" alt="Team collaborating in modern office">',
    wcagCriteria: "WCAG 2.1 A — 1.1.1 Non-text Content",
  },
  {
    ruleId: "image-alt",
    title: "Images must have alternate text",
    description:
      "Ensures <img> elements have alternate text or a role of none or presentation.",
    severity: "critical",
    category: "Images",
    selector: "img[src='/logo.svg']",
    fix: 'Add alt text describing the logo: <img src="/logo.svg" alt="Acme Corp logo">',
    wcagCriteria: "WCAG 2.1 A — 1.1.1 Non-text Content",
  },
  {
    ruleId: "color-contrast",
    title: "Elements must have sufficient color contrast",
    description:
      "Ensures the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds.",
    severity: "serious",
    category: "Color & Contrast",
    selector: "p.text-muted",
    fix: "Change text color from #999999 to #595959 on white background (4.5:1 ratio required).",
    wcagCriteria: "WCAG 2.1 AA — 1.4.3 Contrast (Minimum)",
  },
  {
    ruleId: "color-contrast",
    title: "Elements must have sufficient color contrast",
    description:
      "Ensures the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds.",
    severity: "serious",
    category: "Color & Contrast",
    selector: "button.btn-secondary",
    fix: "Increase button text contrast — current ratio 2.8:1, needs 4.5:1 for normal text.",
    wcagCriteria: "WCAG 2.1 AA — 1.4.3 Contrast (Minimum)",
  },
  {
    ruleId: "label",
    title: "Form elements must have labels",
    description:
      "Ensures every form element has a visible label or accessible name.",
    severity: "critical",
    category: "Forms",
    selector: "input#email",
    fix: 'Associate a label: <label for="email">Email address</label><input id="email" type="email">',
    wcagCriteria: "WCAG 2.1 A — 1.3.1 Info and Relationships",
  },
  {
    ruleId: "label",
    title: "Form elements must have labels",
    description:
      "Ensures every form element has a visible label or accessible name.",
    severity: "serious",
    category: "Forms",
    selector: "input.search-input",
    fix: 'Add aria-label or visible label: <input class="search-input" aria-label="Search products">',
    wcagCriteria: "WCAG 2.1 A — 4.1.2 Name, Role, Value",
  },
  {
    ruleId: "heading-order",
    title: "Heading levels should only increase by one",
    description:
      "Ensures the order of headings is semantically correct (h1 → h2 → h3, not h1 → h4).",
    severity: "moderate",
    category: "Structure",
    selector: "h4.section-title",
    fix: "Change <h4> to <h2> or add intermediate heading levels to maintain proper hierarchy.",
    wcagCriteria: "WCAG 2.1 A — 1.3.1 Info and Relationships",
  },
  {
    ruleId: "heading-order",
    title: "Page must contain a level-one heading",
    description: "Ensures the page has a single, descriptive h1 element.",
    severity: "serious",
    category: "Structure",
    selector: "body > main",
    fix: "Add a single <h1> element that describes the main purpose of the page.",
    wcagCriteria: "WCAG 2.1 A — 2.4.6 Headings and Labels",
  },
  {
    ruleId: "link-name",
    title: "Links must have discernible text",
    description:
      "Ensures links have accessible text for screen readers.",
    severity: "serious",
    category: "Navigation",
    selector: "a.read-more > i.icon-arrow",
    fix: 'Add visible or aria-hidden text: <a href="/article" aria-label="Read full article">Read more</a>',
    wcagCriteria: "WCAG 2.1 A — 2.4.4 Link Purpose (In Context)",
  },
  {
    ruleId: "button-name",
    title: "Buttons must have discernible text",
    description:
      "Ensures buttons have accessible text for assistive technologies.",
    severity: "critical",
    category: "Controls",
    selector: "button.modal-close",
    fix: 'Add aria-label: <button class="modal-close" aria-label="Close dialog">×</button>',
    wcagCriteria: "WCAG 2.1 A — 4.1.2 Name, Role, Value",
  },
  {
    ruleId: "aria-valid-attr",
    title: "ARIA attributes must be valid",
    description:
      "Ensures ARIA attributes are valid and not misspelled.",
    severity: "moderate",
    category: "ARIA",
    selector: "div[aria-labeledby='nav-title']",
    fix: 'Fix typo: change aria-labeledby to aria-labelledby="nav-title"',
    wcagCriteria: "WCAG 2.1 A — 4.1.2 Name, Role, Value",
  },
  {
    ruleId: "tabindex",
    title: "Elements should not have tabindex greater than zero",
    description:
      "Ensures tabindex values are not greater than 0 to preserve natural tab order.",
    severity: "minor",
    category: "Keyboard",
    selector: "div.custom-widget[tabindex='5']",
    fix: "Remove tabindex or set to 0. Use DOM order for natural keyboard navigation.",
    wcagCriteria: "WCAG 2.1 A — 2.4.3 Focus Order",
  },
  {
    ruleId: "html-has-lang",
    title: "<html> element must have a lang attribute",
    description:
      "Ensures every HTML document has a lang attribute for screen readers.",
    severity: "serious",
    category: "Document",
    selector: "html",
    fix: 'Add lang attribute: <html lang="en">',
    wcagCriteria: "WCAG 2.1 A — 3.1.1 Language of Page",
  },
  {
    ruleId: "meta-viewport",
    title: "Zooming and scaling must not be disabled",
    description:
      "Ensures <meta name=\"viewport\"> does not disable text scaling and zooming.",
    severity: "moderate",
    category: "Document",
    selector: 'meta[name="viewport"]',
    fix: 'Remove user-scalable=no: <meta name="viewport" content="width=device-width, initial-scale=1">',
    wcagCriteria: "WCAG 2.1 AA — 1.4.4 Resize Text",
  },
  {
    ruleId: "frame-title",
    title: "Frames must have an accessible name",
    description:
      "Ensures <iframe> and <frame> elements have a title attribute.",
    severity: "serious",
    category: "Frames",
    selector: "iframe#payment-widget",
    fix: 'Add title: <iframe id="payment-widget" title="Secure payment form">',
    wcagCriteria: "WCAG 2.1 A — 4.1.2 Name, Role, Value",
  },
  {
    ruleId: "landmark-one-main",
    title: "Document must have one main landmark",
    description:
      "Ensures the document has a main landmark for screen reader navigation.",
    severity: "moderate",
    category: "Landmarks",
    selector: "body",
    fix: "Wrap primary content in <main> element or add role=\"main\".",
    wcagCriteria: "WCAG 2.1 A — 1.3.1 Info and Relationships",
  },
  {
    ruleId: "skip-link",
    title: "Page should have a mechanism to bypass blocks",
    description:
      "Ensures a skip navigation link is present for keyboard users.",
    severity: "minor",
    category: "Navigation",
    selector: "body",
    fix: 'Add skip link as first focusable element: <a href="#main" class="skip-link">Skip to main content</a>',
    wcagCriteria: "WCAG 2.1 A — 2.4.1 Bypass Blocks",
  },
];

function generateId(): string {
  return crypto.randomUUID();
}

function computeSummary(violations: Violation[]): ScanSummary {
  const summary: ScanSummary = {
    critical: 0,
    serious: 0,
    moderate: 0,
    minor: 0,
    total: violations.length,
  };

  for (const v of violations) {
    summary[v.severity]++;
  }

  return summary;
}

function selectViolations(url: string): Violation[] {
  const hash = url.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const count = 8 + (hash % 6);
  const selected: Violation[] = [];

  for (let i = 0; i < count; i++) {
    const template = VIOLATION_TEMPLATES[i % VIOLATION_TEMPLATES.length];
    selected.push({
      ...template,
      id: generateId(),
    });
  }

  const severityOrder: Record<Severity, number> = {
    critical: 0,
    serious: 1,
    moderate: 2,
    minor: 3,
  };

  return selected.sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
  );
}

export function mockScan(url: string): ScanResult {
  const violations = selectViolations(url);

  return {
    id: generateId(),
    url,
    scannedAt: new Date().toISOString(),
    violations,
    summary: computeSummary(violations),
  };
}