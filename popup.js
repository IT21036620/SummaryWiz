// Function to get stored API key
function getApiKey() {
    return new Promise((resolve) => {
        chrome.storage.sync.get("GEMINI_API_KEY", (data) => {
            resolve(data.GEMINI_API_KEY || ""); // Fallback if not set
        });
    });
}

// Function to summarize webpage content using Gemini API
async function summarizeContent(text) {
    const apiKey = await getApiKey();
    if (!apiKey) {
        console.error("Gemini API key not set. Go to settings.");
        return "API key missing. Please configure in settings.";
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

// Function to save summary to Firebase
async function saveSummaryToFirebase(summary) {
    const db = getFirestore();

    try {
        await addDoc(collection(db, "summaries"), {
            summary: summary,
            timestamp: new Date()
        });
        document.getElementById("status").textContent = "Summary saved successfully!";
    } catch (error) {
        console.error("Error saving summary: ", error);
        document.getElementById("status").textContent = "Failed to save summary.";
    }
}

// Handle popup logic
document.addEventListener("DOMContentLoaded", async () => {
    const summaryBox = document.getElementById("summary");
    const saveBtn = document.getElementById("save-button");

    // Get page content and summarize
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "extractText" }, async (response) => {
            const pageText = response?.text || "No content available.";
            const summary = await summarizeContent(pageText);
            summaryBox.value = summary;

            // Save summary when clicked
            saveBtn.addEventListener("click", () => {
                saveSummaryToFirebase(summary);
            });
        });
    });
});
