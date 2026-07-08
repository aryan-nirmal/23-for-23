import { useEffect, useState } from "react";
import type { ActiveContext } from "../lib/types";

export function PopupApp() {
  const [context, setContext] = useState<ActiveContext | null>(null);

  useEffect(() => {
    chrome.runtime
      .sendMessage({ type: "background.getActiveContext" })
      .then((result: ActiveContext) => setContext(result))
      .catch(() => setContext(null));
  }, []);

  return (
    <div className="popupShell">
      <p className="eyebrow">Cold Email Personalizer</p>
      <h1>Open the side panel to generate drafts from the page you are viewing.</h1>
      <div className="card">
        <strong>Detected context</strong>
        <p>{context ? `${context.page} • ${context.title || context.url}` : "Loading current tab..."}</p>
      </div>
      <div className="actions">
        <button className="primaryButton" onClick={() => chrome.runtime.openOptionsPage()}>
          Open settings and backup
        </button>
        <p className="hint">
          Use the extension action button to open the side panel. LinkedIn and Gmail are supported in v1.
        </p>
      </div>
    </div>
  );
}
