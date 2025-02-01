// Open settings page when clicking the settings button
document.getElementById("settings-btn").addEventListener("click", () => {
    chrome.runtime.openOptionsPage();
});

// Open GitHub page when clicking "About"
document.getElementById("about-button").addEventListener("click", () => {
    chrome.tabs.create({ url: "https://github.com/IT21036620/SummaryWiz" });
});

// Function to get stored API key
function getApiKey() {
    return new Promise((resolve) => {
        chrome.storage.sync.get("GEMINI_API_KEY", (data) => {
            resolve(data.GEMINI_API_KEY || ""); // Default empty if not set
        });
    });
}

// Function to summarize webpage content using Gemini API
async function summarizeContent(text) {
    const apiKey = await getApiKey();
    if (!apiKey) {
        console.error("Gemini API key not set. Configure it in settings.");
        return "API key missing. Please configure it in settings.";
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`;

    const payload = {
        contents: [{ parts: [{ text: `Summarize the following text in 2-3 sentences:\n\n${text}` }] }]
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

// Function to extract domain from URL
function getDomainFromUrl(url) {
    try {
        return new URL(url).hostname; // Extracts domain (e.g., "example.com")
    } catch (error) {
        console.error("Error extracting domain:", error);
        return "Unknown";
    }
}

// Handle popup logic
document.addEventListener("DOMContentLoaded", async () => {
    const summaryBox = document.getElementById("summary");
    const saveBtn = document.getElementById("save-button");

    // Get the active tab URL
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        const tabUrl = tabs[0].url;
        const domain = getDomainFromUrl(tabUrl); // Extract domain

        chrome.tabs.sendMessage(tabs[0].id, { action: "extractText" }, async (response) => {
            const pageText = response?.text || "No content available.";
            const summary = await summarizeContent(pageText);
            summaryBox.value = summary;

            // Save summary and domain when clicked
            saveBtn.addEventListener("click", () => {
                window.saveSummaryToFirebase(summary, domain);
            });
        });
    });
});
