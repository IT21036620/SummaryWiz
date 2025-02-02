import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Firebase Config (Do NOT Hardcode - Get from Storage)
const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "your-app.firebaseapp.com",
    projectId: "your-app",
    storageBucket: "your-app.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();

// Function to Log In with Google
document.getElementById("login-button").addEventListener("click", () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            console.log(`User Logged In: ${result.user.displayName}`);

            // Store Firebase Config Securely in Chrome Storage
            chrome.storage.sync.set({ firebaseConfig }, () => {
                console.log("Firebase config saved.");
            });

        }).catch((error) => {
            console.error("Login Failed: ", error);
        });
});
