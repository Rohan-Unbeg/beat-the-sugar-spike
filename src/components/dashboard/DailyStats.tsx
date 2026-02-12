"use client";

import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function DailyStats() {
  const { logs } = useStore();
  const [totalSugar, setTotalSugar] = useState(0);
  
  const DAILY_LIMIT = 50;

  useEffect(() => {
    const today = new Date().toDateString();
    const todaysLogs = logs.filter(log => new Date(log.timestamp).toDateString() === today);
    const sum = todaysLogs.reduce((acc, log) => acc + log.amount, 0);
    setTotalSugar(sum);
  }, [logs]);

  const percentage = Math.min((totalSugar / DAILY_LIMIT) * 100, 100);
  const isOverLimit = totalSugar > DAILY_LIMIT;

  // SVG radial gauge calculations
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Color based on intake level (Brand colors: Sage -> Peach -> Coral)
  const getColor = () => {
    if (percentage > 90) return { stroke: "#FF6B6B", bg: "bg-coral", text: "text-coral" }; // Coral
    if (percentage > 60) return { stroke: "#FFB088", bg: "bg-peach", text: "text-peach" }; // Peach
    return { stroke: "#8BBF9F", bg: "bg-sage", text: "text-sage-dark" }; // Sage
  };

  const color = getColor();

  return (
    <div className="p-6 rounded-[2rem] bg-white border border-clay/30 shadow-xl shadow-bark/5 relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Radial Gauge */}
        <div className="relative shrink-0">
          <svg width="180" height="180" viewBox="0 0 180 180" className="-rotate-90 text-clay/20">
            {/* Background circle */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="16"
              strokeLinecap="round"
            />
            {/* Animated progress circle */}
            <motion.circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke={color.stroke}
              strokeWidth="16"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              key={totalSugar}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`text-4xl font-display font-black ${color.text}`}
            >
              {totalSugar}g
            </motion.span>
            <span className="text-[11px] text-bark-light/40 font-bold tracking-widest uppercase mt-1">
              Limit {DAILY_LIMIT}g
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 w-full space-y-4">
          <div className="flex items-baseline justify-between border-b border-clay/30 pb-3">
             <h2 className="text-xl font-display font-bold text-bark">Daily Intake</h2>
             <span className={`text-xs font-bold px-2 py-1 rounded-full bg-opacity-10 ${color.text} ${color.bg.replace('bg-', 'bg-opacity-10 ')}`}>
               {Math.round(percentage)}% used
             </span>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-bark-light/60 font-medium">Remaining</span>
              <span className="text-lg font-bold text-bark-light">
                 {isOverLimit ? 0 : DAILY_LIMIT - totalSugar}g
              </span>
            </div>
            
            <div className="p-3 rounded-xl bg-sand/50 border border-clay/30 text-xs text-bark-light/70 leading-relaxed">
              {isOverLimit 
                ? "🚨 Sugar spike warning! Drink water and take a walk." 
                : percentage > 60 
                ? "⚠️ Approaching limit. Maybe skip the next sweet treat?"
                : "🌿 Looking clean! Keeps energy stable."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
