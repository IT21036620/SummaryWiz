chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "extractText") {
        let bodyText = document.body.innerText.trim();
        sendResponse({ text: bodyText.substring(0, 5000) }); // Limit characters
    }
});
