"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { ArrowRight, ChevronLeft, Check, User } from "lucide-react";
import { useRouter } from "next/navigation";

const steps = ["age", "weight", "height", "gender"];

export default function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const { setUser, completeOnboarding } = useStore();
  const router = useRouter();

  // Local state for inputs before saving
  const [age, setAge] = useState(25);
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [gender, setGender] = useState<"male" | "female" | "other" | null>(null);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finishOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const finishOnboarding = () => {
    setUser({ age, weight, height, gender });
    completeOnboarding();
    router.push("/dashboard");
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="mb-8">
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-rose-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="text-right text-xs text-zinc-500 mt-2">
          Step {currentStep + 1} of {steps.length}
        </p>
      </div>

      <AnimatePresence mode="wait" initial={false} custom={1}>
        {currentStep === 0 && (
          <Slide key="age" variants={variants}>
            <h2 className="text-3xl font-bold mb-2">How young are you?</h2>
            <p className="text-zinc-400 mb-8">We use this to personalize your insights.</p>
            <div className="py-8">
              <div className="text-6xl font-bold text-center mb-8 text-rose-500">{age}</div>
              <Slider
                value={[age]}
                onValueChange={(val) => setAge(val[0])}
                min={16}
                max={90}
                step={1}
                className="py-4"
              />
              <p className="text-center text-zinc-500 mt-4">years old</p>
            </div>
          </Slide>
        )}

        {currentStep === 1 && (
          <Slide key="weight" variants={variants}>
            <h2 className="text-3xl font-bold mb-2">What's your weight?</h2>
             <p className="text-zinc-400 mb-8">Used to calculate hydration and sugar impact.</p>
            <div className="py-8">
              <div className="text-6xl font-bold text-center mb-8 text-rose-500">{weight} <span className="text-2xl text-zinc-500">kg</span></div>
              <Slider
                value={[weight]}
                onValueChange={(val) => setWeight(val[0])}
                min={30}
                max={150}
                step={1}
                className="py-4"
              />
            </div>
          </Slide>
        )}

        {currentStep === 2 && (
          <Slide key="height" variants={variants}>
            <h2 className="text-3xl font-bold mb-2">How tall are you?</h2>
             <p className="text-zinc-400 mb-8">Helping us understand your body metrics.</p>
            <div className="py-8">
              <div className="text-6xl font-bold text-center mb-8 text-rose-500">{height} <span className="text-2xl text-zinc-500">cm</span></div>
              <Slider
                value={[height]}
                onValueChange={(val) => setHeight(val[0])}
                min={100}
                max={220}
                step={1}
                className="py-4"
              />
            </div>
          </Slide>
        )}

        {currentStep === 3 && (
          <Slide key="gender" variants={variants}>
            <h2 className="text-3xl font-bold mb-2">Biological Sex</h2>
            <p className="text-zinc-400 mb-8">For accurate metabolic calculations.</p>
            <div className="grid grid-cols-1 gap-4 py-4">
              <GenderCard
                label="Male"
                selected={gender === "male"}
                onClick={() => setGender("male")}
              />
              <GenderCard
                label="Female"
                selected={gender === "female"}
                onClick={() => setGender("female")}
              />
               <GenderCard
                label="Other"
                selected={gender === "other"}
                onClick={() => setGender("other")}
              />
            </div>
          </Slide>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mt-12">
        {currentStep > 0 ? (
          <Button variant="ghost" onClick={prevStep} className="text-zinc-400 hover:text-white">
            <ChevronLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        ) : <div />}
        
        <Button 
          onClick={nextStep} 
          disabled={currentStep === 3 && !gender}
          className="bg-zinc-100 text-zinc-950 hover:bg-white rounded-full px-8 py-6 text-lg"
        >
          {currentStep === steps.length - 1 ? "Finish" : "Next"} <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function Slide({ children, variants }: { children: React.ReactNode; variants: any }) {
  return (
    <motion.div
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="min-h-[300px] flex flex-col"
    >
      {children}
    </motion.div>
  );
}

function GenderCard({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
        selected
          ? "border-rose-500 bg-rose-500/10 text-rose-500"
          : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-800"
      }`}
    >
      <span className="font-semibold text-lg">{label}</span>
      {selected && <Check className="w-5 h-5" />}
    </div>
  );
}
