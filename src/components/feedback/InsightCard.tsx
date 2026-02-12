"use client";

import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HealthInsight, generateMLInsight } from "@/lib/insight-engine";
import { Sparkles, Lightbulb, ChevronDown, ChevronUp, Activity, CheckCircle2 } from "lucide-react";
import { audio } from "@/lib/audio";
import confetti from "canvas-confetti";

export default function InsightCard() {
  const { user, logs, addScore, showToast } = useStore();
  const [insight, setInsight] = useState<HealthInsight | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [actionCompleted, setActionCompleted] = useState(false);

  useEffect(() => {
    // Calculate BMI for the engine
    const heightInMeters = (user.height || 170) / 100;
    const bmi = (user.weight || 70) / (heightInMeters * heightInMeters);
    
    const todaysLogs = logs.filter(log => 
      new Date(log.timestamp).toDateString() === new Date().toDateString()
    );
    const totalSugar = todaysLogs.reduce((acc, log) => acc + log.amount, 0);

    const result = generateMLInsight({
      bmi,
      steps: user.passiveData.steps,
      heartRate: user.passiveData.heartRate,
      sleepHours: user.passiveData.sleepHours,
      timeOfDay: new Date().getHours(),
      totalSugarToday: totalSugar
    });

    setInsight(result);
    setActionCompleted(false); // Reset when insight changes
  }, [logs, user.passiveData, user.height, user.weight]);

  const handleActionComplete = () => {
    if (actionCompleted) return;
    setActionCompleted(true);
    addScore(7); // +7 XP for completing action (ps.md 2.9)
    audio.playSuccess();
    showToast("🎯 +7 Action XP! You completed the challenge!");
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#B8E8D0', '#6FCF97', '#27AE60']
    });
  };

  if (!insight) return null;

  const priorityColors = {
    low: "bg-sage/10 border-sage/20 text-sage-dark",
    medium: "bg-orange-50 border-orange-100 text-orange-700",
    high: "bg-rose-50 border-rose-100 text-rose-700"
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-5 rounded-[2rem] border relative overflow-hidden transition-colors ${priorityColors[insight.priority]}`}
    >
      <div className="absolute -right-4 -top-4 opacity-10">
        <Sparkles className="w-24 h-24" />
      </div>
      
      <div className="relative z-10 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm">
              <Lightbulb className={`w-5 h-5 ${insight.priority === 'low' ? 'text-sage-dark' : 'text-orange-500'}`} />
            </div>
            <div>
              <h3 className="font-bold text-[10px] uppercase tracking-[0.2em] opacity-60 mb-1">{insight.title}</h3>
              <p className="text-bark font-bold leading-tight font-display text-lg pr-4">
                {insight.message}
              </p>
            </div>
          </div>
        </div>

        {/* Corrective Action Button (ps.md 2.8) */}
        <div className="flex items-center justify-between pt-2">
           <motion.button
             whileTap={{ scale: 0.95 }}
             onClick={handleActionComplete}
             disabled={actionCompleted}
             className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
               actionCompleted 
                 ? 'bg-sage/20 border border-sage/30 text-sage-dark' 
                 : 'bg-white/80 backdrop-blur-sm border border-black/10 hover:bg-white shadow-sm hover:shadow-md'
             }`}
           >
             {actionCompleted ? (
               <>
                 <CheckCircle2 className="w-4 h-4 text-sage" />
                 <span className="text-xs font-black tracking-tight">Done! +7 XP</span>
               </>
             ) : (
               <>
                 <Activity className="w-3.5 h-3.5" />
                 <span className="text-xs font-black tracking-tight">{insight.action}</span>
                 <span className="text-[9px] font-bold text-coral ml-1">+7 XP</span>
               </>
             )}
           </motion.button>
           
           <button 
             onClick={() => setIsExpanded(!isExpanded)}
             className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:opacity-70 transition-opacity"
           >
             Explain Why {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
           </button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-black/5 mt-2">
                <p className="text-xs font-medium leading-relaxed opacity-80 italic">
                  &quot;{insight.why}&quot;
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

