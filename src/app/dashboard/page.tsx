"use client";

import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Trophy, Plus, Home, BarChart3, User, Clock } from "lucide-react";
import SugarLogger from "@/components/dashboard/SugarLogger";
import DailyStats from "@/components/dashboard/DailyStats";
import RewardModal from "@/components/feedback/RewardModal";
import InsightCard from "@/components/feedback/InsightCard";
import DataSyncSimulator from "@/components/dashboard/DataSyncSimulator";
import SignupUpsell from "@/components/feedback/SignupUpsell";
import Toast from "@/components/feedback/Toast";

export default function Dashboard() {
  const { user, logs } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Get today's logs for timeline
  const today = new Date().toDateString();
  const todaysLogs = logs
    .filter(log => new Date(log.timestamp).toDateString() === today)
    .reverse(); // newest first

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-28 relative">
      <RewardModal />
      <DataSyncSimulator />
      <SignupUpsell />
      <Toast />
      
      {/* Header / Top Bar */}
      <header className="fixed top-0 w-full z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
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

      <main className="max-w-md mx-auto px-6 pt-24 space-y-6">
        {/* Daily Progress */}
        <DailyStats />
        
        {/* Smart Insight */}
        <InsightCard />

        {/* Main Action: Log Sugar */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2 text-zinc-100">
            <Plus className="w-5 h-5 text-rose-500" />
            Quick Log
          </h2>
          <SugarLogger />
        </div>

        {/* Today's Timeline */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-zinc-500 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Today&apos;s Timeline
          </h3>
          {todaysLogs.length === 0 ? (
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-center">
              <p className="text-zinc-600 text-sm">No sugar logged today. Keep it clean! 💪</p>
            </div>
          ) : (
            <div className="space-y-2">
              {todaysLogs.map((log, idx) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-rose-500" />
                    <div>
                      <span className="text-sm font-medium text-zinc-200">{log.label || log.type}</span>
                      <p className="text-xs text-zinc-500">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-zinc-400">{log.amount}g</span>
                </motion.div>
              ))}
              <div className="text-center pt-2">
                <p className="text-xs text-zinc-600">
                  {todaysLogs.length} item{todaysLogs.length > 1 ? "s" : ""} logged today
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-800">
        <div className="max-w-md mx-auto flex items-center justify-around h-16 px-6">
          <NavItem icon={Home} label="Home" active />
          <NavItem icon={BarChart3} label="Stats" />
          <NavItem icon={Trophy} label="Rewards" />
          <NavItem icon={User} label="Profile" />
        </div>
      </nav>
    </div>
  );
}

function NavItem({ icon: Icon, label, active = false }: { icon: any; label: string; active?: boolean }) {
  return (
    <button className={`flex flex-col items-center gap-1 transition-colors ${active ? "text-rose-500" : "text-zinc-600 hover:text-zinc-400"}`}>
      <Icon className="w-5 h-5" />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

