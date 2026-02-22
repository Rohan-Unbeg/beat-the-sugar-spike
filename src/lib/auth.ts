import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged,
  User,
  signInWithRedirect,
  getRedirectResult,
  UserCredential,
  signOut as firebaseSignOut
} from "firebase/auth";
import app from "./firebase";

export const auth = getAuth(app);

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

/**
 * Signs in a user anonymously.
 * This is the default state for new users in SugarSync.
 */
export async function signInAnon(): Promise<AuthResult> {
  // SugarSync uses custom guest profiles in the store, 
  // but we can also use Firebase Anon if needed.
  // For now, we rely on the store's isAnonymous flag.
  return { success: true };
}

// Sign in with Google — tries popup first, falls back to redirect
export async function signInWithGoogle(): Promise<AuthResult> {
  try {
    const googleProvider = new GoogleAuthProvider();
    // For stability in hackathon, we skip flaky linking and prefer direct sign-in.
    // This ensures users can always access their account even if anon data is lost.
    const result = await signInWithPopup(auth, googleProvider);
    console.log("[Auth] Google sign-in success:", result.user.uid);
    return { success: true, user: result.user };
  } catch (error: any) {
    console.error("[Auth] Google Pop-up Error:", error.message);
    
    // Fallback to Redirect if Pop-up is blocked
    if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request') {
      try {
        await signInWithRedirect(auth, new GoogleAuthProvider());
        return { success: true }; 
      } catch (redirErr: any) {
        return { success: false, error: redirErr.message };
      }
    }
    return { success: false, error: error.message };
  }
}

/**
 * Handles the result of a redirect sign-in flow.
 * Should be called on app load.
 */
export async function handleRedirectResult(): Promise<AuthResult> {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      console.log("[Auth] Redirect sign-in success:", result.user.uid);
      return { success: true, user: result.user };
    }
    return { success: false };
  } catch (error: any) {
    console.error("[Auth] Redirect Error:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Signs out the current user.
 */
export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("[Auth] Sign-out Error:", error);
  }
}

/**
 * Listens for auth state changes.
 */
export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
