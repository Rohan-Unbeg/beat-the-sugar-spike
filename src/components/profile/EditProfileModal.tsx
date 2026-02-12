"use client";

import { useStore } from "@/lib/store";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProfileModal({ isOpen, onClose }: Props) {
  const { user, setUser, syncToFirestore, showToast } = useStore();
  const [loading, setLoading] = useState(false);

  const [age, setAge] = useState(user.age || 25);
  const [weight, setWeight] = useState(user.weight || 70);
  const [height, setHeight] = useState(user.height || 170);
  const [gender, setGender] = useState<"male" | "female" | "other">(user.gender || "male");

  const handleSave = async () => {
    setLoading(true);
    try {
        setUser({ age, weight, height, gender });
        // Race the sync against a timeout so UI doesn't hang forever if network is weird
      // Race against a timeout, but treating timeout as "Success (Background Sync)"
      await Promise.race([
        syncToFirestore(),
        new Promise((_, reject) => setTimeout(() => reject("TIMEOUT"), 4000))
      ]);
      showToast("✅ Profile updated!");
    } catch (error) {
      if (error === "TIMEOUT") {
          console.log("Background sync pending (Timeout reached)");
          showToast("✅ Saved (Syncing in background...)");
      } else {
          console.error("Save error:", error);
          showToast("⚠️ Saved to device (Offline Mode)");
      }
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-bark/20 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-[2rem] p-6 w-full max-w-sm shadow-2xl relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-sand transition-colors text-bark-light"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-display text-2xl font-bold text-bark mb-6">Edit Body Stats</h2>

            <div className="space-y-6">
              {/* Age */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-bold text-bark-light/60 uppercase tracking-widest">Age</label>
                  <span className="font-display font-bold text-bark">{age}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full h-2 bg-clay rounded-full appearance-none cursor-pointer accent-coral"
                />
              </div>

              {/* Weight */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-bold text-bark-light/60 uppercase tracking-widest">Weight (kg)</label>
                  <span className="font-display font-bold text-bark">{weight}</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="150"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full h-2 bg-clay rounded-full appearance-none cursor-pointer accent-sage"
                />
              </div>

              {/* Height */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-bold text-bark-light/60 uppercase tracking-widest">Height (cm)</label>
                  <span className="font-display font-bold text-bark">{height}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="220"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full h-2 bg-clay rounded-full appearance-none cursor-pointer accent-peach"
                />
              </div>

              {/* Gender */}
              <div className="flex gap-3">
                {(["male", "female", "other"] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={`flex-1 py-3 rounded-xl border-2 transition-all ${
                      gender === g
                        ? "border-coral bg-coral/10 text-coral font-bold"
                        : "border-clay/30 bg-white text-bark-light/60 hover:bg-sand"
                    }`}
                  >
                     <span className="capitalize text-sm">{g}</span>
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleSave}
              disabled={loading}
              className="w-full mt-8 h-12 rounded-xl bg-bark text-white font-bold shadow-lg shadow-bark/20 hover:bg-bark-light"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
