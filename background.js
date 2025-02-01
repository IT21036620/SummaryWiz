chrome.runtime.onInstalled.addListener(() => {
    console.log("Summarizer extension installed.");
  });
  
  // Redirect to predefined website if the user opens an empty tab
  chrome.action.onClicked.addListener((tab) => {
    if (!tab.url || tab.url === "chrome://newtab/") {
      chrome.tabs.update({ url: "https://www.anunine.com" });
    }
  });
  