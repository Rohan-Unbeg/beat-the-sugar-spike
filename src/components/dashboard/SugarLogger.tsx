"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { Coffee, Cookie, GlassWater, IceCream, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { audio } from "@/lib/audio";

const PRESETS = [
  { id: "tea_coffee", label: "Chai/Coffee", icon: Coffee, amount: 10, color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20" },
  { id: "soft_drink", label: "Soft Drink", icon: GlassWater, amount: 35, color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
  { id: "sweet", label: "Sweets", icon: IceCream, amount: 20, color: "text-rose-400", bg: "bg-rose-400/10 border-rose-400/20" },
  { id: "snack", label: "Snack", icon: Cookie, amount: 15, color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/20" },
  { id: "energy", label: "Energy Drink", icon: Zap, amount: 25, color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20" },
];

export default function SugarLogger() {
  const { addLog, addScore } = useStore();
  const [logging, setLogging] = useState<string | null>(null);

  const handleLog = (preset: typeof PRESETS[0]) => {
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
    }, 800);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {PRESETS.map((preset) => (
        <motion.button
          key={preset.id}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleLog(preset)}
          disabled={!!logging}
          className={cn(
            "relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all h-32",
            preset.bg,
            logging === preset.id ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-950" : "hover:bg-opacity-20"
          )}
        >
          {logging === preset.id ? (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-2xl"
            >
              <span className="text-2xl font-bold text-white">+5 XP</span>
            </motion.div>
          ) : (
            <>
              <preset.icon className={cn("w-8 h-8 mb-3", preset.color)} />
              <span className="text-sm font-medium text-zinc-300">{preset.label}</span>
              <span className="text-xs text-zinc-500">~{preset.amount}g</span>
            </>
          )}
        </motion.button>
      ))}
    </div>
  );
}
