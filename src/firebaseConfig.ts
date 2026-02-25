
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// --- IMPORTANT: PASTE YOUR FIREBASE KEYS HERE ---
// 1. Go to console.firebase.google.com
// 2. Create a project
// 3. Add a "Web App"
// 4. Copy the config object and replace the values below
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

// Logic to check if user has updated keys
const isConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY";

let app;
let db: any;

if (isConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("🔥 Firebase Connected Successfully!");
  } catch (error) {
    console.error("Firebase connection failed:", error);
    db = null;
  }
} else {
  console.log("⚠️ Firebase Keys Missing - Running in DEMO MODE (Local Data Only)");
  db = null;
}

export { db, isConfigured as isFirebaseReady };
