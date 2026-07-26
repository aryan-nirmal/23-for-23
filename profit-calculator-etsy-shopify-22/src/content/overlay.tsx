import { useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { DetectedPrice, Platform, UserSettings } from '../types';
import {
  calculateProfit,
  formatCurrency,
  formatPercent,
  getFeesForPlatform,
  parsePriceInput,
} from '../lib/calculator';
import { getSettings, savePreset } from '../lib/storage';
import { detectEtsyPrice, isEtsyProductPage, watchEtsyPrice } from './etsy';
import {
  detectShopifyPrice,
  isShopifyProductPage,
  watchShopifyPrice,
} from './shopify';
import './overlay.css';

function getPlatform(): Platform | null {
  if (isEtsyProductPage()) return 'etsy';
  if (isShopifyProductPage()) return 'shopify';
  return null;
}

function OverlayPanel() {
  const platform = getPlatform();
  const [collapsed, setCollapsed] = useState(false);
  const [detected, setDetected] = useState<DetectedPrice | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [cost, setCost] = useState('');
  const [shipping, setShipping] = useState('');
  const [manualPrice, setManualPrice] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ dragging: false, offsetX: 0, offsetY: 0 });

  useEffect(() => {
    getSettings().then((s) => {
      setSettings(s);
      setCost(String(s.defaultCost || ''));
      setShipping(String(s.defaultShipping || ''));
    });
  }, []);

  useEffect(() => {
    if (!platform) return;

    const detect = platform === 'etsy' ? detectEtsyPrice : detectShopifyPrice;
    const watch = platform === 'etsy' ? watchEtsyPrice : watchShopifyPrice;

    setDetected(detect());
    return watch(setDetected);
  }, [platform]);

  const price =
    detected?.price ??
    (manualPrice ? parsePriceInput(manualPrice) : 0);

  const costNum = parsePriceInput(cost);
  const shippingNum = parsePriceInput(shipping);

  const fees =
    settings && platform
      ? getFeesForPlatform(platform, settings.etsyFees, settings.shopifyFees)
      : null;

  const result =
    fees && price > 0
      ? calculateProfit(price, costNum, shippingNum, fees)
      : null;

  const handleSavePreset = useCallback(async () => {
    if (!platform || !detected?.productTitle) return;
    await savePreset({
      name: detected.productTitle,
      platform,
      cost: costNum,
      shipping: shippingNum,
    });
  }, [platform, detected, costNum, shippingNum]);

  const onMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.pc-toggle-btn')) return;
    const panel = panelRef.current;
    if (!panel) return;
    dragRef.current = {
      dragging: true,
      offsetX: e.clientX - panel.offsetLeft,
      offsetY: e.clientY - panel.offsetTop,
    };
    panel.style.right = 'auto';
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragRef.current.dragging || !panelRef.current) return;
      panelRef.current.style.left = `${e.clientX - dragRef.current.offsetX}px`;
      panelRef.current.style.top = `${e.clientY - dragRef.current.offsetY}px`;
    };
    const onUp = () => {
      dragRef.current.dragging = false;
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, []);

  if (!platform) return null;

  const marginColor =
    result && result.marginPercent >= 30
      ? '#16a34a'
      : result && result.marginPercent >= 15
        ? '#ca8a04'
        : '#dc2626';

  return (
    <div
      ref={panelRef}
      className={`pc-panel${collapsed ? ' pc-collapsed' : ''}`}
    >
      <div className="pc-header" onMouseDown={onMouseDown}>
        <span className="pc-header-title">💰 Profit Calc</span>
        <span className="pc-header-badge">{platform}</span>
        <button
          className="pc-toggle-btn"
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? '◀' : '▶'}
        </button>
      </div>

      {!collapsed && (
        <div className="pc-body">
          {detected?.productTitle && (
            <div className="pc-product-title" title={detected.productTitle}>
              {detected.productTitle}
            </div>
          )}

          {detected ? (
            <div className="pc-row">
              <label>Detected Price</label>
              <span className="pc-detected-price">
                {formatCurrency(detected.price)}
              </span>
            </div>
          ) : (
            <div className="pc-input-group">
              <label>Price (manual)</label>
              <input
                type="text"
                placeholder="0.00"
                value={manualPrice}
                onChange={(e) => setManualPrice(e.target.value)}
              />
            </div>
          )}

          <div className="pc-input-group">
            <label>Product Cost ($)</label>
            <input
              type="text"
              placeholder="0.00"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
          </div>

          <div className="pc-input-group">
            <label>Shipping Cost ($)</label>
            <input
              type="text"
              placeholder="0.00"
              value={shipping}
              onChange={(e) => setShipping(e.target.value)}
            />
          </div>

          {result ? (
            <>
              <hr className="pc-divider" />

              <div className="pc-result-row">
                <span className="pc-label">Platform Fees</span>
                <span className="pc-value">
                  {formatCurrency(result.platformFees)}
                </span>
              </div>
              {fees && (
                <div className="pc-fee-breakdown">
                  {platform === 'etsy'
                    ? `${fees.percentFee}% + ${fees.paymentPercentFee}% + $${fees.flatFee.toFixed(2)}`
                    : `${fees.percentFee}% + $${fees.flatFee.toFixed(2)}`}
                </div>
              )}

              <div className="pc-result-row">
                <span className="pc-label">Break-even Price</span>
                <span className="pc-value">
                  {formatCurrency(result.breakEvenPrice)}
                </span>
              </div>

              <hr className="pc-divider" />

              <div className="pc-result-row">
                <span className="pc-label">Profit</span>
                <span
                  className={`pc-value ${result.profit >= 0 ? 'pc-profit-positive' : 'pc-profit-negative'}`}
                >
                  {formatCurrency(result.profit)}
                </span>
              </div>

              <div className="pc-result-row">
                <span className="pc-label">Margin</span>
                <span
                  className={`pc-value ${result.marginPercent >= 0 ? 'pc-profit-positive' : 'pc-profit-negative'}`}
                >
                  {formatPercent(result.marginPercent)}
                </span>
              </div>

              <div className="pc-margin-bar">
                <div
                  className="pc-margin-fill"
                  style={{
                    width: `${Math.min(Math.max(result.marginPercent, 0), 100)}%`,
                    background: marginColor,
                  }}
                />
              </div>

              <div className="pc-actions">
                <button
                  className="pc-btn pc-btn-primary"
                  onClick={handleSavePreset}
                  disabled={!detected?.productTitle}
                >
                  Save Preset
                </button>
              </div>
            </>
          ) : (
            <div className="pc-no-price">
              Enter a price on the page or manually above to see profit calculations.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function mountOverlay() {
  if (document.getElementById('pc-overlay-root')) return;

  const container = document.createElement('div');
  container.id = 'pc-overlay-root';
  document.body.appendChild(container);

  const root = createRoot(container);
  root.render(<OverlayPanel />);
}

mountOverlay();