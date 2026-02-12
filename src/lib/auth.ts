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
      try {
        const result = await linkWithPopup(currentUser, googleProvider);
        console.log("[Auth] Anonymous → Google upgrade:", result.user.uid);
        return { success: true, user: result.user };
      } catch (linkError: any) {
        if (linkError.code === "auth/popup-blocked") {
          // Fallback to redirect
          await linkWithRedirect(currentUser, googleProvider);
          return { success: true }; // Page will redirect
        }
        if (linkError.code === "auth/credential-already-in-use") {
          try {
            const result = await signInWithPopup(auth, googleProvider);
            return { success: true, user: result.user };
          } catch (popupErr: any) {
            if (popupErr.code === "auth/popup-blocked") {
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
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("[Auth] Google sign-in:", result.user.uid);
      return { success: true, user: result.user };
    } catch (popupError: any) {
      if (popupError.code === "auth/popup-blocked") {
        await signInWithRedirect(auth, googleProvider);
        return { success: true }; // Page will redirect
      }
      throw popupError;
    }
  } catch (error: any) {
    console.error("[Auth] Google sign-in failed:", error);
    if (error.code === "auth/popup-closed-by-user") {
      return { success: false, error: "Sign-in cancelled" };
    }
    return { success: false, error: "Sign-in failed. Try again." };
  }
}

// Check for redirect result on page load
export async function handleRedirectResult(): Promise<User | null> {
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      console.log("[Auth] Redirect sign-in:", result.user.uid);
      return result.user;
    }
    return null;
  } catch (error) {
    console.error("[Auth] Redirect result error:", error);
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
