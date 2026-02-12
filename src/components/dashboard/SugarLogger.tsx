"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { Coffee, Cookie, GlassWater, IceCream, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { audio } from "@/lib/audio";

const PRESETS = [
  { id: "tea_coffee", label: "Chai/Coffee", icon: Coffee, amount: 10, color: "text-bark-light", bg: "bg-sand hover:bg-[#E8DACD]" },
  { id: "soft_drink", label: "Soft Drink", icon: GlassWater, amount: 35, color: "text-blue-600", bg: "bg-blue-50 hover:bg-blue-100" },
  { id: "sweet", label: "Sweets", icon: IceCream, amount: 20, color: "text-coral", bg: "bg-rose-50 hover:bg-rose-100" },
  { id: "snack", label: "Snack", icon: Cookie, amount: 15, color: "text-yellow-600", bg: "bg-yellow-50 hover:bg-yellow-100" },
  { id: "energy", label: "Energy Drink", icon: Zap, amount: 25, color: "text-purple-600", bg: "bg-purple-50 hover:bg-purple-100" },
];

export default function SugarLogger() {
  const { addLog, addScore } = useStore();
  const [logging, setLogging] = useState<string | null>(null);

  const isLoggingRef = useRef(false);

  const handleLog = (preset: typeof PRESETS[0]) => {
    if (isLoggingRef.current) return;
    isLoggingRef.current = true;
    setLogging(preset.id);
    
    setTimeout(() => {
      audio.playSuccess();
      addLog({
        type: preset.id,
        label: preset.label,
        timestamp: new Date().toISOString(),
        amount: preset.amount,
      });
      addScore(5);
      setLogging(null);
      
      // Add a small buffer before allowing next log
      setTimeout(() => {
        isLoggingRef.current = false;
      }, 500); 
    }, 800);
  };

  return (
    <div className="grid grid-cols-3 gap-3">
      {PRESETS.map((preset) => (
        <motion.button
          key={preset.id}
          whileTap={{ scale: 0.92 }}
          onClick={() => handleLog(preset)}
          disabled={!!logging}
          className={cn(
            "relative flex flex-col items-center justify-center p-3 rounded-2xl transition-colors h-28 cursor-pointer",
            preset.bg
          )}
        >
          {logging === preset.id ? (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl"
            >
              <span className="text-xl font-bold text-coral">+5 Logged ✓</span>
            </motion.div>
          ) : (
            <>
              <preset.icon className={cn("w-7 h-7 mb-2", preset.color)} />
              <span className="text-xs font-bold text-bark">{preset.label}</span>
              <span className="text-[10px] text-bark-light/50 font-medium">~{preset.amount}g</span>
            </>
          )}
        </motion.button>
      ))}
    </div>
  );
}
