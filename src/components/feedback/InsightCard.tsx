"use client";

import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HealthInsight, generateMLInsight } from "@/lib/insight-engine";
import { generatePersonalizedInsight } from "@/lib/food-ai";
import { Sparkles, Lightbulb, ChevronDown, ChevronUp, Activity, CheckCircle2, Lock, ArrowUpRight } from "lucide-react";
import { audio } from "@/lib/audio";
import confetti from "canvas-confetti";

export default function InsightCard() {
  const { user, logs, addScore, showToast, setUser } = useStore();
  const [insight, setInsight] = useState<HealthInsight | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [actionCompleted, setActionCompleted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    async function loadInsight() {
      setIsGenerating(true);
      
      const heightInMeters = (user.height || 170) / 100;
      const bmi = (user.weight || 70) / (heightInMeters * heightInMeters);
      
      const todaysLogs = logs.filter(log => 
        new Date(log.timestamp).toDateString() === new Date().toDateString()
      );
      const totalSugar = todaysLogs.reduce((acc, log) => acc + log.amount, 0);

      const ctx = {
        age: user.age || 25,
        bmi,
        steps: user.passiveData?.steps || 0,
        heartRate: user.passiveData?.heartRate || 72,
        sleepHours: user.passiveData?.sleepHours || 8,
        timeOfDay: new Date().getHours(),
        sugarIntake: totalSugar,
        isMale: user.gender === "male"
      };

      const freeTrialsUsed = (user as any).freeTrialsUsed || 0;
      
      if (user.uid || freeTrialsUsed < 3) {
        try {
          const aiResult = await generatePersonalizedInsight(ctx);
          if (aiResult) {
            setInsight(aiResult);
            if (!user.uid) {
               setUser({ freeTrialsUsed: freeTrialsUsed + 1 } as any);
            }
          } else {
            setInsight(generateMLInsight(ctx as any));
          }
        } catch (e) {
          setInsight(generateMLInsight(ctx as any));
        }
      } else {
        setInsight(generateMLInsight(ctx as any));
      }
      
      setIsGenerating(false);
      setActionCompleted(false);
    }

    loadInsight();
  }, [logs, user.passiveData?.steps, user.uid, user.height, user.weight]);

  const handleActionComplete = () => {
    if (actionCompleted) return;
    setActionCompleted(true);
    addScore(7); 
    audio.playSuccess();
    showToast("🎯 Challenge Completed! +7 Action XP");
    confetti({
      particleCount: 80,
      spread: 60,
      colors: ['#B8E8D0', '#6FCF97', '#27AE60']
    });
  };

  if (!insight) return null;

  const isLocked = !user.uid && ((user as any).freeTrialsUsed >= 3);

  const priorityColors = {
    low: "bg-sage/10 border-sage/20 text-sage-dark",
    medium: "bg-orange-50 border-orange-100 text-orange-700",
    high: "bg-rose-50 border-rose-100 text-rose-700"
  };

  return (
    <motion.div
      layout
      className={`p-5 rounded-[2.5rem] border relative overflow-hidden ${priorityColors[insight.priority]}`}
    >
      <div className="absolute -right-4 -top-4 opacity-10">
        <Sparkles className="w-24 h-24" />
      </div>

      {isLocked && (
        <div className="absolute inset-0 z-20 bg-white/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
           <div className="w-12 h-12 rounded-full bg-bark flex items-center justify-center mb-3 shadow-lg">
              <Lock className="w-5 h-5 text-white" />
           </div>
           <h4 className="font-display font-bold text-bark mb-1">Supercharge Active</h4>
           <p className="text-[10px] text-bark-light font-medium mb-4">You&apos;ve used your 3 free AI Bio-Insights.</p>
           <button className="px-4 py-2 bg-coral text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-md hover:scale-105 transition-all">
             Upgrade Now <ArrowUpRight className="w-3 h-3" />
           </button>
        </div>
      )}
      
      <div className={`relative z-10 space-y-4 ${isLocked ? 'blur-[8px] opacity-40 grayscale' : ''}`}>
        <div className="flex items-start justify-between">
          <div className="flex gap-4 pr-10">
            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm">
              {isGenerating ? (
                 <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                   <Activity className="w-5 h-5 text-coral" />
                 </motion.div>
              ) : (
                <Lightbulb className={`w-5 h-5 ${insight.priority === 'low' ? 'text-sage-dark' : 'text-orange-500'}`} />
              )}
            </div>
            <div>
              <h3 className="font-bold text-[10px] uppercase tracking-[0.2em] opacity-60 mb-1">
                {isGenerating ? "Analyzing Biosignals..." : (insight.title || "Health Insight")}
              </h3>
              <p className="text-bark font-bold leading-tight font-display text-lg">
                {insight.message}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
           <motion.button
             whileTap={{ scale: 0.95 }}
             onClick={handleActionComplete}
             disabled={actionCompleted || isLocked}
             className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer ${
               actionCompleted 
                 ? 'bg-sage/20 border border-sage/30 text-sage-dark' 
                 : 'bg-white shadow-sm border border-black/5 hover:bg-clay/10 active:scale-95'
             }`}
           >
             {actionCompleted ? (
               <><CheckCircle2 className="w-4 h-4 text-sage" /><span className="text-xs font-black">Done! +7 XP</span></>
             ) : (
               <><Activity className="w-3.5 h-3.5" /><span className="text-xs font-black">{insight.action}</span><span className="text-[9px] font-bold text-coral ml-1">+7 XP</span></>
             )}
           </motion.button>
           
           <button 
             onClick={() => !isLocked && setIsExpanded(!isExpanded)}
             className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1 opacity-60 transition-opacity"
           >
             Explain Why {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
           </button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="pt-4 border-t border-black/5 mt-2">
                <p className="text-xs font-medium leading-relaxed opacity-80 italic">&quot;{insight.why}&quot;</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

