import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableMultiTabIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCBX4e6w9F1JUTPvODRIOjOmwGdiu5Iqos",
  authDomain: "fir-630c8.firebaseapp.com",
  projectId: "fir-630c8",
  storageBucket: "fir-630c8.firebasestorage.app",
  messagingSenderId: "210790175745",
  appId: "1:210790175745:web:61fac059bfc3b27a485c00",
  measurementId: "G-T2794N2S72",
};

// Prevent duplicate initialization in dev (hot reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable offline persistence (client-side only)
if (typeof window !== "undefined") {
  enableMultiTabIndexedDbPersistence(db).catch((err) => {
    if (err.code === "failed-precondition") {
      // Multiple tabs open, persistence can only be enabled in one tab at a a time.
      console.warn("Firestore persistence failed (multiple tabs)");
    } else if (err.code === "unimplemented") {
      // The current browser does not support all of the features required to enable persistence
      console.warn("Firestore persistence not supported");
    }
  });
}

export default app;
