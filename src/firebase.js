import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const firebaseConfig = {
  apiKey: "AIzaSyAiawVZrk5pifFBoDuJSibbvuw0Kv3Yvcc",
  authDomain: "bloomsense-9cf96.firebaseapp.com",
  projectId: "bloomsense-9cf96",
  storageBucket: "bloomsense-9cf96.firebasestorage.app",
  messagingSenderId: "113263280584",
  appId: "1:113263280584:web:1d976e9833b94d00a680fd",
  measurementId: "G-LLGJ4EGW9W"
};

const app = initializeApp(firebaseConfig);

// Initialize App Check with reCAPTCHA v3
if (typeof window !== "undefined") {
  // Use a placeholder key for local development or VITE env var in prod
  const recaptchaKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6Ld_placeholder_key_for_development";
  
  if (import.meta.env.DEV) {
    window.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }
  
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(recaptchaKey),
    isTokenAutoRefreshEnabled: true
  });
}

// Remove persistent local cache for now to debug why it's not syncing
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, app };

