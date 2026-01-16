
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCytYtaIBdbF5tymGLOfrUrzKrF8Ynia8E",
  authDomain: "kajoogram-546be.firebaseapp.com",
  databaseURL: "https://kajoogram-546be-default-rtdb.firebaseio.com",
  projectId: "kajoogram-546be",
  storageBucket: "kajoogram-546be.firebasestorage.app",
  messagingSenderId: "17212323236",
  appId: "1:17212323236:web:98d4b75ee172d5214bfd31",
  measurementId: "G-TMPBCJ5ERY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
