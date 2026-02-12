import { AIParsedFood } from "./food-ai";

interface UserContext {
  bmi: number;
  steps: number;
  heartRate: number;
  sleepHours: number;
  timeOfDay: number; // 0-23
  totalSugarToday: number;
}

export interface HealthInsight {
  title: string;
  message: string;
  action: string;
  why: string;
  priority: "low" | "medium" | "high";
}

export function generateMLInsight(ctx: UserContext): HealthInsight {
  const { bmi, steps, totalSugarToday, timeOfDay } = ctx;
  
  // High Sugar + Low Activity
  if (totalSugarToday > 40 && steps < 3000) {
    return {
      title: "Bioenergetic Alert",
      message: "Your sugar intake is outpacing your muscle activity.",
      action: "15 min brisk walk",
      why: "Muscle movement activates GLUT4 transporters, which pull sugar out of your blood without needing extra insulin.",
      priority: "high"
    };
  }

  // DEMO SCENARIO: Marathon/High Activity
  if (steps > 20000) {
    return {
      title: "Glycogen Depletion Alert",
      message: "You've burned through your glycogen stores with high activity.",
      action: "Eat complex carbs now",
      why: "Post-exercise insulin sensitivity is at its peak. Your body will use sugar for muscle repair, not fat storage.",
      priority: "high"
    };
  }

  // DEMO SCENARIO: Sleep Deprivation
  if (ctx.sleepHours !== undefined && ctx.sleepHours < 5) {
     return {
      title: "Ghrelin Spike Warning",
      message: "Lack of sleep triggers 'Ghrelin' (hunger hormone) and blocks 'Leptin' (fullness).",
      action: "Avoid caffeine after 2pm",
      why: "Your brain is craving sugar to compensate for low energy. Don't be fooled—it's false hunger.",
      priority: "high"
    }; 
  }

  // Late Night Sugar
  if (timeOfDay > 20 && totalSugarToday > 10) {
    return {
      title: "Circadian Mismatch",
      message: "Sugar this late can suppress melatonin and spike your core temperature.",
      action: "Drink 500ml water",
      why: "Hydration helps kidneys process excess glucose and supports the cooling of your body for sleep.",
      priority: "medium"
    };
  }

  // High BMI + Moderate Sugar
  if (bmi > 25 && totalSugarToday > 25) {
     return {
      title: "Metabolic Nudge",
      message: "Your body is working hard to stabilize this glucose load.",
      action: "Stand for 10 mins",
      why: "Simple 'postprandial' standing helps reduce the glycemic peak by engaging your postural muscles.",
      priority: "medium"
    };
  }

  // Good Balance
  if (steps > 7000 && totalSugarToday < 30) {
    return {
      title: "Metabolic Peak",
      message: "You're in the fat-burning zone despite your sugar intake.",
      action: "Keep it up!",
      why: "High activity levels increase your insulin sensitivity, making sugar less inflammatory.",
      priority: "low"
    };
  }

  // Default
  return {
    title: "Daily Focus",
    message: "Consistency is your best weapon against sugar spikes.",
    action: "Consistency Check",
    why: "Small daily habits are 10x more effective than occasional drastic changes.",
    priority: "low"
  };
}
