chrome.runtime.onInstalled.addListener(() => {
    console.log("Summarizer extension installed.");
  });
  
  // Redirect to predefined website if the user opens an empty tab
  chrome.action.onClicked.addListener((tab) => {
    if (!tab.url || tab.url === "chrome://newtab/") {
      chrome.tabs.update({ url: "https://www.anunine.com" });
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


