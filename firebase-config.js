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
    const statusMessage = document.getElementById("status"); // Get status message element

    try {
        await db.collection("summaries").add({
            domain: domain,
            summary: summary,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Show success message
        statusMessage.textContent = "Summary saved successfully!";
        statusMessage.style.color = "lightgreen";
        statusMessage.style.opacity = "1";

        // Hide message after 2 seconds
        setTimeout(() => {
            statusMessage.style.opacity = "0";
        }, 2000);
    } catch (error) {
        console.error("Error saving summary: ", error);
        
        // Show failure message
        statusMessage.textContent = "Failed to save summary.";
        statusMessage.style.color = "red";
        statusMessage.style.opacity = "1";

        // Hide message after 2 seconds
        setTimeout(() => {
            statusMessage.style.opacity = "0";
        }, 2000);
    }
}


// Expose functions globally
window.db = db;
window.saveSummaryToFirebase = saveSummaryToFirebase;
