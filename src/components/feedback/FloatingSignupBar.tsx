"use client";

import { useStore } from "@/lib/store";
import { signInWithGoogle } from "@/lib/auth";
import { ArrowUpRight, ShieldCheck, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function FloatingSignupBar() {
  const { user, showToast } = useStore();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Reveal after 2 seconds on the page to not overwhelm immediately
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!user.isAnonymous || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        className="fixed bottom-[100px] left-0 right-0 z-40 px-6 pointer-events-none"
      >
        <div className="max-w-md mx-auto pointer-events-auto relative">
          <button
            onClick={() => setIsVisible(false)}
            className="absolute -top-2 -right-2 p-1.5 bg-white rounded-full shadow-lg text-bark-light hover:text-coral transition-colors border border-clay/20 z-50 cursor-pointer active:scale-95"
          >
            <X className="w-3 h-3" />
          </button>
          <button
            onClick={() => {
              import("@/lib/auth").then(({ signInWithGoogle }) => {
                signInWithGoogle().then((res) => {
                  if (res.success) {
                    showToast("🎉 Account Linked Successfully!");
                    window.location.reload();
                  }
                });
              });
            }}
            className="w-full bg-bark/90 backdrop-blur-md border border-white/10 p-4 rounded-3xl shadow-2xl flex items-center justify-between group hover:bg-black transition-all active:scale-95"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-coral/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-coral" />
              </div>
              <div className="text-left">
                <p className="text-white font-bold text-sm leading-tight">Connect Account</p>
                <p className="text-white/50 text-[10px] uppercase font-bold tracking-widest mt-0.5">Protect your data & streak</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-xl group-hover:bg-coral group-hover:text-white transition-colors">
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Connect</span>
              <ArrowUpRight className="w-3 h-3 text-white" />
            </div>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
