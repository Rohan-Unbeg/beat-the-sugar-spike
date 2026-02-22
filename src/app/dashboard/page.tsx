"use client";

import { useStore } from "@/lib/store";
import { signInWithGoogle } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Flame, Trophy, Plus, Clock, Search, ArrowUpRight, Trash2 } from "lucide-react";
import SugarLogger from "@/components/dashboard/SugarLogger";
import DailyStats from "@/components/dashboard/DailyStats";
import RewardModal from "@/components/feedback/RewardModal";
import InsightCard from "@/components/feedback/InsightCard";
import { DataSyncSimulator } from "@/components/dashboard/DataSyncSimulator";
import SignupUpsell from "@/components/feedback/SignupUpsell";
import GuestBanner from "@/components/feedback/GuestBanner";
import Toast from "@/components/feedback/Toast";
import BottomNav from "@/components/navigation/BottomNav";
import HealthSyncPrompt from "@/components/dashboard/HealthSyncPrompt";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import FoodSearchModal from "@/components/dashboard/FoodSearchModal";
import ScenarioSelector from "@/components/dashboard/ScenarioSelector";
import StreakReminder from "@/components/dashboard/StreakReminder";

const FOOD_ICONS: Record<string, string> = {
  tea_coffee: "☕",
  soft_drink: "🥤",
  sweet: "🍩",
  energy: "⚡",
};


export default function Dashboard() {
  const { user, logs, isLoading, removeLog, showToast } = useStore();
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // ROUTE GUARD: Redirect if not onboarded
  useEffect(() => {
    if (mounted && !isLoading && !user.isOnboarded) {
      router.replace("/onboarding");
    }
  }, [mounted, isLoading, user.isOnboarded, router]);

  // Prevent flicker: If we aren't onboarded, or still loading first boot, show nothing
  if (!mounted || isLoading || !user.isOnboarded) return null;

  // Get today's logs for timeline
  const today = new Date().toDateString();
  const todaysLogs = logs
    .filter(log => new Date(log.timestamp).toDateString() === today)
    .reverse();

  const greeting = !user.isAnonymous
    ? `Hey, ${user.displayName?.split(" ")[0]}`
    : `Hello, ${user.displayName || "Friend"}`;

  return (
    <div className="min-h-screen bg-warm-white pb-32 relative text-bark selection:bg-coral/20">
      <div className="fixed inset-0 bg-grain opacity-50 pointer-events-none -z-10" />

      <RewardModal />
      <DataSyncSimulator />
      <SignupUpsell />
      <Toast />

      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-warm-white/80 backdrop-blur-md border-b border-clay/20">
        <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar Skeleton */}
            {!user.isOnboarded && !user.uid ? ( // Rudimentary loading check
              <Skeleton className="w-9 h-9 rounded-full" />
            ) : user.photoURL ? (
              <Image
                src={user.photoURL}
                alt="Profile"
                width={36}
                height={36}
                className="w-9 h-9 rounded-full border border-clay"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-sand border border-clay flex items-center justify-center text-bark font-bold text-sm">
                {user.displayName ? user.displayName[0].toUpperCase() : "?"}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <p className="text-[10px] uppercase tracking-wider font-bold text-bark-light/40">Welcome back</p>
              </div>
              {/* Name Skeleton or Text */}
              {user.displayName ? (
                <h1 className="font-display font-bold text-lg text-bark leading-none animate-in fade-in duration-500">
                  {greeting}
                </h1>
              ) : isLoading ? (
                <Skeleton className="h-5 w-32 mt-1" />
              ) : (
                <div className="flex flex-col items-start">
                  <h1 className="font-display font-bold text-lg text-bark leading-none animate-in fade-in duration-500">
                    {greeting}
                  </h1>
                  <button
                    onClick={() => router.push('/auth')}
                    className="text-[9px] font-bold text-coral bg-coral/10 px-1.5 py-0.5 rounded-full mt-0.5 flex items-center gap-1 hover:bg-coral/20 transition-colors"
                  >
                    Guest &bull; Unsynced <ArrowUpRight className="w-2 h-2" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-clay/30 shadow-sm">
              <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
              <span className="font-bold text-sm text-bark">{user.streak}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-clay/30 shadow-sm">
              <Trophy className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-bold text-sm text-bark">{user.score}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 pt-24 space-y-8">
        <GuestBanner />
        <DailyStats />
        <StreakReminder />
        <HealthSyncPrompt />
        <InsightCard />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-bark flex items-center gap-2">
              <div className="w-1 h-6 rounded-full bg-coral" />
              Quick Log
            </h2>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-xs font-medium text-coral hover:text-coral-dark transition-colors cursor-pointer"
            >
              Search Food
            </button>
          </div>
          <SugarLogger />
        </div>

        {/* Today's Timeline */}
        <div className="space-y-4">
          <h3 className="font-display text-lg font-bold text-bark flex items-center gap-2">
            <div className="w-1 h-5 rounded-full bg-sage" />
            Today&apos;s Timeline
          </h3>

          {todaysLogs.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white border border-clay/30 text-center border-dashed">
              <div className="w-12 h-12 rounded-full bg-sand mx-auto flex items-center justify-center mb-3">
                <Clock className="w-6 h-6 text-bark-light/30" />
              </div>
              <p className="text-sm text-bark-light/60 font-medium">No sugar logged today yet.</p>
              <p className="text-xs text-bark-light/40 mt-1">Tap an icon above to start.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todaysLogs.map((log, idx) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white border border-clay/20 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-sand/50 flex items-center justify-center text-lg">
                      {FOOD_ICONS[log.type] || "🍪"}
                    </div>
                    <div>
                      <p className="font-bold text-bark text-sm">{log.label || log.type}</p>
                      <p className="text-xs text-bark-light/50 font-medium">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="font-display font-black text-bark text-lg block leading-none">{log.amount}g</span>
                    </div>
                    <button
                      onClick={() => {
                        removeLog(log.id);
                        showToast(`Log removed`);
                      }}
                      className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors shadow-sm ml-2"
                      aria-label="Remove log"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}

              <div className="text-center pt-4">
                <div className="inline-block px-4 py-1 rounded-full bg-sand/50 text-[10px] font-bold text-bark-light/40 uppercase tracking-widest">
                  End of list
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <FoodSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <ScenarioSelector />
      <BottomNav />
    </div>
  );
}
