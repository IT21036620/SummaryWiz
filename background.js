// Import Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Function to Initialize Firebase After Config is Retrieved
chrome.storage.sync.get("firebaseConfig", (data) => {
    if (data.firebaseConfig) {
        console.log("Firebase Config Loaded Successfully.");

        // Initialize Firebase
        const firebaseApp = initializeApp(data.firebaseConfig);
        const auth = getAuth(firebaseApp);
        const db = getFirestore(firebaseApp);

        // Monitor Firebase Authentication State
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log(`User Logged In: ${user.displayName} (${user.email})`);
                chrome.storage.sync.set({ userId: user.uid, userEmail: user.email });
            } else {
                console.log("User Logged Out.");
                chrome.storage.sync.remove(["userId", "userEmail"]);
            }
        });

    } else {
        console.error("Firebase config not found. User must log in.");
    }
});


// Create Context Menu for Summarization
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "summarizeText",
        title: "Summarize Selected Text",
        contexts: ["selection"]
    });
});

// Handle Context Menu Click (Requires Authentication)
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "summarizeText" && info.selectionText) {
        chrome.runtime.sendMessage({ action: "summarizeText", text: info.selectionText });
    }
});

// Get Active Tab URL
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getActiveTab") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            sendResponse({ url: tabs.length > 0 ? tabs[0].url : "Unknown" });
        });
        return true;
    }
});
