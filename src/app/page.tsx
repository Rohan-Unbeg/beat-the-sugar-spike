"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const { user } = useStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (mounted && user.isOnboarded) router.push("/dashboard");
  }, [mounted, user.isOnboarded, router]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-warm-white relative overflow-hidden selection:bg-coral/20">
      {/* Organic background blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg className="absolute -top-20 -right-20 w-[500px] h-[500px] opacity-30" viewBox="0 0 500 500">
          <path d="M440,300Q380,400,280,430Q180,460,100,380Q20,300,80,200Q140,100,250,70Q360,40,420,170Q480,300,440,300Z" fill="#FFB088" />
        </svg>
        <svg className="absolute bottom-0 -left-20 w-[400px] h-[400px] opacity-20" viewBox="0 0 400 400">
          <path d="M340,240Q280,340,180,340Q80,340,60,240Q40,140,140,80Q240,20,320,120Q400,220,340,240Z" fill="#B8E8D0" />
        </svg>
        <svg className="absolute top-1/3 left-1/4 w-[200px] h-[200px] opacity-10" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="80" fill="#FFD93D" />
        </svg>
      </div>

      {/* Floating sugar cubes decoration */}
      <div className="absolute inset-0 -z-5 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] right-[12%]"
        >
          <SugarCube size={32} />
        </motion.div>
        <motion.div
          animate={{ y: [8, -8, 8], rotate: [0, -8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[60%] left-[8%]"
        >
          <SugarCube size={24} />
        </motion.div>
        <motion.div
          animate={{ y: [-6, 12, -6], rotate: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[35%] right-[25%]"
        >
          <SugarCube size={20} />
        </motion.div>
      </div>

      {/* Top nav */}
      <nav className="relative z-10 max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-coral flex items-center justify-center shadow-md shadow-coral/20">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 2C8 6 4 10 4 14a8 8 0 1 0 16 0c0-4-4-8-8-12Z" />
              <path d="M12 22v-4" />
            </svg>
          </div>
          <span className="font-display font-bold text-bark text-lg tracking-tight">SugarSync</span>
        </div>
        <Link
          href="/onboarding"
          className="text-sm font-semibold text-bark-light hover:text-bark transition-colors px-4 py-2 rounded-full hover:bg-sand"
        >
          Get Started →
        </Link>
      </nav>

      {/* Hero */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-12 md:pt-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left: Copy */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage/15 text-sage-dark text-xs font-semibold tracking-wide uppercase mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse" />
                Healthier you, one log at a time
              </span>

              <h1 className="font-display text-[2.75rem] md:text-6xl lg:text-[4.25rem] font-extrabold text-bark leading-[1.08] tracking-tight mb-6 text-balance">
                Know your
                <br />
                <span className="relative inline-block">
                  <span className="relative z-10 text-coral">sugar.</span>
                  <svg className="absolute -bottom-1 left-0 w-full h-3 text-coral/20" viewBox="0 0 200 12" preserveAspectRatio="none">
                    <path d="M0,8 Q50,0 100,8 T200,8" stroke="currentColor" strokeWidth="4" fill="none" />
                  </svg>
                </span>
                <br />
                Beat the spike.
              </h1>

              <p className="text-base md:text-lg text-bark-light/70 max-w-md mx-auto lg:mx-0 leading-relaxed mb-8">
                Track sugar intake in 10 seconds. Get AI nudges when you&apos;re about to spike. Build streaks, earn rewards, and actually stick with it.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link href="/onboarding">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-coral text-white font-semibold text-base shadow-lg shadow-coral/25 hover:bg-coral-dark transition-colors"
                  >
                    Start free — 30s setup
                  </motion.button>
                </Link>
                <Link href="/dashboard">
                  <button className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border-2 border-clay text-bark-light font-semibold text-base hover:bg-sand transition-colors">
                    See the demo
                  </button>
                </Link>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-3 mt-8 justify-center lg:justify-start">
                <div className="flex -space-x-2">
                  {["🧑", "👩", "🧔", "👧"].map((emoji, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-sand border-2 border-warm-white flex items-center justify-center text-sm">
                      {emoji}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-bark-light/60">
                  <span className="font-semibold text-bark-light">500+</span> people tracking already
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right: Phone mockup with live UI */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="flex-shrink-0"
          >
            <div className="relative">
              {/* Phone frame */}
              <div className="w-[280px] md:w-[300px] rounded-[2.5rem] bg-white border border-clay/60 shadow-2xl shadow-bark/5 p-3 relative">
                <div className="rounded-[2rem] bg-cream overflow-hidden">
                  {/* Status bar */}
                  <div className="flex items-center justify-between px-5 pt-3 pb-2">
                    <span className="text-[11px] font-semibold text-bark/60">9:41</span>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-2 rounded-sm bg-bark/30" />
                      <div className="w-4 h-2 rounded-sm bg-bark/30" />
                    </div>
                  </div>

                  {/* Dashboard preview */}
                  <div className="px-4 pb-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-bark-light/60 font-medium">Today&apos;s intake</p>
                        <p className="text-2xl font-display font-extrabold text-bark">24g<span className="text-base font-semibold text-bark-light/40"> / 50g</span></p>
                      </div>
                      <div className="w-14 h-14 rounded-full border-[3px] border-sage flex items-center justify-center bg-sage/10">
                        <span className="text-sm font-bold text-sage-dark">48%</span>
                      </div>
                    </div>

                    {/* Mini bar chart */}
                    <div className="p-3 rounded-xl bg-white/80 border border-clay/30">
                      <p className="text-[9px] font-semibold text-bark-light/50 uppercase tracking-wider mb-2">This week</p>
                      <div className="flex items-end gap-1.5 h-10">
                        {[30, 45, 22, 38, 15, 42, 24].map((v, i) => (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${(v / 50) * 100}%` }}
                            transition={{ delay: 0.5 + i * 0.08, duration: 0.4 }}
                            className={`flex-1 rounded-t ${i === 6 ? "bg-coral" : v > 40 ? "bg-peach" : "bg-sage/60"}`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Recent logs */}
                    <div className="space-y-1.5">
                      {[
                        { label: "Iced Latte", amount: "12g", time: "2h ago", icon: "☕" },
                        { label: "Granola Bar", amount: "8g", time: "4h ago", icon: "🥣" },
                        { label: "Orange Juice", amount: "4g", time: "6h ago", icon: "🍊" },
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + i * 0.1 }}
                          className="flex items-center justify-between p-2 rounded-lg bg-white/60"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{item.icon}</span>
                            <div>
                              <p className="text-[11px] font-semibold text-bark">{item.label}</p>
                              <p className="text-[9px] text-bark-light/50">{item.time}</p>
                            </div>
                          </div>
                          <span className="text-[11px] font-bold text-coral">{item.amount}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -left-8 px-3 py-1.5 rounded-xl bg-white shadow-lg shadow-bark/8 border border-clay/30"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">🔥</span>
                  <span className="text-xs font-bold text-bark">7 day streak!</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [3, -5, 3] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-2 -right-6 px-3 py-1.5 rounded-xl bg-white shadow-lg shadow-bark/8 border border-clay/30"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-sage-dark">+5 XP</span>
                  <span className="text-sm">⚡</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* How it works */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-28 mb-20"
        >
          <h2 className="font-display text-center text-2xl md:text-3xl font-bold text-bark mb-4">
            Three steps. Real change.
          </h2>
          <p className="text-center text-bark-light/60 text-sm mb-12 max-w-md mx-auto">
            No calorie counting. No food scales. Just quick, honest sugar tracking.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StepCard
              step="01"
              title="Log in seconds"
              desc="Tap what you ate. We estimate the sugar. Done in 10 seconds flat."
              icon={
                <svg viewBox="0 0 40 40" className="w-10 h-10">
                  <rect x="4" y="4" width="32" height="32" rx="8" fill="#FFB088" fillOpacity="0.2" />
                  <path d="M14 20l4 4 8-8" stroke="#FF6B6B" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
              color="coral"
            />
            <StepCard
              step="02"
              title="Get smart nudges"
              desc="AI spots patterns — 'your post-lunch spikes are 2× higher on Mondays.'"
              icon={
                <svg viewBox="0 0 40 40" className="w-10 h-10">
                  <rect x="4" y="4" width="32" height="32" rx="8" fill="#B8E8D0" fillOpacity="0.3" />
                  <circle cx="20" cy="20" r="8" fill="none" stroke="#6BA583" strokeWidth="2" />
                  <circle cx="20" cy="20" r="3" fill="#6BA583" />
                </svg>
              }
              color="sage"
            />
            <StepCard
              step="03"
              title="Level up for real"
              desc="Streaks, badges, XP — gamification that makes healthy habits addictive."
              icon={
                <svg viewBox="0 0 40 40" className="w-10 h-10">
                  <rect x="4" y="4" width="32" height="32" rx="8" fill="#FFD93D" fillOpacity="0.2" />
                  <path d="M20 10l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="#FFD93D" stroke="#E5C235" strokeWidth="1" />
                </svg>
              }
              color="golden"
            />
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-xs text-bark-light/40">
        Built with 💛 for healthier habits
      </footer>
    </div>
  );
}

function StepCard({ step, title, desc, icon, color }: { step: string; title: string; desc: string; icon: React.ReactNode; color: string }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="p-6 rounded-2xl bg-white/70 border border-clay/40 backdrop-blur-sm hover:shadow-lg hover:shadow-bark/5 transition-all"
    >
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <span className="text-[11px] font-bold text-bark-light/30 uppercase tracking-widest">{step}</span>
      </div>
      <h3 className="font-display text-lg font-bold text-bark mb-2">{title}</h3>
      <p className="text-sm text-bark-light/60 leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function SugarCube({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className="opacity-20">
      <rect x="4" y="4" width="24" height="24" rx="6" fill="#E8DDD3" stroke="#D4C8BC" strokeWidth="1" />
      <rect x="10" y="10" width="5" height="5" rx="1" fill="#D4C8BC" opacity="0.5" />
      <rect x="17" y="17" width="5" height="5" rx="1" fill="#D4C8BC" opacity="0.5" />
    </svg>
  );
}
