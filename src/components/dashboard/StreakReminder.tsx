"use client";

import { useStore } from "@/lib/store";
import { motion } from "framer-motion";
import { Flame, Shield, Trophy } from "lucide-react";

export default function StreakReminder() {
  const { user, logs } = useStore();
  
  const today = new Date().toDateString();
  const hasLoggedToday = logs.some(log => 
    new Date(log.timestamp).toDateString() === today
  );

  // Streak milestone messages
  const getStreakMessage = () => {
    if (user.streak >= 30) return { icon: Trophy, text: "🏆 Legend! 30-day streak!", color: "text-yellow-500" };
    if (user.streak >= 7) return { icon: Shield, text: "🛡️ One week strong!", color: "text-blue-500" };
    if (user.streak >= 3) return { icon: Flame, text: "🔥 3-day streak! Building momentum!", color: "text-orange-500" };
    return null;
  };

  const milestone = getStreakMessage();

  // Don't show if already logged today AND no milestone
  if (hasLoggedToday && !milestone) return null;

  return (
    <div className="space-y-2">
      {/* Streak Protection Warning */}
      {!hasLoggedToday && user.streak > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-orange-50 border border-orange-100"
        >
          <Flame className="w-5 h-5 text-orange-400 fill-orange-400 animate-pulse" />
          <p className="text-sm font-bold text-orange-700">
            Log today to protect your <span className="text-orange-500">{user.streak}-day streak</span>!
          </p>
        </motion.div>
      )}

      {/* Milestone Message */}
      {milestone && hasLoggedToday && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-sage/10 border border-sage/20"
        >
          <milestone.icon className={`w-5 h-5 ${milestone.color}`} />
          <p className="text-sm font-bold text-sage-dark">{milestone.text}</p>
        </motion.div>
      )}
    </div>
  );
}
