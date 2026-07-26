import type { FeeConfig, Platform, ProfitResult } from '../types';

/** Default Etsy fees: 6.5% transaction + 3% payment processing + $0.20 */
export const DEFAULT_ETSY_FEES: FeeConfig = {
  percentFee: 6.5,
  paymentPercentFee: 3,
  flatFee: 0.2,
};

/** Default Shopify Payments fees: 2.9% + $0.30 */
export const DEFAULT_SHOPIFY_FEES: FeeConfig = {
  percentFee: 2.9,
  paymentPercentFee: 0,
  flatFee: 0.3,
};

export function getFeesForPlatform(
  platform: Platform,
  etsyFees: FeeConfig,
  shopifyFees: FeeConfig,
): FeeConfig {
  return platform === 'etsy' ? etsyFees : shopifyFees;
}

export function calculatePlatformFees(price: number, fees: FeeConfig): number {
  if (price <= 0) return 0;
  const percentTotal = fees.percentFee + fees.paymentPercentFee;
  return price * (percentTotal / 100) + fees.flatFee;
}

export function calculateProfit(
  price: number,
  cost: number,
  shipping: number,
  fees: FeeConfig,
): ProfitResult {
  const platformFees = calculatePlatformFees(price, fees);
  const totalFees = platformFees;
  const profit = price - cost - shipping - totalFees;
  const marginPercent = price > 0 ? (profit / price) * 100 : 0;
  const breakEvenPrice = calculateBreakEven(cost, shipping, fees);

  return {
    price,
    cost,
    shipping,
    platformFees,
    totalFees,
    profit,
    marginPercent,
    breakEvenPrice,
  };
}

/** Solve for price where profit = 0: price - cost - shipping - (price * pct + flat) = 0 */
export function calculateBreakEven(
  cost: number,
  shipping: number,
  fees: FeeConfig,
): number {
  const percentTotal = (fees.percentFee + fees.paymentPercentFee) / 100;
  const numerator = cost + shipping + fees.flatFee;
  const denominator = 1 - percentTotal;

  if (denominator <= 0) return Infinity;
  return numerator / denominator;
}

export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function parsePriceInput(value: string): number {
  const cleaned = value.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}