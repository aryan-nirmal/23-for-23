# Profit Calculator — Etsy & Shopify

A Chrome extension (Manifest V3) that overlays a profit calculator on Etsy and Shopify product edit pages. Built with **Vite**, **React 19**, and **TypeScript**.

## Features

- **Content script overlay** on Etsy listing editor and Shopify admin product pages
- **Auto-detects product price** from page inputs (with manual fallback)
- **Platform fee calculations**
  - Etsy: 6.5% transaction + 3% payment processing + $0.20 (configurable)
  - Shopify Payments: 2.9% + $0.30 (configurable)
- **Profit metrics**: profit, margin %, break-even price
- **Popup settings** for default cost/shipping and fee overrides
- **Product presets** saved to `chrome.storage.local`

## Quick Start

```bash
npm install
npm run build
```

### Load in Chrome

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `dist` folder

## Development

```bash
npm run dev
```

CRXJS enables hot-reload during development. Reload the extension in `chrome://extensions` after changes.

## Project Structure

```
├── public/
│   ├── manifest.json       # MV3 manifest with host permissions
│   └── icons/
├── src/
│   ├── content/
│   │   ├── overlay.tsx     # React overlay panel (content script entry)
│   │   ├── etsy.ts         # Etsy price detection
│   │   └── shopify.ts      # Shopify price detection
│   ├── popup/
│   │   ├── PopupApp.tsx    # Settings & presets UI
│   │   └── index.html
│   └── lib/
│       ├── calculator.ts   # Fee & profit math
│       └── storage.ts      # chrome.storage.local helpers
```

## Supported Pages

| Platform | URL Pattern |
|----------|-------------|
| Etsy | `etsy.com/your/shops/*/listing/*`, `/your/listings/*` |
| Shopify | `admin.shopify.com/store/*/products/*`, `*.myshopify.com/admin/products/*` |

## Usage

1. Open a product edit page on Etsy or Shopify
2. The **Profit Calc** panel appears in the top-right corner
3. Enter your product cost and shipping cost
4. View calculated fees, profit, margin, and break-even price
5. Click the extension icon to configure defaults and fee overrides

## License

MIT