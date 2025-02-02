if (chrome && chrome.runtime) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "summarizeText") {
            createOverlay(request.text);
        }
    });

    let overlayContainer;

    function createOverlay(selectedText) {
        if (overlayContainer) {
            return;
        }

        overlayContainer = document.createElement('div');
        const shadowRoot = overlayContainer.attachShadow({ mode: 'closed' });

        const overlay = document.createElement('div');
        overlay.id = 'summaryOverlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '50%';
        overlay.style.left = '50%';
        overlay.style.transform = 'translate(-50%, -50%)';
        overlay.style.background = 'linear-gradient(135deg, #1e1e2e, #2a2a40)';
        overlay.style.color = 'white';
        overlay.style.padding = '20px';
        overlay.style.borderRadius = '12px';
        overlay.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
        overlay.style.zIndex = '10000';
        overlay.style.width = '500px';
        overlay.style.height = 'auto';
        overlay.style.textAlign = 'center';
        overlay.style.fontFamily = '"Arial", sans-serif';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.gap = '10px';

        const title = document.createElement('h3');
        title.innerText = 'Summary';
        title.style.fontSize = '20px';
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '12px';

        const summaryContent = document.createElement('div');
        summaryContent.id = 'summaryContent';
        summaryContent.innerText = 'Generating summary...';
        summaryContent.style.fontSize = '14px';
        summaryContent.style.color = '#ffffff';
        summaryContent.style.background = 'rgba(255, 255, 255, 0.1)';
        summaryContent.style.padding = '12px';
        summaryContent.style.borderRadius = '8px';
        summaryContent.style.textAlign = 'left';
        summaryContent.style.maxHeight = '250px';
        summaryContent.style.overflowY = 'auto';

        // Scrollbar Styling
        summaryContent.style.overflowY = 'scroll';
        summaryContent.style.webkitScrollbar = 'width: 6px';
        summaryContent.style.webkitScrollbarThumb = 'background: rgba(255, 255, 255, 0.3); border-radius: 10px;';
        summaryContent.style.webkitScrollbarTrack = 'background: transparent;';

        const closeButton = document.createElement('button');
        closeButton.innerText = 'Close';
        closeButton.style.background = 'linear-gradient(90deg, #ff4d4d, #d32f2f)';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.padding = '8px 14px';
        closeButton.style.borderRadius = '6px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontSize = '14px';
        closeButton.style.fontWeight = 'bold';
        closeButton.style.alignSelf = 'flex-end';
        closeButton.style.marginTop = '10px';
        closeButton.style.transition = 'background 0.3s ease';

        closeButton.addEventListener('mouseover', () => {
            closeButton.style.background = 'linear-gradient(90deg, #d32f2f, #a80000)';
        });

        closeButton.addEventListener('click', () => {
            overlayContainer.remove();
            overlayContainer = null;
        });

        overlay.appendChild(title);
        overlay.appendChild(summaryContent);
        overlay.appendChild(closeButton);
        shadowRoot.appendChild(overlay);
        document.body.insertBefore(overlayContainer, document.body.firstChild);

        summarizeText(selectedText).then(summary => {
            summaryContent.innerText = summary;
        });
    }

    async function summarizeText(text) {
        const apiKey = await getApiKey();
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`;

        const payload = {
            contents: [{ parts: [{ text: `Summarize this text:\n\n${text}` }] }]
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
            console.error("Error summarizing text:", error);
            return "Failed to generate summary.";
        }
    }

    function getApiKey() {
        return new Promise((resolve) => {
            chrome.storage.sync.get("GEMINI_API_KEY", (data) => {
                resolve(data.GEMINI_API_KEY || "");
            });
        });
    }
}
