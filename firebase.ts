
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Helper to ensure valid strings for Firebase config
const getEnv = (val: string | undefined, fallback: string) => {
  // If val is empty string (from vite replacement) or undefined, use fallback
  if (!val || val === "") return fallback;
  return val;
};

// Use dummy values if env vars are missing to prevent immediate app crash.
// Authentication will obviously fail, but the UI will load.
const firebaseConfig = {
  apiKey: getEnv(process.env.FIREBASE_API_KEY, "AIzaSyDemoKeyToPreventCrash"),
  authDomain: getEnv(process.env.FIREBASE_AUTH_DOMAIN, "demo-project.firebaseapp.com"),
  databaseURL: getEnv(process.env.FIREBASE_DATABASE_URL, "https://demo-project.firebaseio.com"),
  projectId: getEnv(process.env.FIREBASE_PROJECT_ID, "demo-project"),
  storageBucket: getEnv(process.env.FIREBASE_STORAGE_BUCKET, "demo-project.appspot.com"),
  messagingSenderId: getEnv(process.env.FIREBASE_MESSAGING_SENDER_ID, "1234567890"),
  appId: getEnv(process.env.FIREBASE_APP_ID, "1:1234567890:web:1234567890abcdef"),
  measurementId: getEnv(process.env.FIREBASE_MEASUREMENT_ID, "G-DEMO1234")
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
