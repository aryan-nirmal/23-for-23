# Profit Calculator for Etsy and Shopify Sellers

## MRD

### Executive Summary
Profit Calculator for Etsy and Shopify Sellers is a browser extension that overlays true margin calculations directly on listing or product-edit pages. Sellers routinely underprice products because platform fees, payment fees, shipping, packaging, labor, and ad spend are fragmented across tools. The product's value is immediacy: margin visibility appears where pricing decisions are made, not later in a spreadsheet.

### Target Market
Primary persona: Etsy seller
- solo maker or small shop
- manually prices products
- often underestimates fee impact

Primary persona: Shopify solo merchant
- edits products frequently and needs quick margin feedback

Secondary persona: ecommerce consultant helping small shops optimize pricing

### Market Size
- TAM estimate: millions of small ecommerce sellers on marketplaces and storefront platforms.
- SAM estimate: 300,000 active sellers who would install a pricing assistant extension.
- SOM estimate: 10,000 installs and 1,500 paid users in 3 years.

### Problem Statement
Profit calculations are usually detached from listing workflows. Sellers only realize margin issues after the fact because fee structures and hidden costs are not visible at edit time. The gap is an in-context calculator that combines platform-specific fees with seller-entered cost assumptions.

### Competitive Landscape
| Competitor | Pricing | Strengths | Weaknesses |
| --- | --- | --- | --- |
| spreadsheets/manual calculators | flexible and cheap | customizable | disconnected from product page context |
| Etsy seller tools | marketplace ecosystem familiarity | some seller analytics | not focused on on-page true margin overlay |
| Shopify analytics apps | richer ecommerce metrics | broader reporting | less immediate for pricing edits |

### Differentiation Strategy
- in-page extension overlay
- seller-specific cost model including labor and ads
- break-even and minimum-price recommendations
- low-friction freemium model

### Business Model
- Free Etsy-only basic calculator
- Pro: $6/month adds saved profiles, ads calculation, Shopify support
- Consultant: $19/month multi-store profile management

### Go-to-Market Strategy
- Chrome Web Store
- seller community partnerships and creator demos
- first 100 users via Etsy seller groups and pricing-focused content

## PRD

### Purpose and Vision
Vision statement: show sellers their real margin while they are setting the price, not after they ship the order.

The product helps small sellers make better pricing decisions by embedding profit math directly into existing product-edit workflows.

### Target Audience
Persona 1: Leah, handmade Etsy seller
- Goals: avoid underpricing products after fees and labor
- Frustrations: platform fees feel opaque
- Day-in-the-life: updates listing prices based on competitor pressure and only later sees margins collapse

Persona 2: Rohit, small Shopify merchant
- Goals: understand break-even after shipping and app costs
- Frustrations: many cost inputs live outside the storefront admin
- Day-in-the-life: edits catalog pricing regularly and wants in-context decision support

### Feature List
- Must-have: on-page extension overlay
- Must-have: selling price auto-detection
- Must-have: fee calculation logic
- Must-have: seller-entered cost inputs
- Must-have: profit per unit and margin percentage
- Must-have: break-even and recommended minimum price
- Should-have: saved cost profiles
- Could-have: ad spend and conversion-rate profitability analysis
- Won't-have for v1: direct repricing automation

### User Stories
1. As a seller, I want the extension to detect listing price automatically.
2. As a seller, I want to enter material and labor cost.
3. As a seller, I want fees applied automatically by platform.
4. As a seller, I want profit and margin shown immediately.
5. As a seller, I want break-even price displayed.
6. As a seller, I want saved presets by product category.
7. As a Shopify merchant, I want support for my admin page later.
8. As a product owner, I want fee tables updateable without hardcoding rebuilds where possible.

### Acceptance Criteria
- extension identifies supported product edit pages
- price is read correctly from page DOM for supported layouts
- manual costs recalculate output instantly
- results show profit amount, margin %, and break-even price
- presets save and reload properly

### User Flow
1. Seller opens supported listing page
2. Extension detects product price
3. Overlay appears
4. Seller enters or selects cost preset
5. Calculator shows margin and recommended minimum price
6. Seller adjusts price accordingly

### Non-Functional Requirements
- overlay renders under 1 second after page detection
- resilient selectors with error fallback
- no collection of sensitive marketplace credentials
- local-first data storage for presets

### Constraints and Dependencies
- platform DOM changes can break selectors
- fee tables change over time and need update path
- browser-store policy compliance matters

## TRD

### System Architecture
Chrome extension with content scripts for Etsy/Shopify pages, popup/options page for settings, and background service worker for configuration updates. Most logic runs client-side. Optional backend later distributes fee-table updates and user sync for paid plans.

### Technology Stack
| Layer | Recommendation | Justification |
| --- | --- | --- |
| Extension UI | React + TypeScript | maintainable overlay UI |
| Platform | Manifest V3 | current Chrome standard |
| Storage | chrome.storage.local/sync | preset and config storage |
| Optional backend | lightweight API | fee-table and paid-user sync |

### API Design
Primary interfaces are extension events and optional config endpoints.

| Method | Path/Event | Request | Response | Auth |
| --- | --- | --- | --- | --- |
| internal | `detectListingContext` | DOM context | supported page payload | Local |
| internal | `calculateProfit` | price, fees, costs | margin result | Local |
| internal | `savePreset` | preset data | preset id | Local |
| internal | `loadPresets` | none | preset list | Local |
| GET | `/api/v1/fee-tables` | platform | current fee config | Optional bearer |
| POST | `/api/v1/account/sync` | local settings | sync result | Optional bearer |

### Data Models
| Store | Fields | Notes |
| --- | --- | --- |
| `presets` | id, name, material_cost, labor_rate, labor_hours, packaging_cost, shipping_cost | local storage |
| `fee_tables` | platform, version, fixed_fee, variable_rate, notes | local cache or backend sync |

### Third-Party Integrations
- none required for free version
- optional backend for fee updates and paid sync

### Security Architecture
- local-only operation by default
- no credential collection
- minimal permissions scoped to supported domains

### Infrastructure and DevOps
- extension build pipeline
- automated DOM-selector tests against sample fixtures
- store release versioning

### Scalability Plan
Local computation scales cheaply. If sync and fee updates are added, backend remains lightweight and mostly read-heavy. Selector maintenance is the operational scaling concern, not infrastructure load.

## Production Requirements

### Required Components
- Content-script overlay
- Fee-table configuration model
- Saved presets in local storage

### Recommended Free Stack
- No backend required for v1
- Local extension storage for presets and settings
- Add `Supabase` only for account sync or hosted fee-table updates

### Production Notes
- A database is not required for the first production version
- DOM selector maintenance is mandatory
- Fee logic should be config-driven, not deeply hardcoded
