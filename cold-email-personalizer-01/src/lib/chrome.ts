export async function getActiveTab(): Promise<chrome.tabs.Tab | undefined> {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
}

export async function sendMessageToTab<T>(tabId: number, message: unknown): Promise<T> {
  return chrome.tabs.sendMessage(tabId, message) as Promise<T>;
}
