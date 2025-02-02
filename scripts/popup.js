document.addEventListener("DOMContentLoaded", async () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0 && tabs[0].url) {
            console.log("Current tab URL:", tabs[0].url);

            const emptyTabUrls = ["chrome://newtab/", "chrome://new-tab-page/", "about:blank", ""];
            if (emptyTabUrls.includes(tabs[0].url)) {
                chrome.tabs.update(tabs[0].id, { url: "https://www.anunine.com" });
            }
        }
    });
});

document.getElementById("settings-btn").addEventListener("click", () => {
    chrome.runtime.openOptionsPage();
});

document.getElementById("about-button").addEventListener("click", () => {
    chrome.tabs.create({ url: "https://github.com/YourGitHubRepo" });
});

// Function to get API key
function getApiKey() {
    return new Promise((resolve) => {
        chrome.storage.sync.get("GEMINI_API_KEY", (data) => {
            resolve(data.GEMINI_API_KEY || "");
        });
    });
}

// Function to get summary level
function getSummaryLevel() {
    return new Promise((resolve) => {
        chrome.storage.sync.get("SUMMARY_LEVEL", (data) => {
            resolve(data.SUMMARY_LEVEL || "short");
        });
    });
}

// Summarization Function
async function summarizeContent(text) {
    const apiKey = await getApiKey();
    if (!apiKey) return "API key missing. Please configure it in settings.";

    const level = await getSummaryLevel();
    let levelText = level === "short" ? "Provide a very brief summary."
        : level === "medium" ? "Provide a standard summary."
        : "Provide a detailed summary.";

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`;

    const payload = {
        contents: [{ parts: [{ text: `${levelText} Summarize:\n\n${text}` }] }]
    };

    try {
        const response = await fetch(`${apiUrl}?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        return data?.candidates?.[0]?.content?.parts?.[0]?.text || "Failed to generate summary.";
    } catch (error) {
        console.error("Error summarizing content: ", error);
        return "Failed to generate summary.";
    }
}
