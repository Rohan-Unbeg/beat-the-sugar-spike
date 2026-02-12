"use client";

import { useStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function SignupUpsell() {
  const { user } = useStore();
  const [isVisible, setIsVisible] = useState(true);

  // Only show if user has engaged (Score > 50) and is anonymous (we assume no email = anonymous)
  if (user.score < 50 || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed bottom-24 left-6 right-6 z-30"
      >
        <Card className="p-4 bg-zinc-900/95 backdrop-blur-md border-rose-500/30 border shadow-2xl flex items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Save className="w-4 h-4 text-rose-500" />
              Save your streaks?
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              You've earned <span className="text-yellow-400">{user.score} XP</span>. Don't lose it!
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsVisible(false)}
              className="text-zinc-500 hover:text-white"
            >
              Later
            </Button>
            <Button size="sm" className="bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/20">
              <Lock className="w-3 h-3 mr-2" />
              Sign Up
            </Button>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
