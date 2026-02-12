"use client";

import { useStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Settings, Zap, Moon, Battery, Activity, X, Sliders } from "lucide-react";
import { audio } from "@/lib/audio";
import { Slider } from "@/components/ui/slider";

const SCENARIOS = [
  {
    id: "lazy_sunday",
    label: "Lazy Sunday",
    icon: <Moon className="w-4 h-4 text-indigo-500" />,
    data: { steps: 350, sleepHours: 11, heartRate: 62 },
    description: "Low Activity + High Sleep = 'Lethargy'",
  },
  {
    id: "marathon_runner",
    label: "Marathon Mode",
    icon: <Activity className="w-4 h-4 text-emerald-600" />,
    data: { steps: 24500, sleepHours: 6, heartRate: 110 },
    description: "Extreme Activity = 'Carb Recovery'",
  },
  {
    id: "all_nighter",
    label: "All Nighter",
    icon: <Battery className="w-4 h-4 text-red-500" />,
    data: { steps: 4200, sleepHours: 3, heartRate: 85 },
    description: "Low Sleep = 'Ghrelin Spike'",
  }
];

export default function ScenarioSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  const { user, updatePassiveData, showToast } = useStore();

  // Custom State
  const [customSteps, setCustomSteps] = useState(user.passiveData?.steps || 0);
  const [customSleep, setCustomSleep] = useState(user.passiveData?.sleepHours || 8);

  // Sync with real data when it changes
  useEffect(() => {
    if (user.passiveData) {
      setCustomSteps(user.passiveData.steps || 0);
      setCustomSleep(user.passiveData.sleepHours || 8);
    }
  }, [user.passiveData]);

  const applyScenario = (scenario: typeof SCENARIOS[0]) => {
    updatePassiveData(scenario.data);
    audio.playSuccess();
    showToast(`🧪 Applied: ${scenario.label}`);
    setIsOpen(false);
  };

  const applyCustom = () => {
    updatePassiveData({
      steps: customSteps,
      sleepHours: customSleep,
      heartRate: 70 + Math.floor(customSteps / 1000) // Rough correlation
    });
    audio.playSuccess();
    showToast(`🧪 Applied Custom Simulator Data`);
    setIsOpen(false);
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-32 right-6 z-40 p-3 rounded-full bg-white shadow-xl border border-clay/20 text-bark hover:scale-110 active:scale-95 transition-all"
        whileHover={{ rotate: 90 }}
      >
        <Settings className="w-6 h-6 text-bark" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-bark/20 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-warm-white border border-white/50 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-coral/10">
                    <Zap className="w-5 h-5 text-coral" />
                  </div>
                  <div>
                    <h2 className="text-bark font-display font-bold text-lg">Wearable Simulator</h2>
                    <p className="text-bark-light/60 text-xs font-medium">Inject Context Data</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-sand/50 text-bark-light transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex p-1 bg-sand/30 rounded-xl mb-6">
                <button
                  onClick={() => setActiveTab('presets')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    activeTab === 'presets' ? 'bg-white shadow-sm text-bark' : 'text-bark-light/60 hover:text-bark'
                  }`}
                >
                  Presets
                </button>
                <button
                  onClick={() => setActiveTab('custom')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    activeTab === 'custom' ? 'bg-white shadow-sm text-bark' : 'text-bark-light/60 hover:text-bark'
                  }`}
                >
                  Custom
                </button>
              </div>

              {/* Content */}
              <div className="min-h-[220px]">
                {activeTab === 'presets' ? (
                  <div className="space-y-3">
                    {SCENARIOS.map((scenario) => (
                      <button
                        key={scenario.id}
                        onClick={() => applyScenario(scenario)}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white border border-clay/10 hover:border-coral/30 hover:shadow-md transition-all group text-left"
                      >
                        <div className="w-10 h-10 rounded-xl bg-sand/30 flex items-center justify-center group-hover:bg-coral/10 transition-colors">
                          {scenario.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                             <h3 className="text-bark font-bold text-sm">{scenario.label}</h3>
                             <span className="text-[10px] text-bark-light/50 font-bold bg-sand/30 px-2 py-0.5 rounded-full">
                                {scenario.data.steps} steps
                             </span>
                          </div>
                          <p className="text-bark-light/60 text-xs mt-0.5">{scenario.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6 pt-2">
                    {/* Steps Slider */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-bark flex items-center gap-2">
                          <Activity className="w-4 h-4 text-emerald-500" /> Steps
                        </label>
                        <span className="text-sm font-mono text-bark-light bg-sand/30 px-2 rounded-md">
                          {customSteps.toLocaleString()}
                        </span>
                      </div>
                      <Slider
                        defaultValue={[customSteps]}
                        max={30000}
                        step={100}
                        onValueChange={(vals) => setCustomSteps(vals[0])}
                        className="py-2"
                      />
                    </div>

                    {/* Sleep Slider */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-bark flex items-center gap-2">
                          <Moon className="w-4 h-4 text-indigo-500" /> Sleep (Hrs)
                        </label>
                        <span className="text-sm font-mono text-bark-light bg-sand/30 px-2 rounded-md">
                          {customSleep}h
                        </span>
                      </div>
                      <Slider
                        defaultValue={[customSleep]}
                        max={12}
                        step={0.5}
                        onValueChange={(vals) => setCustomSleep(vals[0])}
                        className="py-2"
                      />
                    </div>

                    <button
                      onClick={applyCustom}
                      className="w-full py-3 rounded-xl bg-bark text-sand font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
                    >
                      <Sliders className="w-4 h-4" />
                      Apply Custom Data
                    </button>
                  </div>
                )}
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
