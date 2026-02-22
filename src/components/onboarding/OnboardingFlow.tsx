"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { ChevronRight, Check, Dumbbell, User, Ruler, Weight } from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import { audio } from "@/lib/audio";
import { useRouter } from "next/navigation";

import { generateAnonName } from "@/lib/utils";

interface FormData {
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  height: number;
  weight: number;
  goal: "lose" | "maintain" | "gain";
}

// Steps: Gender -> Age -> Height -> Weight -> Goal -> Pledge

export default function OnboardingFlow() {
  const router = useRouter();
  const { setUser, user, isLoading } = useStore();
  const [step, setStep] = useState(0);

  // ROUTE GUARD: If data sync finishes and reveals user is already onboarded, bump to dashboard
  useEffect(() => {
    if (user.isOnboarded && !isLoading) {
      router.replace("/dashboard");
    }
  }, [user.isOnboarded, isLoading, router]);
  
  // Local state for smooth transitions before committing to store
  const [formData, setFormData] = useState<FormData>({
    name: "",
    age: 25,
    gender: "male",
    height: 170,
    weight: 70,
    goal: "maintain"
  });

  const nextStep = () => {
    audio.playClick();
    if (step < 5) {
      setStep(s => s + 1);
    } else {
      completeOnboarding();
    }
  };

  const completeOnboarding = () => {
    // Save to global store
    const bmi = Number((formData.weight / ((formData.height / 100) ** 2)).toFixed(1));
    
    // Only generate a random name if user is anonymous
    const nameToUse = user.isAnonymous ? generateAnonName() : user.displayName;
    
    setUser({
      ...user,
      displayName: nameToUse,
      age: formData.age,
      gender: formData.gender,
      height: formData.height,
      weight: formData.weight,
      bmi: bmi,
      isOnboarded: true,
      lastLogDate: new Date().toISOString().split('T')[0] // Initialize streak
    });

    audio.playSuccess();
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF6B6B', '#FFD93D', '#4ECDC4']
    });

    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  const updateData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // Variants for slide animations
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="min-h-[80vh] flex flex-col relative overflow-hidden max-w-md mx-auto">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-sand">
        <motion.div 
          className="h-full bg-coral"
          initial={{ width: "0%" }}
          animate={{ width: `${((step + 1) / 6) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <AnimatePresence mode="wait" custom={1}>
        
        {/* STEP 0: GENDER */}
        {step === 0 && (
          <motion.div
            key="step0"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex-1 flex flex-col justify-center p-8"
          >
            <h2 className="font-display font-black text-3xl text-bark mb-4 text-center">Identity.</h2>
            <p className="text-bark-light/60 font-medium mb-8 text-center uppercase text-[10px] tracking-widest">Select your gender</p>
            
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "male", label: "Male", icon: "👨" },
                { id: "female", label: "Female", icon: "👩" },
                { id: "other", label: "Other", icon: "🌈" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    updateData("gender", item.id);
                    setTimeout(nextStep, 300);
                  }}
                  className={cn(
                    "p-4 rounded-3xl border-2 font-bold capitalize transition-all flex flex-col items-center gap-2",
                    formData.gender === item.id
                      ? "border-coral bg-coral text-white shadow-xl scale-105"
                      : "border-clay/10 bg-white text-bark-light hover:border-clay/30"
                  )}
                >
                  <span className="text-3xl">{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 1: AGE */}
        {step === 1 && (
          <motion.div
            key="step1"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex-1 flex flex-col justify-center p-8 text-center"
          >
            <h2 className="font-display font-black text-3xl text-bark mb-2">Age.</h2>
            <p className="text-bark-light/60 font-medium mb-12">Helps calculate your metabolism.</p>
            
            <div className="mb-8">
              <span className="text-7xl font-black text-bark tracking-tighter">{formData.age}</span>
              <span className="text-xl font-bold text-bark-light/40 ml-1">yrs</span>
            </div>

            <input
              type="range"
              min="10"
              max="100"
              value={formData.age}
              onChange={(e) => updateData("age", Number(e.target.value))}
              className="w-full accent-coral h-2 bg-sand rounded-full appearance-none cursor-pointer"
            />
          </motion.div>
        )}

        {/* STEP 2: HEIGHT */}
        {step === 2 && (
          <motion.div
            key="step2"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex-1 flex flex-col justify-center p-8 text-center"
          >
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Ruler className="w-10 h-10 text-blue-500" />
            </div>
            <h2 className="font-display font-black text-3xl text-bark mb-2">How tall?</h2>
            <p className="text-bark-light/60 font-medium mb-12">cm</p>
            
            <div className="mb-8">
              <span className="text-7xl font-black text-bark tracking-tighter">{formData.height}</span>
              <span className="text-xl font-bold text-bark-light/40 ml-1">cm</span>
            </div>

            <input
               type="range"
               min="100"
               max="220"
               value={formData.height}
               onChange={(e) => updateData("height", Number(e.target.value))}
               className="w-full mt-8 accent-coral"
            />
          </motion.div>
        )}

        {/* STEP 3: WEIGHT */}
        {step === 3 && (
          <motion.div
            key="step3"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex-1 flex flex-col justify-center p-8 text-center"
          >
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Weight className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="font-display font-black text-3xl text-bark mb-8">Current Weight</h2>
            
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="w-40 text-center">
                <span className="text-6xl font-black text-bark tracking-tighter">{formData.weight}</span>
                <span className="text-xl font-bold text-bark-light/40 ml-1">kg</span>
              </div>
            </div>

            <input
               type="range"
               min="30"
               max="200"
               value={formData.weight}
               onChange={(e) => updateData("weight", Number(e.target.value))}
               className="w-full accent-emerald-500"
            />
          </motion.div>
        )}

        {/* STEP 4: GOAL */}
        {step === 4 && (
          <motion.div
            key="step4"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex-1 flex flex-col justify-center p-8 text-center"
          >
            <h2 className="font-display font-black text-3xl text-bark mb-8">Your Mission?</h2>
            
            <div className="space-y-4">
              {[
                { id: "lose", label: "Lose Fat", icon: "🔥" },
                { id: "maintain", label: "Maintain", icon: "⚖️" },
                { id: "gain", label: "Build Muscle", icon: "💪" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    updateData("goal", item.id);
                    setTimeout(nextStep, 500);
                  }}
                  className={cn(
                    "w-full p-6 rounded-3xl border-2 flex items-center gap-4 transition-all group",
                    formData.goal === item.id
                      ? "border-coral bg-coral text-white shadow-xl scale-105"
                      : "border-clay/10 bg-white text-bark hover:border-coral/30"
                  )}
                >
                  <span className="text-4xl group-hover:scale-110 transition-transform">{item.icon}</span>
                  <span className="text-xl font-bold">{item.label}</span>
                  {formData.goal === item.id && <Check className="ml-auto w-6 h-6" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 5: PLEDGE */}
        {step === 5 && (
          <motion.div
            key="step5"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex-1 flex flex-col justify-center p-8 text-center"
          >
            <h2 className="font-display font-black text-4xl text-coral mb-4">One Last Thing.</h2>
            <p className="text-lg font-medium text-bark mb-12 leading-relaxed">
              We don't do accounts. We do commitments. <br/>
              <span className="font-bold">Are you ready to track honestly for 7 days?</span>
            </p>

            <button
               onClick={completeOnboarding}
               className="w-full py-5 rounded-3xl bg-bark text-white font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group"
            >
               I PLEDGE ✋
            </button>
            <p className="mt-6 text-xs text-bark-light/40 font-bold uppercase tracking-widest">
              No Signup Required • Anonymous Profile
            </p>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Navigation Footer */}
      {step < 5 && (
        <div className="p-8 mt-auto">
          <button
            onClick={nextStep}
            className="w-full py-4 rounded-2xl bg-bark text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black transition-colors flex items-center justify-center gap-2"
          >
            Next <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
