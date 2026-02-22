"use client";

import { useEffect, useRef } from "react";
import { useStore } from "@/lib/store";
import { signInAnon, onAuthChange, handleRedirectResult } from "@/lib/auth";
import { generateAnonName } from "@/lib/utils"; 

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, setUser, loadFromFirestore, setIsLoading } = useStore();
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const authSetupDone = useRef(false);

  useEffect(() => {
    let unsubscribe: () => void = () => {};

    const setupAuth = async () => {
        // Prevent double setup
        if (authSetupDone.current) return;
        authSetupDone.current = true;

        console.log("[AuthProvider] Starting setupAuth...");
        
        // Safety fallback - give auth 10 seconds max
        loadingTimeoutRef.current = setTimeout(() => {
          if (useStore.getState().isLoading) {
             console.warn("[AuthProvider] Auth taking too long, forcing isLoading to false");
             setIsLoading(false);
          }
        }, 10000);

        const redirectResult = await handleRedirectResult(); 
        console.log("[AuthProvider] Redirect check done:", redirectResult?.user?.uid);
        
        unsubscribe = onAuthChange(async (firebaseUser) => {
          console.log("[AuthProvider] Auth state changed:", firebaseUser?.uid);
          const effectiveUser = firebaseUser || redirectResult?.user;

          if (effectiveUser) {
            const currentState = useStore.getState();
            
            // 1. Map identity
            let resolvedName = effectiveUser.displayName || currentState.user.displayName;
            const resolvedPhoto = effectiveUser.photoURL || currentState.user.photoURL;
            const resolvedEmail = effectiveUser.email || currentState.user.email;

            if (effectiveUser.isAnonymous && !resolvedName) {
              resolvedName = generateAnonName();
            }

            const updateData = {
              uid: effectiveUser.uid,
              displayName: resolvedName,
              photoURL: resolvedPhoto,
              email: resolvedEmail,
              isAnonymous: effectiveUser.isAnonymous, 
            };

            console.log("[AuthProvider] Setting user:", updateData);
            setUser(updateData);

            // 2. Load user data from Firestore (not silent, so isLoading is properly managed)
            // This will set isLoading to false when done
            loadFromFirestore(effectiveUser.uid, false);
            
          } else {
            const currentState = useStore.getState();
            if (!currentState.user.uid) {
                console.log("[AuthProvider] No user, signing in anonymously");
                signInAnon();
            } else {
                console.log("[AuthProvider] Keeping existing user, clearing loading");
                setIsLoading(false);
            }
            if (loadingTimeoutRef.current) {
                clearTimeout(loadingTimeoutRef.current);
                loadingTimeoutRef.current = null;
            }
          }
        });
    };

    setupAuth();

    return () => {
        if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
        unsubscribe();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>;
}
