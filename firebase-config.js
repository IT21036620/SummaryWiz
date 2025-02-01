// Ensure Firebase is only initialized once
if (!firebase.apps.length) {
    firebase.initializeApp({
        apiKey: "AIzaSyA6pDdnx19gVROP3lBSjb3Vv9CGQp3KCdE",
        authDomain: "summarywiz.firebaseapp.com",
        projectId: "summarywiz",
        storageBucket: "summarywiz.firebasestorage.app",
        messagingSenderId: "648390493698",
        appId: "1:648390493698:web:dff01acdfcf23ae8d2891b",
        measurementId: "G-0LT8E9EYQF"
    });
}

// Firestore instance
const db = firebase.firestore();

// Function to save summary and domain
async function saveSummaryToFirebase(summary, domain) {
    try {
        await db.collection("summaries").add({
            domain: domain,
            summary: summary,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        document.getElementById("status").textContent = "Summary saved successfully!";
    } catch (error) {
        console.error("Error saving summary: ", error);
        document.getElementById("status").textContent = "Failed to save summary.";
    }
}

// Expose functions globally
window.db = db;
window.saveSummaryToFirebase = saveSummaryToFirebase;
