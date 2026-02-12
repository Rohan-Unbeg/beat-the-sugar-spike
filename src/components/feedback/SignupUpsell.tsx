"use client";

import { useStore } from "@/lib/store";
import { signInWithGoogle } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Save, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function SignupUpsell() {
  const { user, showToast, syncToFirestore } = useStore();
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  // We provoke after 15 XP or 3 logs to ensure they've "experienced" it.
  const { logs } = useStore();
  const shouldShow = (user.score >= 15 || logs.length >= 3) && user.isAnonymous && isVisible;

  if (!shouldShow) return null;

  const handleGoogleSignIn = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    console.log("[SignupUpsell] Sign-in button CLICKED");
    setLoading(true);
    const result = await signInWithGoogle();
    setLoading(false);

    if (result.success) {
      showToast("🎉 Signed in! Progress saved.");
      await syncToFirestore().catch(() => {});
      setIsVisible(false);
    } else if (result.error) {
      showToast(`❌ ${result.error}`);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-24 left-6 right-6 z-40 max-w-md mx-auto"
        >
          <div className="p-5 bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl shadow-bark/10 rounded-2xl relative">
            <button
              onClick={() => setIsVisible(false)}
              className="absolute -top-2 -right-2 p-1.5 bg-white rounded-full shadow-md text-bark-light hover:text-coral transition-colors border border-sand"
            >
              <X className="w-3 h-3" />
            </button>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <h3 className="font-bold text-bark flex items-center gap-2 text-sm">
                  <div className="p-1.5 bg-rose-100 rounded-lg">
                    <Save className="w-3.5 h-3.5 text-coral" />
                  </div>
                  Save your progress?
                </h3>
                <p className="text-xs text-bark-light/60 mt-1 pl-1">
                  You&apos;ve earned <span className="font-bold text-coral">{user.score} XP</span>. Don&apos;t lose it!
                </p>
              </div>
              <Button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="bg-bark hover:bg-bark-light text-white font-medium px-4 py-2 rounded-xl shrink-0 h-10 shadow-lg shadow-bark/20"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2 text-xs">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign in
                  </span>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
