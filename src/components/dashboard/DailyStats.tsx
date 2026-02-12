"use client";

import { useStore } from "@/lib/store";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

export default function DailyStats() {
  const { logs } = useStore();
  const [totalSugar, setTotalSugar] = useState(0);
  
  // Basic daily limit assumption (World Health Org rec is ~25g-50g depending on user)
  // We can customize this based on onboarding data later.
  const DAILY_LIMIT = 50; 

  useEffect(() => {
    // Filter logs for *today*
    const today = new Date().toDateString();
    const todaysLogs = logs.filter(log => new Date(log.timestamp).toDateString() === today);
    const sum = todaysLogs.reduce((acc, log) => acc + log.amount, 0);
    setTotalSugar(sum);
  }, [logs]);

  const percentage = Math.min((totalSugar / DAILY_LIMIT) * 100, 100);
  const isOverLimit = totalSugar > DAILY_LIMIT;

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-500/20 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/30 blur-[60px] rounded-full" />
      
      <div className="relative z-10">
        <h2 className="text-zinc-300 text-sm font-medium mb-1">Sugar Intake Today</h2>
        <div className="flex items-baseline gap-2 mb-4">
          <span className={`text-4xl font-bold ${isOverLimit ? "text-rose-500" : "text-white"}`}>
            {totalSugar}g
          </span>
          <span className="text-zinc-400">/ {DAILY_LIMIT}g limit</span>
        </div>

        <Progress value={percentage} className="h-3 bg-zinc-900/50" indicatorClassName={isOverLimit ? "bg-rose-500" : "bg-indigo-500"} />
        
        <p className="mt-3 text-xs text-zinc-400">
          {isOverLimit 
            ? "You've exceeded your daily limit. Try to hydrate!" 
            : `${DAILY_LIMIT - totalSugar}g remaining before you hit the limit.`}
        </p>
      </div>
    </div>
  );
}
