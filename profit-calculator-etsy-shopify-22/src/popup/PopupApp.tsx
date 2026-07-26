import { useCallback, useEffect, useState } from 'react';
import type { ProductPreset, UserSettings } from '../types';
import { DEFAULT_ETSY_FEES, DEFAULT_SHOPIFY_FEES } from '../lib/calculator';
import {
  DEFAULT_SETTINGS,
  deletePreset,
  getPresets,
  getSettings,
  saveSettings,
} from '../lib/storage';

export default function PopupApp() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [presets, setPresets] = useState<ProductPreset[]>([]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getSettings(), getPresets()]).then(([s, p]) => {
      setSettings(s);
      setPresets(p);
      setLoading(false);
    });
  }, []);

  const update = useCallback(
    <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
      setSaved(false);
    },
    [],
  );

  const updateEtsyFee = (key: keyof UserSettings['etsyFees'], value: number) => {
    setSettings((prev) => ({
      ...prev,
      etsyFees: { ...prev.etsyFees, [key]: value },
    }));
    setSaved(false);
  };

  const updateShopifyFee = (
    key: keyof UserSettings['shopifyFees'],
    value: number,
  ) => {
    setSettings((prev) => ({
      ...prev,
      shopifyFees: { ...prev.shopifyFees, [key]: value },
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    await saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDeletePreset = async (id: string) => {
    await deletePreset(id);
    setPresets((prev) => prev.filter((p) => p.id !== id));
  };

  if (loading) {
    return (
      <div className="popup">
        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 12 }}>
          Loading…
        </p>
      </div>
    );
  }

  return (
    <div className="popup">
      <h1>Profit Calculator</h1>
      <p className="subtitle">Etsy & Shopify fee settings</p>

      <div className="section">
        <h2>Defaults</h2>
        <div className="field-row">
          <div className="field">
            <label>Default Cost ($)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={settings.defaultCost}
              onChange={(e) =>
                update('defaultCost', parseFloat(e.target.value) || 0)
              }
            />
          </div>
          <div className="field">
            <label>Default Shipping ($)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={settings.defaultShipping}
              onChange={(e) =>
                update('defaultShipping', parseFloat(e.target.value) || 0)
              }
            />
          </div>
        </div>
      </div>

      <div className="section">
        <h2>Etsy Fee Overrides</h2>
        <div className="fee-grid">
          <div className="field">
            <label>Transaction %</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={settings.etsyFees.percentFee}
              onChange={(e) =>
                updateEtsyFee('percentFee', parseFloat(e.target.value) || 0)
              }
            />
          </div>
          <div className="field">
            <label>Payment %</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={settings.etsyFees.paymentPercentFee}
              onChange={(e) =>
                updateEtsyFee(
                  'paymentPercentFee',
                  parseFloat(e.target.value) || 0,
                )
              }
            />
          </div>
          <div className="field">
            <label>Flat Fee ($)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={settings.etsyFees.flatFee}
              onChange={(e) =>
                updateEtsyFee('flatFee', parseFloat(e.target.value) || 0)
              }
            />
          </div>
        </div>
        <p style={{ fontSize: 10, color: '#94a3b8', marginTop: 6 }}>
          Default: {DEFAULT_ETSY_FEES.percentFee}% +{' '}
          {DEFAULT_ETSY_FEES.paymentPercentFee}% + $
          {DEFAULT_ETSY_FEES.flatFee.toFixed(2)}
        </p>
      </div>

      <div className="section">
        <h2>Shopify Fee Overrides</h2>
        <label className="checkbox-field">
          <input
            type="checkbox"
            checked={settings.useShopifyPayments}
            onChange={(e) => update('useShopifyPayments', e.target.checked)}
          />
          Using Shopify Payments
        </label>
        {settings.useShopifyPayments && (
          <div className="fee-grid" style={{ marginTop: 10 }}>
            <div className="field">
              <label>Processing %</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={settings.shopifyFees.percentFee}
                onChange={(e) =>
                  updateShopifyFee(
                    'percentFee',
                    parseFloat(e.target.value) || 0,
                  )
                }
              />
            </div>
            <div className="field">
              <label>Flat Fee ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={settings.shopifyFees.flatFee}
                onChange={(e) =>
                  updateShopifyFee('flatFee', parseFloat(e.target.value) || 0)
                }
              />
            </div>
          </div>
        )}
        <p style={{ fontSize: 10, color: '#94a3b8', marginTop: 6 }}>
          Default: {DEFAULT_SHOPIFY_FEES.percentFee}% + $
          {DEFAULT_SHOPIFY_FEES.flatFee.toFixed(2)}
        </p>
      </div>

      <div className="section">
        <h2>Saved Presets</h2>
        {presets.length === 0 ? (
          <p className="empty-presets">
            No presets yet. Save from the overlay on a product page.
          </p>
        ) : (
          <ul className="preset-list">
            {presets.map((p) => (
              <li key={p.id} className="preset-item">
                <span className="preset-name" title={p.name}>
                  {p.name}
                </span>
                <span className="preset-badge">{p.platform}</span>
                <button
                  className="preset-delete"
                  onClick={() => handleDeletePreset(p.id)}
                  title="Delete preset"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button className="save-btn" onClick={handleSave}>
        Save Settings
      </button>
      <div className="status">{saved ? '✓ Settings saved!' : ''}</div>
    </div>
  );
}