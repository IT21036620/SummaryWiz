import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyA6pDdnx19gVROP3lBSjb3Vv9CGQp3KCdE",
    authDomain: "summarywiz.firebaseapp.com",
    projectId: "summarywiz",
    storageBucket: "summarywiz.firebasestorage.app",
    messagingSenderId: "648390493698",
    appId: "1:648390493698:web:dff01acdfcf23ae8d2891b",
    measurementId: "G-0LT8E9EYQF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
