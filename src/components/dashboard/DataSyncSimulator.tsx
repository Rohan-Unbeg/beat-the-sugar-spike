"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Activity, Moon, Watch } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DataSyncSimulator() {
  const [isOpen, setIsOpen] = useState(false);
  const [steps, setSteps] = useState(0);
  const [sleep, setSleep] = useState(0);
  const { addScore } = useStore();
  const [syncing, setSyncing] = useState(false);

  const handleSync = () => {
    setSyncing(true);
    // Simulate "Finding Device" and "Syncing"
    setTimeout(() => {
      setSyncing(false);
      // Hackathon Logic: Reward user for "good" behavior immediately
      if (steps > 5000) addScore(50);
      if (sleep > 7) addScore(30);
      alert(`Synced! Found ${steps} steps and ${sleep}hrs sleep. Added to profile.`);
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
                    <span>{steps}</span>
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
                    <span>{sleep}</span>
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
                  {syncing ? "Syncing..." : "Simulate Sync"}
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
