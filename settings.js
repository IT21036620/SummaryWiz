document.addEventListener("DOMContentLoaded", function () {
    const apiKeyInput = document.getElementById("apiKey");
    const saveButton = document.getElementById("save");
    const status = document.getElementById("status");

    // Load stored API key
    chrome.storage.sync.get("GEMINI_API_KEY", function (data) {
        if (data.GEMINI_API_KEY) {
            apiKeyInput.value = data.GEMINI_API_KEY;
        }
    });

    // Save API key
    saveButton.addEventListener("click", function () {
        const apiKey = apiKeyInput.value.trim();
        chrome.storage.sync.set({ GEMINI_API_KEY: apiKey }, function () {
            status.textContent = "API key saved successfully!";
            setTimeout(() => (status.textContent = ""), 2000);
        });
    });
});
