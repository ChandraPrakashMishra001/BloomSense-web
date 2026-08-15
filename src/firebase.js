import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAiawVZrk5pifFBoDuJSibbvuw0Kv3Yvcc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "bloomsense-9cf96.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "bloomsense-9cf96",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "bloomsense-9cf96.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "113263280584",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:113263280584:web:1d976e9833b94d00a680fd",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-LLGJ4EGW9W"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, app };


