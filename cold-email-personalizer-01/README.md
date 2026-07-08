# Cold Email Personalizer Extension

Chrome/Edge Manifest V3 extension for:

- extracting visible LinkedIn profile context
- extracting the currently open Gmail thread
- generating cold emails or reply drafts with a user-supplied API key
- editing, copying, and inserting drafts without a backend

## Local development

```bash
npm install
npm run build
```

Load the built extension from:

`dist/`

In Chrome or Edge:

1. Open `chrome://extensions` or `edge://extensions`
2. Enable Developer Mode
3. Click `Load unpacked`
4. Select the `dist` folder

## Current v1 behavior

- LinkedIn extraction is DOM-based from the page the user has already opened.
- Gmail support is user-triggered compose assist only.
- No Gmail API or OAuth is used in v1.
- Settings, API key, saved pitches, and history are stored in `chrome.storage.local`.
- The default provider setup targets OpenRouter out of the box.

## Important limitation

The manifest currently includes host permission for `openrouter.ai` by default. If you switch to another inference provider endpoint, you may also need to add that host to `public/manifest.json` and rebuild so the extension can call it.
