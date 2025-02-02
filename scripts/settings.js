document.addEventListener("DOMContentLoaded", function () {
    const apiKeyInput = document.getElementById("apiKey");
    const saveApiButton = document.getElementById("save-api");
    const status = document.getElementById("status");

    const shortBtn = document.getElementById("short-btn");
    const mediumBtn = document.getElementById("medium-btn");
    const detailedBtn = document.getElementById("detailed-btn");

    const viewSummariesBtn = document.getElementById("view-summaries");

    // Load stored settings
    chrome.storage.sync.get(["GEMINI_API_KEY", "SUMMARY_LEVEL"], function (data) {
        if (data.GEMINI_API_KEY) apiKeyInput.value = data.GEMINI_API_KEY;
        if (data.SUMMARY_LEVEL) updateLevelSelection(data.SUMMARY_LEVEL);
    });

    // Save API Key
    saveApiButton.addEventListener("click", function () {
        const apiKey = apiKeyInput.value.trim();
        chrome.storage.sync.set({ GEMINI_API_KEY: apiKey }, function () {
            status.textContent = "API key saved!";
            setTimeout(() => (status.textContent = ""), 2000);
        });
    });

    // Save Summarizing Level & Update Summary Dynamically
    function saveSummaryLevel(level) {
        chrome.storage.sync.set({ SUMMARY_LEVEL: level }, function () {
            updateLevelSelection(level);
            chrome.runtime.sendMessage({ action: "updateSummaryLength", level: level });
        });
    }

    function updateLevelSelection(level) {
        shortBtn.classList.remove("selected");
        mediumBtn.classList.remove("selected");
        detailedBtn.classList.remove("selected");

        if (level === "short") shortBtn.classList.add("selected");
        else if (level === "medium") mediumBtn.classList.add("selected");
        else if (level === "detailed") detailedBtn.classList.add("selected");
    }

    shortBtn.addEventListener("click", () => saveSummaryLevel("short"));
    mediumBtn.addEventListener("click", () => saveSummaryLevel("medium"));
    detailedBtn.addEventListener("click", () => saveSummaryLevel("detailed"));

    // Open Saved Summaries Page
    viewSummariesBtn.addEventListener("click", () => {
        chrome.tabs.create({ url: "../pages/saved.html" });
    });
});
