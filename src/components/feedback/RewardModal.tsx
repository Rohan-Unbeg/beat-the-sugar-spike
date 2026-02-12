"use client";

import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, X } from "lucide-react";
import confetti from "canvas-confetti";

export default function RewardModal() {
  const { user } = useStore();
  const [show, setShow] = useState(false);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    const currentLevel = Math.floor(user.score / 50) + 1;
    // Only show if current level > last seen level
    // Default lastSeenLevel to 1 if undefined
    const lastSeen = user.lastSeenLevel || 1;

    if (currentLevel > lastSeen) {
      setLevel(currentLevel);
      setShow(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF6B6B', '#FFB088', '#FFD93D', '#B8E8D0']
      });
    }
  }, [user.score, user.lastSeenLevel]);

  const handleDismiss = () => {
    setShow(false);
    // Update last seen level to current level
    const currentLevel = Math.floor(user.score / 50) + 1;
    useStore.getState().setUser({ lastSeenLevel: currentLevel });
    useStore.getState().syncToFirestore(); // Persist immediately
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-bark/20 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            className="bg-white rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-yellow-50 to-transparent -z-10" />
            
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-sand transition-colors text-bark-light cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-white"
            >
              <Trophy className="w-12 h-12 text-yellow-500 fill-yellow-500" />
            </motion.div>

            <h2 className="font-display text-3xl font-black text-bark mb-2">Level Up!</h2>
            <p className="text-bark-light/60 font-medium mb-6">
              You&apos;ve reached <strong className="text-coral">Level {level}</strong>. Your consistency is paying off!
            </p>

            <button
              onClick={handleDismiss}
              className="w-full py-4 rounded-xl bg-coral text-white font-bold text-lg shadow-lg shadow-coral/30 hover:bg-coral-dark transition-all active:scale-95 cursor-pointer"
            >
              Let&apos;s Go!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
