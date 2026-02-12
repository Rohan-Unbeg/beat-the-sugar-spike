"use client";

import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Star, Flame, Zap, Shield, Target, Award, ChevronLeft, Lock } from "lucide-react";
import Leaderboard from "@/components/dashboard/Leaderboard";
import BottomNav from "@/components/navigation/BottomNav";
import Toast from "@/components/feedback/Toast";
import Link from "next/link";

interface Badge {
  id: string;
  icon: any;
  title: string;
  description: string;
  requirement: string;
  unlocked: boolean;
  color: string;
  bg: string;
}

export default function RewardsPage() {
  const { user, logs } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const level = Math.floor(user.score / 50) + 1;
  const xpInLevel = user.score % 50;
  const xpToNext = 50;
  const progressPercent = (xpInLevel / xpToNext) * 100;

  const badges: Badge[] = [
    { id: "first-log", icon: Star, title: "First Step", description: "Log your first sugar intake", requirement: "1 log", unlocked: logs.length >= 1, color: "text-yellow-500", bg: "bg-yellow-50" },
    { id: "streak-3", icon: Flame, title: "On Fire", description: "Maintain a 3-day streak", requirement: "3-day streak", unlocked: user.streak >= 3, color: "text-orange-500", bg: "bg-orange-50" },
    { id: "streak-7", icon: Flame, title: "Unstoppable", description: "7-day logging streak", requirement: "7-day streak", unlocked: user.streak >= 7, color: "text-rose-500", bg: "bg-rose-50" },
    { id: "logs-10", icon: Target, title: "Dedicated", description: "Log 10 items total", requirement: "10 logs", unlocked: logs.length >= 10, color: "text-emerald-500", bg: "bg-emerald-50" },
    { id: "logs-50", icon: Award, title: "Data Master", description: "Log 50 items total", requirement: "50 logs", unlocked: logs.length >= 50, color: "text-blue-500", bg: "bg-blue-50" },
    { id: "xp-100", icon: Zap, title: "XP Hunter", description: "Earn 100 XP", requirement: "100 XP", unlocked: user.score >= 100, color: "text-purple-500", bg: "bg-purple-50" },
    { id: "xp-500", icon: Shield, title: "Legend", description: "Earn 500 XP", requirement: "500 XP", unlocked: user.score >= 500, color: "text-indigo-500", bg: "bg-indigo-50" },
    { id: "level-5", icon: Trophy, title: "Veteran", description: "Reach Level 5", requirement: "Level 5", unlocked: level >= 5, color: "text-amber-500", bg: "bg-amber-50" },
  ];

  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <div className="min-h-screen bg-warm-white pb-32 text-bark relative">
      <div className="fixed bottom-0 left-0 w-[300px] h-[300px] bg-mint/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <Toast />
      
      <header className="fixed top-0 w-full z-50 bg-warm-white/80 backdrop-blur-md border-b border-clay/20">
        <div className="max-w-md mx-auto px-6 h-16 flex items-center gap-4">
           <Link href="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-sand transition-colors text-bark-light">
             <ChevronLeft className="w-5 h-5" />
           </Link>
          <h1 className="font-display text-xl font-bold text-bark">Rewards</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 pt-24 space-y-8">
        {/* Level Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-[2rem] bg-gradient-to-br from-bark to-bark-light text-white relative overflow-hidden shadow-2xl shadow-bark/20"
        >
          {/* Background pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl transform translate-x-10 -translate-y-10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-coral/20 rounded-full blur-2xl transform -translate-x-10 translate-y-10" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Current Level</span>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm border border-white/10">
                <Trophy className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-bold text-yellow-400">{user.score} XP</span>
              </div>
            </div>
            
            <h2 className="font-display text-5xl font-black mb-8">Level {level}</h2>
            
            <div className="relative h-3 bg-bark-light rounded-full overflow-hidden mb-3">
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-coral to-peach"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: "circOut" }}
              />
            </div>
            
            <div className="flex justify-between text-xs font-medium text-white/50">
              <span>{xpInLevel} XP</span>
              <span>{xpToNext} XP to next level</span>
            </div>
          </div>
        </motion.div>

        {/* Leaderboard */}
        <Leaderboard />

        {/* Badges List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-lg font-bold text-bark">Badge Collection</h3>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-sand text-bark-light/60">
              {unlockedCount}/{badges.length} Unlocked
            </span>
          </div>
          
          <div className="space-y-3">
            {badges.map((badge, idx) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                  badge.unlocked
                    ? "bg-white border-clay/30 shadow-sm"
                    : "bg-warm-white border-clay/20 opacity-60 grayscale"
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  badge.unlocked ? badge.bg : "bg-clay/20"
                }`}>
                  {badge.unlocked ? (
                    <badge.icon className={`w-6 h-6 ${badge.color}`} />
                  ) : (
                    <Lock className="w-5 h-5 text-bark-light/30" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-bark text-sm truncate">{badge.title}</h4>
                  <p className="text-xs text-bark-light/60 truncate">{badge.description}</p>
                </div>

                {badge.unlocked ? (
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                ) : (
                   <span className="text-[10px] font-bold text-bark-light/40 bg-sand px-2 py-1 rounded-md shrink-0">
                     {badge.requirement}
                   </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
