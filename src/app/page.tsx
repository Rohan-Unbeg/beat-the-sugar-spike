"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Flame, Trophy, Activity } from "lucide-react";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const { user } = useStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && user.isOnboarded) {
      router.push("/dashboard");
    }
  }, [mounted, user.isOnboarded, router]);

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-zinc-50 overflow-hidden relative selection:bg-rose-500/30">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-rose-600/20 blur-[100px] animate-pulse" />
        <div className="absolute top-[40%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-indigo-600/10 blur-[100px]" />
      </div>

      <main className="flex flex-col items-center text-center px-6 max-w-4xl z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/50 border border-zinc-700 text-sm font-medium text-rose-400 mb-6 backdrop-blur-sm">
            <Flame className="w-4 h-4" /> Hack Your Health
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent">
            Beat the <span className="text-rose-500">Sugar Spike</span>
          </h1>
          <p className="text-lg md:text-2xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Track your sugar instantly. Get real-time health nudges. <br className="hidden md:block" />
            Build a streak and level up your life.
          </p>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.3, duration: 0.5 }}
           className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Link href="/onboarding">
            <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/25 transition-all hover:scale-105 active:scale-95 group">
              Start Your Streak
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all">
               View Demo
            </Button>
          </Link>
        </motion.div>

        {/* Gamification Teasers */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-left w-full"
        >
          <FeatureCard 
            icon={<Activity className="w-6 h-6 text-emerald-400" />}
            title="Fast logging"
            desc="Log sugar in under 10 seconds. No friction, just results."
          />
          <FeatureCard 
            icon={<Flame className="w-6 h-6 text-orange-400" />}
            title="Daily Streaks"
            desc="Don't break the chain. Build habits that actually stick."
          />
           <FeatureCard 
            icon={<Trophy className="w-6 h-6 text-yellow-400" />}
            title="Earn Rewards"
            desc="Level up and unlock badges as you improve your health."
          />
        </motion.div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-sm hover:bg-zinc-800/80 transition-colors">
      <div className="mb-4 p-3 bg-zinc-800 rounded-xl w-fit">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-zinc-100">{title}</h3>
      <p className="text-zinc-400 leading-relaxed">{desc}</p>
    </div>
  );
}

