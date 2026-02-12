"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2, Plus, Sparkles, ScanLine, Mic } from "lucide-react";
import { useStore } from "@/lib/store";
import { parseFoodWithAI, AIParsedFood } from "@/lib/food-ai";
import { audio } from "@/lib/audio";
import { cn } from "@/lib/utils";

interface FoodSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FoodSearchModal({ isOpen, onClose }: FoodSearchModalProps) {
  const { addLog, addScore, showToast } = useStore();
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<AIParsedFood | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResult(null);
    }
  }, [isOpen]);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    audio.playClick();
    setResult(null);

    // AI CALL
    const data = await parseFoodWithAI(query);
    
    if (data) {
      setResult(data);
      audio.playSuccess();
    } else {
      showToast("❌ Couldn't analyze that food. Try simpler terms.");
      audio.playError();
    }
    
    setIsSearching(false);
  };

  const handleLogFood = () => {
    if (!result) return;
    
    addLog({
      type: "custom",
      label: result.name,
      timestamp: new Date().toISOString(),
      amount: result.sugar,
    });
    
    addScore(5); // Standard logging score
    audio.playSuccess();
    showToast(`✅ Logged: ${result.name} (${result.sugar}g)`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-bark/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            className="fixed inset-x-4 top-24 bottom-auto max-w-md mx-auto z-50"
          >
            <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-white/20">
              
              {/* Header / Search Bar */}
              <div className="p-4 bg-sand/30 border-b border-clay/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-coral/10 p-2 rounded-xl">
                      <Sparkles className="w-5 h-5 text-coral" />
                    </div>
                    <div>
                        <h2 className="font-display font-bold text-lg text-bark">AI Food Lens</h2>
                        <p className="text-[10px] uppercase font-bold text-bark-light/40 tracking-wider">Powered by Llama 3</p>
                    </div>
                  </div>
                  <button 
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-black/5 transition-colors"
                  >
                    <X className="w-5 h-5 text-bark-light" />
                  </button>
                </div>

                <form onSubmit={handleSearch} className="relative group">
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. 'Cheese cake slice' or 'Mango Lassi'"
                    className="w-full h-14 pl-12 pr-12 rounded-2xl bg-white border border-clay/20 text-bark font-bold text-lg placeholder:text-bark-light/30 focus:outline-none focus:ring-4 focus:ring-coral/20 transition-all shadow-inner"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-bark-light/50" />
                  
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      className="absolute right-14 top-1/2 -translate-y-1/2 p-1 rounded-full bg-sand hover:bg-clay/20 text-bark-light"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={!query.trim() || isSearching}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-coral text-white disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all shadow-lg shadow-coral/30"
                  >
                    {isSearching ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <ScanLine className="w-5 h-5" />
                    )}
                  </button>
                </form>
              </div>

              {/* Content Area */}
              <div className="p-6 min-h-[200px] flex flex-col items-center justify-center text-center">
                
                {!result && !isSearching && (
                   <div className="space-y-4 opacity-40">
                      <div className="w-16 h-16 rounded-full bg-sand mx-auto flex items-center justify-center">
                         <Search className="w-8 h-8 text-bark" />
                      </div>
                      <p className="text-sm font-medium text-bark max-w-[200px] mx-auto">
                        Describe what you ate, and our AI will estimate the sugar content.
                      </p>
                   </div>
                )}

                {isSearching && (
                  <div className="space-y-4 animate-pulse">
                    <div className="w-20 h-20 rounded-2xl bg-sand/50 mx-auto" />
                    <div className="h-4 w-32 bg-sand/50 rounded-full mx-auto" />
                    <div className="h-3 w-48 bg-sand/30 rounded-full mx-auto" />
                    <p className="text-xs font-black uppercase tracking-widest text-coral animate-bounce mt-4">Analyzing...</p>
                  </div>
                )}

                {result && !isSearching && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full"
                  >
                    <div className="bg-warm-white p-6 rounded-3xl border border-clay/10 shadow-sm relative overflow-hidden mb-6">
                       <div className="absolute top-0 right-0 p-4 opacity-5">
                          <ScanLine className="w-32 h-32" />
                       </div>
                       
                       <div className="text-6xl mb-4 drop-shadow-sm">{result.icon}</div>
                       <h3 className="font-display font-black text-2xl text-bark mb-1">{result.name}</h3>
                       <div className="inline-block px-3 py-1 rounded-full bg-sand/50 text-[10px] font-bold text-bark-light/60 uppercase tracking-widest mb-6">
                         {result.category}
                       </div>

                       <div className="flex items-center justify-center gap-2 mb-2">
                          <span className="text-5xl font-black text-coral tabular-nums tracking-tighter">{result.sugar}</span>
                          <span className="text-lg font-bold text-bark-light/40 mt-3">g</span>
                       </div>
                       <p className="text-xs font-bold uppercase text-bark-light/40 tracking-widest">Sugar Estim.</p>
                    </div>

                    <button
                      onClick={handleLogFood}
                      className="w-full py-4 rounded-2xl bg-bark text-white font-black text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
                    >
                      <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                      Log This Item
                    </button>
                  </motion.div>
                )}

              </div>
              
              {/* Footer */}
              <div className="p-3 bg-sand/20 border-t border-clay/5 text-center">
                 <p className="text-[10px] text-bark-light/40 font-medium">
                   AI estimates may vary. Always check nutrition labels.
                 </p>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
