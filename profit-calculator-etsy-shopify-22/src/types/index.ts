export type Platform = 'etsy' | 'shopify';

export interface FeeConfig {
  /** Percentage fee (e.g. 6.5 for 6.5%) */
  percentFee: number;
  /** Additional percentage fee (Etsy payment processing) */
  paymentPercentFee: number;
  /** Flat fee per transaction in dollars */
  flatFee: number;
}

export interface UserSettings {
  defaultCost: number;
  defaultShipping: number;
  etsyFees: FeeConfig;
  shopifyFees: FeeConfig;
  useShopifyPayments: boolean;
}

export interface ProductPreset {
  id: string;
  name: string;
  platform: Platform;
  cost: number;
  shipping: number;
  savedAt: number;
}

export interface ProfitResult {
  price: number;
  cost: number;
  shipping: number;
  platformFees: number;
  totalFees: number;
  profit: number;
  marginPercent: number;
  breakEvenPrice: number;
}

export interface DetectedPrice {
  price: number;
  currency: string;
  productTitle?: string;
}