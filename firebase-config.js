// Initialize Firebase only if not already initialized
if (!firebase.apps.length) {
    chrome.storage.sync.get("firebaseConfig", (data) => {
        if (data.firebaseConfig) {
            firebase.initializeApp(data.firebaseConfig);
        } else {
            console.error("Firebase config not found. Please log in.");
        }
    });
}

// Firebase Authentication & Firestore instance
const auth = firebase.auth();
const db = firebase.firestore();

// Function to Save Summary Only if User is Logged In
async function saveSummaryToFirebase(summary, domain) {
    const statusMessage = document.getElementById("status"); // Get status message element
    const user = auth.currentUser; // Get logged-in user

    if (!user) {
        statusMessage.textContent = "Please log in to save summaries!";
        statusMessage.style.color = "red";
        statusMessage.style.opacity = "1";

        setTimeout(() => {
            statusMessage.style.opacity = "0";
        }, 2000);
        return;
    }

    try {
        await db.collection("summaries").add({
            userId: user.uid,  // Associate summaries with the logged-in user
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
window.auth = auth;
window.db = db;
window.saveSummaryToFirebase = saveSummaryToFirebase;
