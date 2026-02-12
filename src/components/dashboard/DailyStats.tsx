"use client";

import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function DailyStats() {
  const { logs, user } = useStore();
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
  const getGradientId = () => {
    if (percentage > 90) return "gradient-coral";
    if (percentage > 60) return "gradient-peach";
    return "gradient-sage";
  };
  
  const getTextColor = () => {
     if (percentage > 90) return "text-coral";
     if (percentage > 60) return "text-orange-600";
     return "text-sage-dark";
  };

  const gradientId = getGradientId();
  const textColor = getTextColor();

  return (
    <div className="p-6 rounded-[2.5rem] bg-white border border-clay/30 shadow-xl shadow-bark/5 relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Radial Gauge */}
        <div className="relative shrink-0">
          <svg width="180" height="180" viewBox="0 0 180 180" className="-rotate-90 text-sand/30">
            {/* Gradients */}
            <defs>
              <linearGradient id="gradient-sage" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8BBF9F" />
                <stop offset="100%" stopColor="#5E8C61" />
              </linearGradient>
              <linearGradient id="gradient-peach" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFB088" />
                <stop offset="100%" stopColor="#FF8C5A" />
              </linearGradient>
              <linearGradient id="gradient-coral" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF6B6B" />
                <stop offset="100%" stopColor="#E04F4F" />
              </linearGradient>
            </defs>
          
            {/* Background circle */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Animated progress circle */}
            <motion.circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              key={totalSugar}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`text-5xl font-display font-black leading-none ${textColor}`}
            >
              {totalSugar}
            </motion.span>
            <span className="text-[10px] text-bark-light/40 font-bold tracking-widest uppercase mt-2">
              of {DAILY_LIMIT}g
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 w-full min-w-0 space-y-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-display font-black text-bark leading-tight">Daily Intake</h2>
                {!user.isAnonymous ? (
                   <div className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-[8px] font-black text-emerald-600 uppercase tracking-widest">Synced</div>
                ) : (
                   <div className="px-2 py-0.5 rounded-full bg-orange-50 border border-orange-100 text-[8px] font-black text-orange-600 uppercase tracking-widest flex items-center gap-0.5">
                     <span className="w-1 h-1 rounded-full bg-orange-600 animate-pulse" />
                     Guest Session
                   </div>
                )}
              </div>
              <p className="text-xs font-medium text-bark-light/50 truncate">Keep your spike low to win.</p>
            </div>
          
           <div className="grid grid-cols-2 gap-2">
             <div className="p-2 rounded-2xl bg-sand/30 border border-clay/10 min-w-0 flex flex-col justify-center">
               <span className="text-[10px] font-bold text-bark-light/50 uppercase tracking-wider block mb-0.5 whitespace-nowrap">Status</span>
               <div className={`text-xs sm:text-sm font-black ${textColor} whitespace-nowrap`}>
                 {Math.round(percentage)}% Used
               </div>
             </div>
             <div className="p-2 rounded-2xl bg-sand/30 border border-clay/10 min-w-0 flex flex-col justify-center">
               <span className="text-[10px] font-bold text-bark-light/50 uppercase tracking-wider block mb-0.5 whitespace-nowrap">Remaining</span>
               <div className="text-xs sm:text-sm font-black text-bark whitespace-nowrap">
                 {isOverLimit ? 0 : DAILY_LIMIT - totalSugar}g
               </div>
             </div>
           </div>
            
           <div className={`px-4 py-3 rounded-2xl border text-xs font-bold leading-relaxed shadow-sm ${
             isOverLimit 
               ? "bg-rose-50 border-rose-100 text-rose-700" 
               : percentage > 60 
               ? "bg-orange-50 border-orange-100 text-orange-700"
               : "bg-sage/10 border-sage/20 text-sage-dark"
           }`}>
              <span className="block break-words">
              {isOverLimit 
                ? "🚨 Spike Detected! Hydrate now." 
                : percentage > 60 
                ? "⚠️ Sweet tooth active. Caution."
                : "🌿 Zone stabilized. Great job."}
              </span>
            </div>
         </div>
      </div>
    </div>
  );
}
