import type { DetectedPrice } from '../types';

const PRICE_SELECTORS = [
  'input[name="price"]',
  '#product-price',
  '[data-product-price] input',
  '.Polaris-TextField__Input[name="price"]',
  'input[aria-labelledby*="price" i]',
  'input[placeholder="0.00"]',
  '.product-form__price input',
  '[class*="Price"] input[type="text"]',
  '[class*="price"] input',
];

const TITLE_SELECTORS = [
  'input[name="title"]',
  '#product-title',
  '.Polaris-TextField__Input[name="title"]',
  'input[aria-labelledby*="title" i]',
  'textarea[name="title"]',
];

function parsePriceFromText(text: string): number | null {
  const cleaned = text.replace(/[^0-9.,]/g, '').replace(/,/g, '');
  const value = parseFloat(cleaned);
  return isNaN(value) ? null : value;
}

function findInputValue(selectors: string[]): string | null {
  for (const selector of selectors) {
    const elements = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(selector);
    for (const el of elements) {
      if (el.value && el.offsetParent !== null) return el.value;
    }
  }
  return null;
}

export function isShopifyProductPage(): boolean {
  const host = window.location.hostname;
  const path = window.location.pathname;

  if (host === 'admin.shopify.com') {
    return path.includes('/products/');
  }

  if (host.endsWith('.myshopify.com')) {
    return path.includes('/admin/products/');
  }

  return false;
}

export function detectShopifyPrice(): DetectedPrice | null {
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

export function watchShopifyPrice(onChange: (detected: DetectedPrice | null) => void): () => void {
  const check = () => onChange(detectShopifyPrice());

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