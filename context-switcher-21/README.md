# Context Switcher Extension

Chrome Manifest V3 extension for freelancers and consultants juggling multiple client projects.

Save the current window's tabs as a named project state with notes and checklists, then restore everything in one click.

## Features

- **Save project state** — capture tab URLs and titles from the current window
- **Popup UI** — list saved projects, restore tabs, delete projects
- **Side panel** — rename projects, edit notes, add/remove checklist items
- **Local persistence** — all data stored in `chrome.storage.local` (up to 20 projects on free tier)
- **Keyboard shortcut** — `Ctrl+Shift+K` (Windows/Linux) or `⌘⇧K` (Mac) opens the popup

## Local development

```bash
npm install
npm run build
```

Load the built extension from `dist/`:

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `dist` folder

## Usage

1. Open the tabs you need for a client project
2. Click the extension icon (or press the keyboard shortcut)
3. Name the project and click **Save project state**
4. Later, click **Restore** to reopen all saved tabs
5. Click **Edit details** to open the side panel for notes and checklists

## Permissions

| Permission | Why |
| --- | --- |
| `storage` | Persist project states locally |
| `tabs` | Read current window tabs and restore saved URLs |
| `sidePanel` | Detailed project editing UI |

No host permissions, no remote data transfer, no account required.

## Project structure

```
context-switcher-21/
├── public/manifest.json
├── src/
│   ├── background/index.ts    # Save/restore message handlers
│   ├── popup/                   # Quick save, list, restore, delete
│   ├── sidepanel/               # Detailed edit UI
│   └── lib/
│       ├── storage.ts           # chrome.storage.local CRUD
│       └── types.ts             # Project state schema
├── popup.html
├── sidepanel.html
└── vite.config.ts
```

## Data model

Each project state stores:

- `id`, `name`, `tabs[]` (url + title)
- `note` (free-text context)
- `checklist[]` (id, text, done)
- `createdAt`, `updatedAt`

## Limitations (v1)

- Saves tabs from the **current window** only
- Restore opens tabs in the **current window** (does not close existing tabs)
- Chrome internal URLs (`chrome://`, `chrome-extension://`) are excluded from saves
- Free tier capped at **20** saved projects
- No cloud sync (planned for paid tier)