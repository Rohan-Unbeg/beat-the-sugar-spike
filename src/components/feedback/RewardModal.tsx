"use client";

import { useStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function RewardModal() {
  const { user } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [reward, setReward] = useState<{ title: string; xp: number } | null>(null);

  // Simple Gamification Logic: Check for level up or random reward
  useEffect(() => {
    if (user.score > 0 && user.score % 50 === 0) {
      setReward({ title: "Sugar Crusher Level Up!", xp: 50 });
      setIsOpen(true);
    }
  }, [user.score]);

  if (!isOpen || !reward) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-zinc-900 border border-zinc-700 w-full max-w-sm rounded-[2rem] p-8 text-center relative overflow-hidden"
        >
          {/* Confetti/Glow Effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-yellow-500/20 to-transparent pointer-events-none" />
          
          <motion.div 
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-24 h-24 bg-yellow-500 rounded-full mx-auto flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(234,179,8,0.4)]"
          >
            <Trophy className="w-12 h-12 text-black fill-black" />
          </motion.div>

          <h2 className="text-2xl font-bold text-white mb-2">{reward.title}</h2>
          <p className="text-zinc-400 mb-8">You've earned <span className="text-yellow-400 font-bold">+{reward.xp} XP</span> for your consistent tracking!</p>

          <Button 
            onClick={() => setIsOpen(false)}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold h-12 rounded-xl"
          >
            Claim Reward
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
