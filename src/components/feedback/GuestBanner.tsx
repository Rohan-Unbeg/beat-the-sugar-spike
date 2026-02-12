"use client";

import { useStore } from "@/lib/store";
import { signInWithGoogle } from "@/lib/auth";
import { ArrowUpRight, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function GuestBanner() {
  const { user } = useStore();
  const [isVisible, setIsVisible] = useState(true);

  // Only show for guest users who haven't dismissed it (or valid session)
  // We want it to be "within few first experiences", so showing it immediately is fine.
  if (!user.isAnonymous || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mb-6 px-1"
      >
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-start gap-3">
             <div className="p-2 bg-white rounded-full shadow-sm shrink-0">
               <ShieldAlert className="w-5 h-5 text-orange-500" />
             </div>
             <div>
                <h4 className="font-bold text-bark text-sm leading-tight">Your {user.streak}-day streak is at risk</h4>
                <p className="text-xs text-bark-light/60 mt-0.5 leading-snug">
                  Data is only stored on this device. Sign in to protect your progress.
                </p>
             </div>
          </div>
          
          <button 
            onClick={() => {
                console.log("[GuestBanner] Connect button CLICKED");
                useStore.getState().showToast("⏳ specific sign-in...");
                
                signInWithGoogle().then(res => {
                   console.log("[GuestBanner] Sign-in result:", res);
                   if (res.success) {
                     useStore.getState().showToast("✅ Successfully connected!");
                   } else {
                     useStore.getState().showToast(res.error || "❌ Sign-in failed");
                   }
                });
            }}
            className="shrink-0 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-md transition-all flex items-center gap-1"
          >
            Connect <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
