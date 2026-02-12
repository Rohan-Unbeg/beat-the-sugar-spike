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
        await handleRedirectResult();
        console.log("[AuthProvider] Redirect check done. Subscribing to auth state...");
        
        // NOW start listening
        unsubscribe = onAuthChange(async (firebaseUser) => {
          console.log("[AuthProvider] Auth State Change:", {
            uid: firebaseUser?.uid,
            isAnonymous: firebaseUser?.isAnonymous,
            email: firebaseUser?.email
          });

          if (firebaseUser) {
            // 1. Initial Identity Resolution
            const currentState = useStore.getState();
            
            let resolvedName = currentState.user.displayName;
            if (!resolvedName && firebaseUser.isAnonymous) {
              resolvedName = generateAnonName();
            }

            // Force current auth reality into the update
            const updateData: any = {
              uid: firebaseUser.uid,
              photoURL: firebaseUser.photoURL || currentState.user.photoURL,
              email: firebaseUser.email || currentState.user.email,
              isAnonymous: firebaseUser.isAnonymous && !firebaseUser.email,
            };

            // Aggressive Name Resolution: Google > Cloud > Local Anon
            if (!firebaseUser.isAnonymous && firebaseUser.displayName) {
              updateData.displayName = firebaseUser.displayName;
            } else if (currentState.user.displayName && currentState.user.isAnonymous && !firebaseUser.isAnonymous) {
               updateData.displayName = firebaseUser.displayName || currentState.user.displayName;
            } else {
              updateData.displayName = currentState.user.displayName || resolvedName;
            }

            console.log("[AuthProvider] Updating store with:", updateData);
            setUser(updateData);

            // 2. Background Sync
            await loadFromFirestore(firebaseUser.uid).catch(() => {});
            
            // Final Safety Check: Force isAnonymous based on Firebase reality
            const isAnon = firebaseUser.isAnonymous && !firebaseUser.email;
            if (useStore.getState().user.isAnonymous !== isAnon) {
               useStore.getState().setUser({ isAnonymous: isAnon });
            }
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
