"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { generateInsight } from "@/lib/ml-simulation";

export default function InsightCard() {
  const { logs, user } = useStore();
  const [insight, setInsight] = useState<{ icon: any; text: string; color: string; severity: string } | null>(null);

  useEffect(() => {
    const hour = new Date().getHours();
    const today = new Date().toDateString();
    const todaysLogs = logs.filter(l => new Date(l.timestamp).toDateString() === today);
    const todaySugar = todaysLogs.reduce((acc, l) => acc + l.amount, 0);
    const lastLog = logs[logs.length - 1];

    const result = generateInsight({
      hour,
      todaySugar,
      lastLogAmount: lastLog?.amount ?? null,
      streak: user.streak,
      age: user.age,
      weight: user.weight,
      height: user.height,
      logCount: todaysLogs.length,
    });

    setInsight(result);
  }, [logs, user]);

  if (!insight) return null;

  const Icon = insight.icon;

  const severityBorder = {
    warning: "border-rose-500/20",
    success: "border-emerald-500/20",
    info: "border-zinc-800",
  }[insight.severity] || "border-zinc-800";

  return (
    <div className={`p-4 rounded-2xl bg-zinc-900 border ${severityBorder} flex gap-4 items-start transition-all`}>
      <div className={`p-2 rounded-lg bg-zinc-950 border border-zinc-800 ${insight.color} shrink-0`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-zinc-200 mb-1 flex items-center gap-2">
          🧠 Smart Insight
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-medium ${
            insight.severity === "warning" ? "bg-rose-500/10 text-rose-400" :
            insight.severity === "success" ? "bg-emerald-500/10 text-emerald-400" :
            "bg-zinc-800 text-zinc-400"
          }`}>
            {insight.severity === "warning" ? "Alert" : insight.severity === "success" ? "Nice!" : "Insight"}
          </span>
        </h3>
        <p className="text-sm text-zinc-400 leading-relaxed">
          {insight.text}
        </p>
      </div>
    </div>
  );
}

