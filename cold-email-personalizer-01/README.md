# Cold Email & Reply AI Personalizer — Chrome Extension (Project 01)

> **Part of the [23 for 23 Monorepo Challenge](https://github.com/aryan-nirmal/23-for-23)** — 23 production-grade MVPs, all open-source.

A local-first, model-agnostic Chrome Extension (Manifest V3) built with **Vite, React 19, TypeScript, and OpenRouter**. It extracts live context from LinkedIn profiles (personal & company) and Gmail threads to generate personalized, high-converting outreach emails and replies without a backend server.

---

## 🌟 Key Features

- ⚡ **1-Click Live DOM Context Extraction**: Extracts structured profile data (Name, Headline, About, Work Experience, Certifications, Education, Projects, Skills) from LinkedIn and email thread context from Gmail.
- 🏢 **Full Company Page Support**: Automatically detects and extracts LinkedIn Company Pages (`/company/...`) including Company Overview, Tagline, Size, Specialties, and Headquarters.
- 🧹 **Noise-Free Content Parser**: Automatically strips out page clutter (language selection menus, site footers, ad recommendation widgets, and activity feed posts).
- ⚙️ **Collapsible Settings Bar**: Minimize or hide provider credentials once configured. Auto-sanitizes endpoint URLs (`/chat/completions`).
- 🤖 **Model Agnostic (OpenRouter)**: Works out of the box with `openrouter/auto`, OpenAI, Claude 3.5, Gemini, LLaMA, or any custom OpenAI-compatible endpoint.
- ✏️ **In-Place Editable Output**: Edit Subject lines and Body copy directly in the extension panel before copying or inserting.
- 🔄 **AI Re-Prompting / Refinement**: Type follow-up instructions (*"Make it shorter"*, *"Add a 15% discount offer"*, *"Write in a casual tone"*) to refine drafts on the fly.
- 📌 **Universal Text Field Insertion**: Inserts Subject and Body directly into Gmail compose windows, LinkedIn message boxes, or any focused text field on the web.
- 🔒 **100% On-Device & Privacy-First**: API keys and options are stored strictly in `chrome.storage.local`. No analytics, no tracking, no intermediate server.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Platform** | Chrome Extension Manifest V3 (Side Panel API & Background Service Worker) |
| **Framework** | React 19, TypeScript 5 |
| **Bundler** | Vite 6 |
| **API Provider** | OpenRouter (Model Agnostic — GPT-4o, Claude 3.5, Gemini 1.5, LLaMA 3.1) |
| **Storage** | `chrome.storage.local` (Zero backend dependency) |

---

## 🚀 Step-by-Step Setup & Walkthrough

### 1. Build the Extension Locally

```bash
# Navigate to the project directory
cd cold-email-personalizer-01

# Install dependencies
npm install

# Build production assets into dist/
npm run build
```

---

### 2. Load into Chrome

1. Open Google Chrome and navigate to **`chrome://extensions`**
2. Enable **Developer mode** (toggle in the top-right corner).
3. Click **Load unpacked**.
4. Select the **`dist/`** folder inside `cold-email-personalizer-01`.
5. Pin the **Cold Email Personalizer** icon to your Chrome toolbar.

---

### 3. Setup Your AI Provider Key

1. Click the extension icon to open the Side Panel.
2. Click **⚙️ Model Settings** (if not open automatically).
3. Enter your **OpenRouter API Key** (get one free at [openrouter.ai/keys](https://openrouter.ai/keys)).
4. Default settings:
   - **Endpoint**: `https://openrouter.ai/api/v1/chat/completions`
   - **Model Slug**: `openrouter/auto`
5. Click **Save & Hide Settings**.

---

### 4. How to Use

#### A. Generating LinkedIn Outreach
1. Navigate to any LinkedIn Profile (`/in/...`) or Company Page (`/company/...`).
2. Open the Side Panel and click **`⚡ Extract Active Page Context`**.
3. The extension parses the DOM and populates the **Context & Prompt Box**.
4. Type your custom goal under `[INSTRUCTION]` (e.g. *"Write a casual networking email asking for a 15-minute advice call"*).
5. Click **`🚀 Generate Email Draft`**.

#### B. Generating Gmail Replies
1. Open any email thread in Gmail (`mail.google.com`).
2. Click **`⚡ Extract Active Page Context`**.
3. The latest message and thread context will be extracted.
4. Type your response intent and click **`🚀 Generate Email Draft`**.

#### C. In-Place Editing & Refinement
- **Edit**: Click directly inside the **Subject** or **Body** text boxes to make manual edits.
- **Refine**: Type an instruction in the **Re-prompt / Refine** box (e.g. *"Make it 2 sentences shorter"*) and click **Refine**.

#### D. Universal Insertion
- Click **`📌 Insert Subject`** to set the email subject.
- Click **`📝 Insert Body`** to insert the body text into your active message area.
- Click **`⚡ Insert Subject & Body into Active Tab`** to populate both into Gmail.
- All actions automatically copy the text to your clipboard as a backup.

---

## 📁 Project Structure

```text
cold-email-personalizer-01/
├── dist/                    # Compiled Chrome extension production bundle
├── public/
│   └── manifest.json        # Manifest V3 extension configuration
├── src/
│   ├── background/
│   │   └── index.ts         # Service worker & scripting execution handler
│   ├── content/
│   │   ├── gmail.ts         # Gmail DOM extractor script
│   │   └── linkedin.ts      # LinkedIn DOM profile & section parser
│   ├── lib/
│   │   ├── ai.ts            # OpenRouter API client & JSON draft parser
│   │   ├── chrome.ts        # Active tab helpers
│   │   ├── defaults.ts      # Extension default settings & storage shapes
│   │   ├── prompts.ts       # Flexible prompt construction logic
│   │   ├── storage.ts       # chrome.storage.local wrapper
│   │   ├── types.ts         # TypeScript interface definitions
│   │   └── utils.ts         # Text normalization & compacting utilities
│   ├── sidepanel/
│   │   ├── main.tsx         # Side panel React entry point
│   │   └── SidePanelApp.tsx # Main Side Panel UI component
│   ├── options/
│   │   ├── main.tsx         # Options page entry point
│   │   └── OptionsApp.tsx   # Import/Export backup options UI
│   └── popup/
│       └── PopupApp.tsx     # Extension popup fallback interface
├── package.json
├── tsconfig.json
└── vite.config.ts           # Multi-entry Vite extension build configuration
```

---

## 📄 License

Distributed under the MIT License. See [LICENSE](../../LICENSE) for details.
