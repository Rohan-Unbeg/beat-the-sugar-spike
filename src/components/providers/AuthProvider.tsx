"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { signInAnon, onAuthChange, handleRedirectResult } from "@/lib/auth";
import { generateAnonName } from "@/lib/utils"; 

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, setUser, loadFromFirestore } = useStore();

  useEffect(() => {
    // Check if store is hydrated from localStorage before touching auth
    // ...
    handleRedirectResult().catch(() => {});

    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        // 1. Initial Identity Resolution
        const currentState = useStore.getState();
        const currentUid = currentState.user.uid;
        
        // Trust localStorage first, but if it's null and we are anonymous, generate NOW.
        // This makes the name "instant" even if Firestore is slow/offline.
        let resolvedName = currentState.user.displayName;
        if (!resolvedName && firebaseUser.isAnonymous) {
          resolvedName = generateAnonName();
        }

        const updateData: any = {
          uid: firebaseUser.uid,
          photoURL: firebaseUser.photoURL || null,
          email: firebaseUser.email || null,
          displayName: firebaseUser.displayName || resolvedName,
          isAnonymous: firebaseUser.isAnonymous,
        };

        // Update local state immediately
        setUser(updateData);

        // 2. Background Sync
        // loadFromFirestore will now only "upgrade" the name if it finds a different one in the cloud.
        await loadFromFirestore(firebaseUser.uid).catch(() => {});

        // 3. Provider Override (e.g. Google Sign-In just happened)
        if (firebaseUser.displayName && firebaseUser.displayName !== useStore.getState().user.displayName) {
          setUser({ displayName: firebaseUser.displayName });
        }
      }
    });

    // Auto sign-in anonymously if not signed in (and store is ready)
    if (!user.uid) {
      signInAnon();
    }

    return () => unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>;
}
