import type { DetectedPrice } from '../types';

const PRICE_SELECTORS = [
  'input[name="price"]',
  'input[data-field="price"]',
  '#price',
  'input[aria-label*="Price" i]',
  'input[placeholder*="price" i]',
  '[data-testid="price-input"] input',
  '.listing-edit-price input[type="text"]',
  '.wt-input[name="price"]',
];

const TITLE_SELECTORS = [
  'input[name="title"]',
  'textarea[name="title"]',
  '#title',
  'input[aria-label*="Title" i]',
  '[data-testid="title-input"]',
];

function parsePriceFromText(text: string): number | null {
  const cleaned = text.replace(/[^0-9.,]/g, '').replace(/,/g, '');
  const value = parseFloat(cleaned);
  return isNaN(value) ? null : value;
}

function findInputValue(selectors: string[]): string | null {
  for (const selector of selectors) {
    const el = document.querySelector<HTMLInputElement | HTMLTextAreaElement>(selector);
    if (el?.value) return el.value;
  }
  return null;
}

export function isEtsyProductPage(): boolean {
  const host = window.location.hostname;
  if (!host.includes('etsy.com')) return false;

  const path = window.location.pathname;
  return (
    path.includes('/listing/') ||
    path.includes('/listings/') ||
    path.includes('/listing-editor')
  );
}

export function detectEtsyPrice(): DetectedPrice | null {
  const rawPrice = findInputValue(PRICE_SELECTORS);
  if (!rawPrice) return null;

  const price = parsePriceFromText(rawPrice);
  if (price === null || price <= 0) return null;

  const title = findInputValue(TITLE_SELECTORS) ?? undefined;

  return {
    price,
    currency: 'USD',
    productTitle: title,
  };
}

export function watchEtsyPrice(onChange: (detected: DetectedPrice | null) => void): () => void {
  const check = () => onChange(detectEtsyPrice());

  check();

  const observer = new MutationObserver(check);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['value'],
  });

  const handleInput = (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.matches?.('input, textarea')) {
      check();
    }
  };

  document.addEventListener('input', handleInput, true);
  document.addEventListener('change', handleInput, true);

  const interval = setInterval(check, 2000);

  return () => {
    observer.disconnect();
    document.removeEventListener('input', handleInput, true);
    document.removeEventListener('change', handleInput, true);
    clearInterval(interval);
  };
}