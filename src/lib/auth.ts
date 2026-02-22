import {
  signInAnonymously,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  linkWithPopup,
  signOut as firebaseSignOut,
  type User,
  type UserCredential,
} from "firebase/auth";
import { auth } from "./firebase";

const googleProvider = new GoogleAuthProvider();

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

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
export async function signInWithGoogle(): Promise<AuthResult> {
  console.log("[Auth] signInWithGoogle EXECUTED");
  try {
    const currentUser = auth.currentUser;

    // For stability in hackathon, we skip flaky linking and prefer direct sign-in.
    // This ensures users can always access their account even if anon data is lost.
    const shouldLink = false; 
    if (currentUser && currentUser.isAnonymous && shouldLink) {
      console.log("[Auth] Attempting to link anonymous account...");
      try {
        const linkPromise = linkWithPopup(currentUser, googleProvider);
        const timeoutPromise = new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error("TIMEOUT")), 4000)
        );

        const result = await Promise.race([linkPromise, timeoutPromise]) as UserCredential;
        
        console.log("[Auth] Anonymous → Google upgrade success:", result.user.uid);
        return { success: true, user: result.user };
      } catch (linkError: any) {
        console.warn("[Auth] Link failed, falling back to direct sign-in:", linkError);
        
        try {
            const result = await signInWithPopup(auth, googleProvider);
            return { success: true, user: result.user };
        } catch (directErr: any) {
             console.error("[Auth] Fallback sign-in failed:", directErr);
             if (directErr.code === "auth/popup-blocked") {
                 await signInWithRedirect(auth, googleProvider);
                 return { success: true };
             }
             throw directErr;
        }
      }
    }

    // Direct Google sign-in
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return { success: true, user: result.user };
    } catch (popupError: any) {
      if (popupError.code === "auth/popup-blocked") {
        await signInWithRedirect(auth, googleProvider);
        return { success: true };
      }
      throw popupError;
    }
  } catch (error: any) {
    console.error("[Auth] Google sign-in failure:", error);
    if (error.code === "auth/popup-closed-by-user") {
      return { success: false, error: "Sign-in cancelled" };
    }
    return { success: false, error: error.message || "Sign-in failed. Try again." };
  }
}

// Check for redirect result on page load
export async function handleRedirectResult(): Promise<User | null> {
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      return result.user;
    }
    return null;
  } catch (error: any) {
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
