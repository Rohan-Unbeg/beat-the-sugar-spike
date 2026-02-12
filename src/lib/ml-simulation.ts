import { Brain, Moon, Sun, Footprints, Droplets, Heart, TrendingDown, Zap, Shield, Sparkles } from "lucide-react";

interface InsightResult {
  icon: any;
  text: string;
  color: string;
  severity: "info" | "warning" | "success";
}

interface InsightContext {
  hour: number;
  todaySugar: number;
  lastLogAmount: number | null;
  streak: number;
  age: number | null;
  weight: number | null;
  height: number | null;
  logCount: number;
}

export function generateInsight(ctx: InsightContext): InsightResult {
  const { hour, todaySugar, lastLogAmount, streak, logCount } = ctx;

  // Priority-based insight selection (most specific wins)

  // Night-time sugar warning
  if (hour >= 21 && lastLogAmount !== null) {
    return {
      icon: Moon,
      text: "Sugar this late can reduce deep sleep by up to 15%. Research shows it takes 2-3 hours for blood sugar to stabilize. Consider water or herbal tea instead?",
      color: "text-indigo-400",
      severity: "warning",
    };
  }

  // Late evening alert
  if (hour >= 19 && lastLogAmount !== null && lastLogAmount > 15) {
    return {
      icon: Moon,
      text: "Evening sugar spikes can disrupt your circadian rhythm. Your body's insulin sensitivity is lower at night, making this hit harder.",
      color: "text-purple-400",
      severity: "warning",
    };
  }

  // Over daily limit
  if (todaySugar > 50) {
    return {
      icon: TrendingDown,
      text: `You've crossed the WHO recommended limit (50g). You're at ${todaySugar}g. A brisk 15-minute walk can help your body process the excess glucose.`,
      color: "text-rose-400",
      severity: "warning",
    };
  }

  // High single intake
  if (lastLogAmount !== null && lastLogAmount >= 30) {
    return {
      icon: Footprints,
      text: "High sugar spike detected! A 10-minute walk right now can reduce the glucose crash by up to 30%. Your muscles will absorb the excess sugar.",
      color: "text-emerald-400",
      severity: "warning",
    };
  }

  // Approaching limit
  if (todaySugar > 35 && todaySugar <= 50) {
    return {
      icon: Shield,
      text: `You're at ${todaySugar}g — approaching your daily limit. Consider switching to protein-rich snacks for the rest of the day.`,
      color: "text-amber-400",
      severity: "info",
    };
  }

  // Streak celebration
  if (streak >= 7) {
    return {
      icon: Sparkles,
      text: `🔥 ${streak}-day streak! Consistent tracking builds metabolic awareness. Studies show people who track regularly reduce sugar intake by 23% after 2 weeks.`,
      color: "text-yellow-400",
      severity: "success",
    };
  }

  if (streak >= 3) {
    return {
      icon: Zap,
      text: `${streak}-day streak going strong! You're building a habit. It takes 21 days to make it automatic — keep pushing!`,
      color: "text-orange-400",
      severity: "success",
    };
  }

  // Hydration reminder (afternoon)
  if (hour >= 14 && hour <= 17 && todaySugar > 20) {
    return {
      icon: Droplets,
      text: "Afternoon energy dip? Before reaching for sugar, try 500ml of water. Dehydration mimics sugar cravings in 60% of cases.",
      color: "text-cyan-400",
      severity: "info",
    };
  }

  // Morning motivation
  if (hour < 12 && logCount === 0) {
    return {
      icon: Sun,
      text: "Good morning, Fighter! Starting your day by tracking sets the tone. People who log breakfast sugar make 40% better choices all day.",
      color: "text-amber-400",
      severity: "info",
    };
  }

  // Clean day
  if (todaySugar < 15 && logCount > 0) {
    return {
      icon: Heart,
      text: "Incredible discipline! Your sugar intake is well below the healthy threshold. Your body is thanking you with stable energy levels.",
      color: "text-green-400",
      severity: "success",
    };
  }

  // Default: brain health
  return {
    icon: Brain,
    text: "You're staying within healthy limits. Stable blood sugar = stable focus. Your cognitive performance should remain sharp.",
    color: "text-rose-400",
    severity: "info",
  };
}
