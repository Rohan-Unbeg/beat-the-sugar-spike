"use client";

import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, Calendar, Droplets, Target, ChevronLeft } from "lucide-react";
import BottomNav from "@/components/navigation/BottomNav";
import Toast from "@/components/feedback/Toast";
import Link from "next/link";

export default function StatsPage() {
  const { logs, user } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  // Weekly sugar data (last 7 days)
  const weekData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toDateString();
    const dayLogs = logs.filter(log => new Date(log.timestamp).toDateString() === dateStr);
    const total = dayLogs.reduce((acc, log) => acc + log.amount, 0);
    return {
      label: d.toLocaleDateString("en", { weekday: "short" }),
      date: d.toLocaleDateString("en", { month: "short", day: "numeric" }),
      total,
      count: dayLogs.length,
    };
  });

  const weekTotal = weekData.reduce((acc, d) => acc + d.total, 0);
  const weekAvg = Math.round(weekTotal / 7);
  const maxDay = Math.max(...weekData.map(d => d.total), 50);
  const totalLogs = logs.length;

  return (
    <div className="min-h-screen bg-warm-white pb-32 text-bark relative">
       {/* Background decoration */}
      <div className="fixed top-0 right-0 w-[300px] h-[300px] bg-peach/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
      
      <Toast />
      
      <header className="fixed top-0 w-full z-50 bg-warm-white/80 backdrop-blur-md border-b border-clay/20">
        <div className="max-w-md mx-auto px-6 h-16 flex items-center gap-4">
           <Link href="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-sand transition-colors text-bark-light">
             <ChevronLeft className="w-5 h-5" />
           </Link>
          <h1 className="font-display text-xl font-bold text-bark">Your Stats</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 pt-24 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard icon={<Target className="w-5 h-5 text-coral" />} label="Weekly Avg" value={`${weekAvg}g`} sub="per day" color="bg-rose-50 border-rose-100" />
          <StatCard icon={<Droplets className="w-5 h-5 text-blue-500" />} label="Total Logs" value={`${totalLogs}`} sub="all time" color="bg-blue-50 border-blue-100" />
          <StatCard icon={<TrendingDown className="w-5 h-5 text-sage-dark" />} label="Best Streak" value={`${user.streak}d`} sub="consecutive" color="bg-green-50 border-green-100" />
          <StatCard icon={<Calendar className="w-5 h-5 text-amber-500" />} label="This Week" value={`${weekTotal}g`} sub="total sugar" color="bg-amber-50 border-amber-100" />
        </div>

        {/* Bar Chart */}
        <div className="p-6 rounded-3xl bg-white border border-clay/30 shadow-lg shadow-bark/5">
          <h3 className="font-display text-lg font-bold text-bark mb-6 flex items-center gap-2">
            <div className="w-1 h-5 rounded-full bg-peach" />
            Last 7 Days
          </h3>
          <div className="flex items-end justify-between gap-2 h-48">
            {weekData.map((day, idx) => {
              const height = maxDay > 0 ? (day.total / maxDay) * 100 : 0;
              const isToday = idx === 6;
              const overLimit = day.total > 50;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="relative w-full flex flex-col justify-end h-full">
                     <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-bark opacity-0 group-hover:opacity-100 transition-opacity bg-white px-1.5 py-0.5 rounded shadow-sm border border-clay/20 pointer-events-none whitespace-nowrap z-10">
                        {day.total}g
                     </span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(height, 8)}%` }}
                      transition={{ duration: 0.6, delay: idx * 0.05, ease: "easeOut" }}
                      className={`w-full rounded-t-lg transition-colors ${
                        overLimit
                          ? "bg-coral"
                          : isToday
                          ? "bg-peach"
                          : "bg-sage/40 hover:bg-sage/60"
                      }`}
                    />
                  </div>
                  <span className={`text-[10px] font-medium uppercase tracking-wider ${isToday ? "text-coral font-bold" : "text-bark-light/40"}`}>
                    {day.label}
                  </span>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 pt-4 border-t border-dashed border-clay/30 flex items-center justify-center gap-6 text-xs font-medium text-bark-light/60">
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-sage/40" /> Under limit
             </div>
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-coral" /> Over limit
             </div>
          </div>
        </div>

        {/* Weekly Trend */}
        <div className="p-5 rounded-2xl bg-white border border-clay/30 shadow-sm flex items-start gap-4">
          <div className={`p-3 rounded-full shrink-0 ${weekAvg > 40 ? "bg-rose-50 text-coral" : "bg-green-50 text-sage-dark"}`}>
             {weekAvg > 40 ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
          </div>
          <div>
            <h4 className="font-bold text-bark text-base mb-1">
              {weekAvg > 40 ? "Watch out for sugar spikes" : "You're crushing it!"}
            </h4>
            <p className="text-sm text-bark-light/70 leading-relaxed">
              {weekAvg > 40 
                ? "Your average is slightly high this week. Try swapping one sweet snack for fruit."
                : "Your average is well below the daily recommended limit. Keep this momentum going!"}
            </p>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

function StatCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string; sub: string; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-4 rounded-2xl border ${color} flex flex-col justify-between h-28`}
    >
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-bold text-bark-light/50 uppercase tracking-widest">{label}</span>
        {icon}
      </div>
      <div>
        <div className="font-display text-2xl font-black text-bark">{value}</div>
        <span className="text-[10px] text-bark-light/50 font-medium">{sub}</span>
      </div>
    </motion.div>
  );
}
