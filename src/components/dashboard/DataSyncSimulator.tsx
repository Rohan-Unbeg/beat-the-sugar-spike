"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Activity, Moon, Watch, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DataSyncSimulator() {
  const [isOpen, setIsOpen] = useState(false);
  const [steps, setSteps] = useState(0);
  const [sleep, setSleep] = useState(0);
  const { addScore, showToast } = useStore();
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(false);

  const handleSync = () => {
    setSyncing(true);
    setSynced(false);
    setTimeout(() => {
      setSyncing(false);
      setSynced(true);
      let bonus = 0;
      if (steps > 5000) bonus += 50;
      if (sleep > 7) bonus += 30;
      if (bonus > 0) addScore(bonus);
      showToast(`✅ Synced: ${steps.toLocaleString()} steps, ${sleep}hrs sleep${bonus > 0 ? ` → +${bonus} XP!` : ""}`);
      setTimeout(() => setSynced(false), 3000);
    }, 1500);
  };

  return (
    <div className="fixed bottom-20 right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 w-72"
          >
            <Card className="p-4 bg-zinc-900 border-zinc-700 shadow-2xl">
              <h3 className="font-bold text-zinc-100 flex items-center gap-2 mb-4">
                <Watch className="w-4 h-4 text-blue-400" /> 
                Device Simulator
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> Steps</span>
                    <span className="font-mono">{steps.toLocaleString()}</span>
                  </div>
                  <Slider 
                    value={[steps]} 
                    max={15000} 
                    step={500}
                    onValueChange={(v) => setSteps(v[0])}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span className="flex items-center gap-1"><Moon className="w-3 h-3" /> Sleep (hrs)</span>
                    <span className="font-mono">{sleep}</span>
                  </div>
                  <Slider 
                    value={[sleep]} 
                    max={12} 
                    step={1}
                    onValueChange={(v) => setSleep(v[0])}
                  />
                </div>

                <Button 
                  onClick={handleSync} 
                  disabled={syncing}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white"
                >
                  {syncing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Syncing...</>
                  ) : synced ? (
                    <><Check className="w-4 h-4 mr-2" /> Synced!</>
                  ) : (
                    "Simulate Sync"
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className="rounded-full w-12 h-12 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 shadow-lg"
      >
        <Watch className={`w-6 h-6 ${isOpen ? "text-blue-400" : "text-zinc-400"}`} />
      </Button>
    </div>
  );
}

