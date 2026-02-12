"use client";

import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Flame, Trophy, Plus } from "lucide-react";
import SugarLogger from "@/components/dashboard/SugarLogger";
import DailyStats from "@/components/dashboard/DailyStats";
import RewardModal from "@/components/feedback/RewardModal";
import InsightCard from "@/components/feedback/InsightCard";

export default function Dashboard() {
  const { user } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20 relative">
      <RewardModal />
      
      {/* Header / Top Bar */}
      <header className="fixed top-0 w-full z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center">
              <span className="font-bold text-sm">
                {user.gender === "male" ? "M" : user.gender === "female" ? "F" : "U"}
              </span>
            </div>
            <span className="font-medium text-zinc-200">Hello, Fighter</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-orange-500">
              <Flame className="w-5 h-5 fill-current" />
              <span className="font-bold">{user.streak}</span>
            </div>
            <div className="flex items-center gap-1.5 text-yellow-500">
              <Trophy className="w-5 h-5" />
              <span className="font-bold">{user.score}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 pt-24 space-y-8">
        {/* Daily Progress / Insight Teaser */}
        <DailyStats />
        
        <InsightCard />

        {/* Main Action: Log Sugar */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2 text-zinc-100">
            <Plus className="w-5 h-5 text-rose-500" />
            Quick Log
          </h2>
          <SugarLogger />
        </div>

        {/* Recent History (Placeholder for now) */}
        <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
          <h3 className="text-sm font-medium text-zinc-500 mb-2">Today's Timeline</h3>
          {user.score === 0 ? (
            <p className="text-zinc-600 text-sm">No sugar logged today. Keep it clean!</p>
          ) : (
             <p className="text-zinc-600 text-sm">Feature coming soon...</p>
          )}
        </div>
      </main>
    </div>
  );
}
