
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBoozmBosTzAXt9wQKKnkNAvo6nCMTWzZU",
  authDomain: "kajoogram-app.firebaseapp.com",
  projectId: "kajoogram-app",
  storageBucket: "kajoogram-app.firebasestorage.app",
  messagingSenderId: "668946268098",
  appId: "1:668946268098:web:eb0cc1d4dd41ae746ce05b",
  measurementId: "G-9V4411R7ZP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
