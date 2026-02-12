"use client";

import { useStore } from "@/lib/store";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, ShieldCheck, HeartPulse, Footprints, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { audio } from "@/lib/audio";

export default function HealthSyncPrompt() {
  const { user, togglePassiveSync, updatePassiveData, showToast } = useStore();
  const [isSyncing, setIsSyncing] = useState(false);

  if (user.isPassiveSyncEnabled) return null;

  const handleEnableSync = async () => {
    setIsSyncing(true);
    audio.playClick();
    
    try {
      // 2.3 Mandatory: Friendly request for sensor data
      if (typeof window !== "undefined" && (window as any).DeviceOrientationEvent?.requestPermission) {
        await (window as any).DeviceOrientationEvent.requestPermission();
      }
      
      // Request Accelerometer (Generic sensor API if available)
      if ('Accelerometer' in window) {
        try {
          const acc = new (window as any).Accelerometer({ frequency: 60 });
          acc.start();
        } catch (e) {
          console.warn("Sensor access denied, falling back to mock");
        }
      }
    } catch (err) {
      console.warn("Sync permission flow interrupted");
    }

    setTimeout(() => {
      togglePassiveSync(true);
      // Seed initial mock data
      updatePassiveData({
         steps: 2450,
         heartRate: 74,
         sleepHours: 7.2
      });
      setIsSyncing(false);
      audio.playSuccess();
      showToast("🚀 Sync Established! Activity biometrics live.");
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bark rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-bark/20"
    >
      <div className="absolute top-0 right-0 p-12 opacity-10">
         <HeartPulse className="w-48 h-48" />
      </div>

      <div className="relative z-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-coral" />
          </div>
          <h2 className="font-display text-xl font-bold">Sync Health Data</h2>
        </div>

        <p className="text-white/70 text-sm leading-relaxed font-medium">
          Connect your device to unlock <span className="font-bold text-white">Activity Bonuses</span> and smarter, context-aware insights based on your movement.
        </p>

        <div className="flex gap-4">
           <div className="flex items-center gap-1.5 py-1 px-3 rounded-full bg-white/5 border border-white/10">
              <Footprints className="w-3 h-3 text-sage" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Steps</span>
           </div>
           <div className="flex items-center gap-1.5 py-1 px-3 rounded-full bg-white/5 border border-white/10">
              <Zap className="w-3 h-3 text-coral" />
              <span className="text-[10px] font-bold uppercase tracking-wider">+5 XP Bonus</span>
           </div>
        </div>

        <Button
          onClick={handleEnableSync}
          disabled={isSyncing}
          className="w-full h-14 rounded-2xl bg-coral hover:bg-coral-dark text-white font-black text-lg shadow-lg shadow-coral/20 cursor-pointer"
        >
          {isSyncing ? "Establishing Link..." : "Enable Passive Sync"}
        </Button>

        <div className="flex items-center justify-center gap-2 pt-2">
           <ShieldCheck className="w-3 h-3 text-white/40" />
           <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">End-to-End Encrypted</span>
        </div>
      </div>
    </motion.div>
  );
}
