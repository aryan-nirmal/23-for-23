import type { Platform, ProductPreset, UserSettings } from '../types';
import {
  DEFAULT_ETSY_FEES,
  DEFAULT_SHOPIFY_FEES,
} from './calculator';

const SETTINGS_KEY = 'userSettings';
const PRESETS_KEY = 'productPresets';

export const DEFAULT_SETTINGS: UserSettings = {
  defaultCost: 0,
  defaultShipping: 0,
  etsyFees: { ...DEFAULT_ETSY_FEES },
  shopifyFees: { ...DEFAULT_SHOPIFY_FEES },
  useShopifyPayments: true,
};

export async function getSettings(): Promise<UserSettings> {
  const result = await chrome.storage.local.get(SETTINGS_KEY);
  const stored = result[SETTINGS_KEY] as Partial<UserSettings> | undefined;
  return { ...DEFAULT_SETTINGS, ...stored };
}

export async function saveSettings(settings: UserSettings): Promise<void> {
  await chrome.storage.local.set({ [SETTINGS_KEY]: settings });
}

export async function getPresets(): Promise<ProductPreset[]> {
  const result = await chrome.storage.local.get(PRESETS_KEY);
  return (result[PRESETS_KEY] as ProductPreset[] | undefined) ?? [];
}

export async function savePreset(preset: Omit<ProductPreset, 'id' | 'savedAt'>): Promise<ProductPreset> {
  const presets = await getPresets();
  const newPreset: ProductPreset = {
    ...preset,
    id: crypto.randomUUID(),
    savedAt: Date.now(),
  };
  presets.unshift(newPreset);
  await chrome.storage.local.set({ [PRESETS_KEY]: presets.slice(0, 50) });
  return newPreset;
}

export async function deletePreset(id: string): Promise<void> {
  const presets = await getPresets();
  await chrome.storage.local.set({
    [PRESETS_KEY]: presets.filter((p) => p.id !== id),
  });
}

export async function findPresetForPlatform(platform: Platform): Promise<ProductPreset | undefined> {
  const presets = await getPresets();
  return presets.find((p) => p.platform === platform);
}