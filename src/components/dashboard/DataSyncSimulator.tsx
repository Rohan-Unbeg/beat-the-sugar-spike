"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Heart, Footprints } from "lucide-react";
import { useStore } from "@/lib/store";

export default function DataSyncSimulator() {
  const { user, updatePassiveData } = useStore();
  const [showSync, setShowSync] = useState(false);

  useEffect(() => {
    if (!user.isPassiveSyncEnabled) return;

    // Simulate active health data syncing
    const interval = setInterval(() => {
      // 1. Update Data
      const extraSteps = Math.floor(Math.random() * 15) + 5;
      const newHeartRate = 65 + Math.floor(Math.random() * 40); // 65-105 bpm

      updatePassiveData({
        steps: (user.passiveData?.steps || 0) + extraSteps,
        heartRate: newHeartRate
      });

      // 2. Show Sync Indicator (Visual Feedback) occasionally
      if (Math.random() > 0.7) {
        setShowSync(true);
        setTimeout(() => setShowSync(false), 2000);
      }

    }, 4000); // Updates every 4 seconds

    return () => clearInterval(interval);
  }, [user.isPassiveSyncEnabled, user.passiveData?.steps, updatePassiveData]);

  return (
    <AnimatePresence>
      {showSync && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-24 right-6 z-40 bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center gap-3 shadow-xl"
        >
          <div className="relative">
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping" />
            <Activity className="w-4 h-4 text-green-400" />
          </div>
          <div className="flex flex-col">
             <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">Live Sync</span>
             <div className="flex items-center gap-2 text-xs font-bold">
               <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-red-500 fill-red-500" /> {user.passiveData?.heartRate}</span>
               <span className="w-px h-3 bg-white/20" />
               <span className="flex items-center gap-1"><Footprints className="w-3 h-3 text-blue-400" /> {user.passiveData?.steps}</span>
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
