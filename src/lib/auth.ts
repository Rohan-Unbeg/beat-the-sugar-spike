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
  try {
    const currentUser = auth.currentUser;

    // If anonymous, link with Google (preserves data)
    if (currentUser && currentUser.isAnonymous) {
      console.log("[Auth] Attempting to link anonymous account (isAnonymous: true)...");
      try {
        const result = await linkWithPopup(currentUser, googleProvider);
        console.log("[Auth] Anonymous → Google upgrade success via POPUP:", result.user.uid);
        return { success: true, user: result.user };
      } catch (linkError: any) {
        console.warn("[Auth] Link failed (popup):", linkError.code);
        
        if (linkError.code === "auth/popup-blocked") {
          console.log("[Auth] Popup blocked, falling back to redirect for LINK...");
          await linkWithRedirect(currentUser, googleProvider);
          return { success: true };
        }
        
        if (linkError.code === "auth/credential-already-in-use") {
          console.log("[Auth] Credential already in use. Switching to existing account...");
          try {
            const result = await signInWithPopup(auth, googleProvider);
            console.log("[Auth] Switch to existing account success:", result.user.uid);
            return { success: true, user: result.user };
          } catch (popupErr: any) {
            console.error("[Auth] Switch to existing account failed:", popupErr);
            if (popupErr.code === "auth/popup-blocked") {
               console.log("[Auth] Switch fallback to redirect...");
               await signInWithRedirect(auth, googleProvider);
               return { success: true };
            }
            throw popupErr;
          }
        }
        throw linkError;
      }
    }

    // Direct Google sign-in
    console.log("[Auth] Starting direct Google sign-in (NO anonymous user or linking skipped)...");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("[Auth] Google sign-in success via POPUP:", result.user.uid);
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
