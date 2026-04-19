import { initializeApp } from "firebase/app";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getAuth } from "firebase/auth";

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

// Modern persistent cache — works across multiple tabs, no deprecation warning
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
});

const auth = getAuth(app);

export { db, auth, app };

