chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});

const envVars = {
  GOOGLE_API_KEY: import.meta.env.VITE_GOOGLE_API_KEY,
};

chrome.storage.local.set(envVars);

export {};
