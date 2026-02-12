"use client";

import { useStore } from "@/lib/store";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, AlertTriangle } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: Props) {
  const { user, setUser, showToast } = useStore();
  const [limit, setLimit] = useState(50); 
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleClearData = () => {
    localStorage.clear();
    window.location.reload();
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

            <h2 className="font-display text-2xl font-bold text-bark mb-6">Settings</h2>

            {!confirmDelete ? (
              <div className="space-y-6">
                
                {/* Daily Limit Slider */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-bold text-bark uppercase tracking-widest">Sugar Limit</label>
                    <span className="font-display font-bold text-bark">{limit}g</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    step="5"
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                    className="w-full h-2 bg-clay rounded-full appearance-none cursor-pointer accent-coral"
                  />
                  <p className="text-[10px] text-bark-light/50 mt-2">
                    50g represents about 12 teaspoons of sugar.
                  </p>
                </div>

                {/* Danger Zone */}
                <div className="pt-6 border-t border-dashed border-clay/30">
                  <h3 className="font-bold text-bark text-sm mb-3">Data Management</h3>
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="w-full py-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-500 font-bold text-sm hover:bg-rose-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Reset All Progress
                  </button>
                </div>

                <div className="text-center pt-2">
                  <span className="text-[10px] text-bark-light/30 font-bold uppercase tracking-widest">Version 1.0.0 (Hackathon)</span>
                </div>
              </div>
            ) : (
              // Confirmation View
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4 text-rose-500">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h3 className="font-display font-bold text-xl text-bark mb-2">Are you sure?</h3>
                <p className="text-sm text-bark-light/70 mb-8 leading-relaxed">
                  This will permanently delete your stats, logs, and streak. This cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="flex-1 py-3 rounded-xl bg-sand/50 text-bark font-bold text-sm hover:bg-sand transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClearData}
                    className="flex-1 py-3 rounded-xl bg-rose-500 text-white font-bold text-sm hover:bg-rose-600 shadow-lg shadow-rose-500/20 transition-colors"
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
