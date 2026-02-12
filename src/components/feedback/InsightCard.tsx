"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { Brain, Moon, Sun, Footprints } from "lucide-react";

export default function InsightCard() {
  const { logs, user } = useStore();
  const [insight, setInsight] = useState<{ icon: any; text: string; color: string } | null>(null);

  useEffect(() => {
    const hour = new Date().getHours();
    const lastLog = logs[logs.length - 1];

    if (!lastLog) {
      setInsight({
        icon: Sun,
        text: "Morning, fighter! Tracking your first meal sets the tone for the day.",
        color: "text-amber-400",
      });
      return;
    }

    // Context-Aware Logic (Simulated ML)
    if (hour >= 20) {
      setInsight({
        icon: Moon,
        text: "Sugar this late can reduce deep sleep by 15%. Consider water instead?",
        color: "text-indigo-400",
      });
    } else if (lastLog.amount > 30) {
      setInsight({
        icon: Footprints,
        text: "High sugar spike detected. A 10-minute walk now can reduce the crash.",
        color: "text-emerald-400",
      });
    } else {
      setInsight({
        icon: Brain,
        text: "You're staying within healthy limits. Your focus levels should remain stable.",
        color: "text-rose-400",
      });
    }
  }, [logs]);

  if (!insight) return null;

  return (
    <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex gap-4 items-start">
      <div className={`p-2 rounded-lg bg-zinc-950 border border-zinc-800 ${insight.color}`}>
        <insight.icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-zinc-200 mb-1">Smart Insight</h3>
        <p className="text-sm text-zinc-400 leading-relaxed">
          {insight.text}
        </p>
      </div>
    </div>
  );
}
