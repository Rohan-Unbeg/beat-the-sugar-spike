"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";

const steps = ["welcome", "age", "weight", "height", "gender"];

const stepMeta: Record<string, { emoji: string; title: string; subtitle: string }> = {
  welcome: { emoji: "👋", title: "Let's get started", subtitle: "We need a few details to personalize your plan." },
  age: { emoji: "🎂", title: "How old are you?", subtitle: "This helps us calculate your metabolism." },
  weight: { emoji: "⚖️", title: "What's your weight?", subtitle: "Be honest! We won't tell anyone." },
  height: { emoji: "📏", title: "How tall are you?", subtitle: "Helps personalize your health insights." },
  gender: { emoji: "🧬", title: "Biological sex?", subtitle: "Helps with accurate calorie estimation." },
};

export default function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const router = useRouter();
  const { setUser, completeOnboarding, syncToFirestore } = useStore();

  const [age, setAge] = useState(25);
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [gender, setGender] = useState<"male" | "female" | "other" | null>(null);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep(c => c + 1);
    } else {
      finishOnboarding();
    }
  };

  const finishOnboarding = () => {
    setUser({ age, weight, height, gender });
    completeOnboarding();
    
    // Fire confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF6B6B', '#FFB088', '#B8E8D0']
    });

    // Background sync
    syncToFirestore().catch(() => {});
    
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  };

  const stepName = steps[currentStep];
  const meta = stepMeta[stepName];
  const isWelcome = stepName === "welcome";

  const variants = {
    enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? 50 : -50, opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-warm-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vh] h-[50vh] bg-peach/20 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50vh] h-[50vh] bg-mint/20 rounded-full blur-[80px] pointer-events-none" />

      {/* Progress Bar (skip for welcome) */}
      {!isWelcome && (
        <div className="fixed top-0 left-0 w-full h-1.5 bg-clay/20">
          <motion.div
            className="h-full bg-coral"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}

      <AnimatePresence initial={false} mode="wait" custom={direction}>
        <motion.div
          key={currentStep}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
          className="w-full max-w-sm text-center"
        >
          <div className="mb-6 text-6xl animate-bounce-slow">
            {meta.emoji}
          </div>
          
          <h1 className="font-display text-3xl font-bold text-bark mb-3">{meta.title}</h1>
          <p className="text-bark-light/60 mb-10 text-lg leading-relaxed">{meta.subtitle}</p>

          <div className="min-h-[160px] flex items-center justify-center mb-8">
            {stepName === "welcome" && (
              <div className="p-6 bg-white/60 rounded-3xl border border-clay/30 rotate-3 transform transition-transform hover:rotate-0">
                 <p className="font-handwriting text-xl text-coral font-bold -rotate-6">Ready to change?</p>
              </div>
            )}

            {stepName === "age" && (
              <div className="w-full">
                <div className="text-5xl font-black text-bark mb-4 font-display">{age}</div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full h-2 bg-clay rounded-full appearance-none cursor-pointer accent-coral"
                />
              </div>
            )}

            {stepName === "weight" && (
              <div className="w-full">
                <div className="text-5xl font-black text-bark mb-4 font-display">{weight} <span className="text-2xl text-bark-light/40 font-bold">kg</span></div>
                <input
                  type="range"
                  min="30"
                  max="150"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full h-2 bg-clay rounded-full appearance-none cursor-pointer accent-sage"
                />
              </div>
            )}

            {stepName === "height" && (
              <div className="w-full">
                <div className="text-5xl font-black text-bark mb-4 font-display">{height} <span className="text-2xl text-bark-light/40 font-bold">cm</span></div>
                <input
                  type="range"
                  min="100"
                  max="220"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full h-2 bg-clay rounded-full appearance-none cursor-pointer accent-peach"
                />
              </div>
            )}

            {stepName === "gender" && (
              <div className="flex gap-4 w-full">
                {(["male", "female", "other"] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={`flex-1 p-4 rounded-2xl border-2 transition-all ${
                      gender === g
                        ? "border-coral bg-coral/10 text-coral shadow-lg shadow-coral/20"
                        : "border-clay/50 bg-white text-bark-light/60 hover:border-clay hover:bg-sand"
                    }`}
                  >
                    <span className="block text-2xl mb-1 capitalize">
                      {g === "male" ? "👨" : g === "female" ? "👩" : "🧑"}
                    </span>
                    <span className="font-bold text-sm capitalize">{g}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button
            onClick={nextStep}
            disabled={stepName === "gender" && !gender}
            className="w-full h-14 rounded-2xl bg-bark text-white font-bold text-lg shadow-xl shadow-bark/20 hover:bg-bark-light hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            {isWelcome ? "Let's Go" : currentStep === steps.length - 1 ? "Finish Setup" : "Next"}
            {!isWelcome && <ArrowRight className="w-5 h-5 ml-2" />}
          </Button>

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
