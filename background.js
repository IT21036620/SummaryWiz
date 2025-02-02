chrome.runtime.onInstalled.addListener(() => {
    console.log("Summarizer extension installed.");
  });
  
  // Listen for when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log("Summarizer extension installed.");
});

// Listen for messages from popup.js or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getActiveTab") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs.length > 0) {
              sendResponse({ url: tabs[0].url });
          } else {
              sendResponse({ url: "Unknown" });
          }
      });
      return true; // Required for async response
  }
});

  
  chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "summarizeText",
        title: "Summarize Selected Text",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "summarizeText" && info.selectionText) {
        chrome.tabs.sendMessage(tab.id, { action: "summarizeText", text: info.selectionText });
    }
});

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs.length > 0) {
      console.log("Current tab URL:", tabs[0].url);
  } else {
      console.log("No active tab found.");
  }
});

