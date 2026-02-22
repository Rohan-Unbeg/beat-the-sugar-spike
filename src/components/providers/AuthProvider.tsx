"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { signInAnon, onAuthChange, handleRedirectResult } from "@/lib/auth";
import { generateAnonName } from "@/lib/utils"; 

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, setUser, loadFromFirestore } = useStore();

  useEffect(() => {
    let unsubscribe: () => void = () => {};

    const setupAuth = async () => {
        // Wait for redirect result first
        console.log("[AuthProvider] Starting setupAuth (checking redirects)...");
        await handleRedirectResult(); // This might update auth state internally if successful
        console.log("[AuthProvider] Redirect check done. Subscribing to auth state...");
        
        // NOW start listening
        unsubscribe = onAuthChange(async (firebaseUser) => {
          console.log("[AuthProvider] Auth State Change:", {
            uid: firebaseUser?.uid,
            isAnonymous: firebaseUser?.isAnonymous,
            email: firebaseUser?.email,
            displayName: firebaseUser?.displayName
          });

          if (firebaseUser) {
            const currentState = useStore.getState();
            
            // 1. TRUST FIREBASE AUTH FOR IDENTITY
            // If Firebase says we have a name/photo/email, USE IT.
            // Only fallback to local state if Firebase is empty (e.g. specialized anon flows)
            let resolvedName = firebaseUser.displayName || currentState.user.displayName;
            const resolvedPhoto = firebaseUser.photoURL || currentState.user.photoURL;
            const resolvedEmail = firebaseUser.email || currentState.user.email;

            // If truly anonymous and no name, generate one if needed
            if (firebaseUser.isAnonymous && !resolvedName) {
              resolvedName = generateAnonName();
            }

            const isAnon = firebaseUser.isAnonymous; // Trust Firebase

            const updateData: any = {
              uid: firebaseUser.uid,
              displayName: resolvedName,
              photoURL: resolvedPhoto,
              email: resolvedEmail,
              isAnonymous: isAnon, 
            };

            console.log("[AuthProvider] Updating store with TRUSTED data:", updateData);
            setUser(updateData);

            // 2. Background Sync
            // Pass the CURRENT trusted identity to loadFromFirestore
            // This prevents the store from overwriting our valid session with old stale data
            await loadFromFirestore(firebaseUser.uid);
            
          } else {
            // No user found (and we aren't already loading a session).
            // This is the ONLY time we should auto-create an anon account.
            console.log("[AuthProvider] No user found. Signing in anonymously...");
            signInAnon();
          }
        });
    };

    setupAuth();

    return () => {
        unsubscribe();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>;
}
