import {
  signInAnonymously,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  linkWithPopup,
  linkWithRedirect,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { auth } from "./firebase";

const googleProvider = new GoogleAuthProvider();

// Sign in anonymously — called on app load
export async function signInAnon(): Promise<User | null> {
  try {
    const result = await signInAnonymously(auth);
    console.log("[Auth] Anonymous sign-in:", result.user.uid);
    return result.user;
  } catch (error) {
    console.error("[Auth] Anonymous sign-in failed:", error);
    return null;
  }
}

// Sign in with Google — tries popup first, falls back to redirect
export async function signInWithGoogle(): Promise<{ success: boolean; user?: User; error?: string }> {
  console.log("[Auth] signInWithGoogle EXECUTED");
  try {
    const currentUser = auth.currentUser;

    // If anonymous, we USED to try linking with Google to preserve data.
    // However, `linkWithPopup` is notoriously flaky (hangs, blocked by browsers).
    // For stability, we heavily prefer direct sign-in. This may orphan the anon session, 
    // but ensures the user can actually get into their account.
    /* 
    if (currentUser && currentUser.isAnonymous) {
      // ... linking logic ...
    }
    */
    const shouldLink = false; // Force false to skip flaky linking
    if (currentUser && currentUser.isAnonymous && shouldLink) {
      console.log("[Auth] Attempting to link anonymous account (isAnonymous: true)...");
      try {
        console.log("[Auth] Calling linkWithPopup...");
        
        // RACE: Link or Timeout (4s)
        // Sometimes linkWithPopup hangs if the browser blocks it weirdly or network is flaky
        const linkPromise = linkWithPopup(currentUser, googleProvider);
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => {
                console.log("[Auth] linkWithPopup TIMED OUT (4s). Rejecting...");
                reject(new Error("TIMEOUT"));
            }, 4000)
        );

        const result: any = await Promise.race([linkPromise, timeoutPromise]);
        
        console.log("[Auth] Anonymous → Google upgrade success via POPUP:", result.user.uid);
        return { success: true, user: result.user };
      } catch (linkError: any) {
        console.warn("[Auth] Link failed (popup/timeout):", linkError);

        // DEBUG: Alert using window.alert (if available) to pause before potential refresh
        if (typeof window !== 'undefined') {
             window.alert(`DEBUG: Link failed: ${linkError.message || linkError}`);
        }
        
        // If it was a generic error, timeout, or blocked popup, we try to recover
        // FALLBACK: Just sign in directly (might orphan anon data, but better than being stuck)
        console.log("[Auth] Fallback: Switching to direct signInWithPopup (ignoring linking)...");
        
        try {
            const result = await signInWithPopup(auth, googleProvider);
            console.log("[Auth] Direct sign-in success (fallback):", result.user.uid);
            return { success: true, user: result.user };
        } catch (directErr: any) {
             console.error("[Auth] Direct sign-in fallback also failed:", directErr);
             if (directErr.code === "auth/popup-blocked") {
                 console.log("[Auth] One last try: Redirect...");
                 await signInWithRedirect(auth, googleProvider);
                 return { success: true };
             }
             throw directErr;
        }
      }
    }

    // Direct Google sign-in
    console.log("[Auth] Starting direct Google sign-in (NO anonymous user or linking skipped)...");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("[Auth] Google sign-in success via POPUP. UID:", result.user.uid, "IsAnon:", result.user.isAnonymous);
      return { success: true, user: result.user };
    } catch (popupError: any) {
      console.error("[Auth] Direct sign-in failed (popup):", popupError);
      if (popupError.code === "auth/popup-blocked") {
        console.log("[Auth] Direct sign-in fallback to redirect...");
        await signInWithRedirect(auth, googleProvider);
        return { success: true };
      }
      throw popupError;
    }
  } catch (error: any) {
    console.error("[Auth] Google sign-in CRITICAL failure:", error);
    if (error.code === "auth/popup-closed-by-user") {
      return { success: false, error: "Sign-in cancelled" };
    }
    return { success: false, error: "Sign-in failed. Try again." };
  }
}

// Check for redirect result on page load
// Check for redirect result on page load
export async function handleRedirectResult(): Promise<User | null> {
  console.log("[Auth] Checking implementation of getRedirectResult...");
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      console.log("[Auth] Redirect sign-in success:", result.user.uid, "IsAnon:", result.user.isAnonymous);
      return result.user;
    }
    console.log("[Auth] No redirect result found.");
    return null;
  } catch (error: any) {
    console.error("[Auth] Redirect result error:", error);
    if (error.code === 'auth/credential-already-in-use') {
       console.log("[Auth] Redirect failed: Credential in use. This needs manual handling in UI.");
    }
    return null;
  }
}

// Sign out
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

// Listen to auth state changes
export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// Get current user
export function getCurrentUser(): User | null {
  return auth.currentUser;
}
