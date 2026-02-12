"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2, Plus, Sparkles, Mic, ChevronRight } from "lucide-react";
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
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResult(null);
    }
  }, [isOpen]);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showToast("❌ Voice not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      audio.playClick();
    };

    recognition.onend = () => setIsListening(false);

    recognition.onerror = (event: any) => {
      console.error("Speech error", event.error);
      setIsListening(false);
      showToast("❌ Voice error: " + event.error);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      handleSearch(undefined, transcript);
    };

    try {
      recognition.start();
    } catch (err) {
      console.error("Microphone access error", err);
      showToast("❌ Microphone access denied or blocked");
    }
  };

  const handleSearch = async (e?: React.FormEvent, overrideQuery?: string) => {
    e?.preventDefault();
    const textToSearch = overrideQuery || query;
    if (!textToSearch.trim()) return;

    setIsSearching(true);
    if (!overrideQuery) audio.playClick();
    setResult(null);

    const data = await parseFoodWithAI(textToSearch);
    
    if (data) {
      setResult(data);
      audio.playSuccess();
    } else {
      showToast("❌ Couldn't analyze that. Try '1 apple' or 'Burger'.");
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
    
    addScore(5); 
    audio.playSuccess();
    showToast(`✅ Logged: ${result.name} (${result.sugar}g)`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-bark/60 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            className="fixed inset-x-4 top-20 bottom-auto max-w-sm mx-auto z-50"
          >
            <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-white/20">
              
              {/* Compact Header */}
              <div className="p-3 bg-sand/30 border-b border-clay/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-coral/10 p-1.5 rounded-lg">
                      <Sparkles className="w-4 h-4 text-coral" />
                    </div>
                    <div>
                        <h2 className="font-display font-bold text-base text-bark">AI Food Lens</h2>
                        <p className="text-[9px] uppercase font-bold text-bark-light/40 tracking-wider">Powered by Groq Llama 3</p>
                    </div>
                  </div>
                  <button 
                    onClick={onClose}
                    className="p-1.5 rounded-full hover:bg-black/5 transition-colors"
                  >
                    <X className="w-4 h-4 text-bark-light" />
                  </button>
                </div>

                <div className="relative group">
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                    placeholder="e.g. 'Cheese cake'"
                    className="w-full h-12 pl-10 pr-20 rounded-xl bg-white border border-clay/20 text-bark font-bold text-base placeholder:text-bark-light/30 focus:outline-none focus:ring-4 focus:ring-coral/20 transition-all shadow-inner"
                  />
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-bark-light/50" />
                  
                  <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {query.length === 0 && (
                      <button
                        type="button"
                        onClick={startListening}
                        className={cn(
                          "p-2 rounded-lg transition-all",
                          isListening ? "bg-red-500 text-white animate-pulse" : "bg-sand hover:bg-clay/20 text-bark-light"
                        )}
                      >
                        <Mic className="w-4 h-4" />
                      </button>
                    )}

                    {query.length > 0 && (
                       <button
                         onClick={handleSearch}
                         disabled={isSearching}
                         className="p-2 rounded-lg bg-coral text-white disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all shadow-lg shadow-coral/30"
                       >
                         {isSearching ? (
                           <Loader2 className="w-4 h-4 animate-spin" />
                         ) : (
                           <ChevronRight className="w-4 h-4" />
                         )}
                       </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Compact Content Area */}
              <div className="p-4 min-h-[160px] flex flex-col items-center justify-center text-center">
                
                {!result && !isSearching && (
                   <div className="space-y-3 opacity-40">
                      <div className="w-12 h-12 rounded-full bg-sand mx-auto flex items-center justify-center">
                         {isListening ? <Mic className="w-6 h-6 text-coral animate-bounce" /> : <Search className="w-6 h-6 text-bark" />}
                      </div>
                      <p className="text-xs font-medium text-bark max-w-[180px] mx-auto">
                        {isListening ? "Listening..." : "Type or speak to analyze food"}
                      </p>
                   </div>
                )}

                {isSearching && (
                  <div className="space-y-3 animate-pulse">
                    <div className="w-16 h-16 rounded-2xl bg-sand/50 mx-auto" />
                    <div className="h-3 w-24 bg-sand/50 rounded-full mx-auto" />
                    <div className="h-2 w-32 bg-sand/30 rounded-full mx-auto" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-coral animate-bounce mt-3">Analyzing...</p>
                  </div>
                )}

                {result && !isSearching && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full"
                  >
                    <div className="bg-warm-white p-4 rounded-2xl border border-clay/10 shadow-sm relative overflow-hidden mb-4">
                       <div className="absolute top-0 right-0 p-3 opacity-5">
                          <Sparkles className="w-24 h-24" />
                       </div>
                       
                       <div className="text-5xl mb-2 drop-shadow-sm">{result.icon}</div>
                       <h3 className="font-display font-black text-xl text-bark mb-1 line-clamp-1">{result.name}</h3>
                       <div className="inline-block px-2 py-0.5 rounded-full bg-sand/50 text-[9px] font-bold text-bark-light/60 uppercase tracking-widest mb-4">
                         {result.category}
                       </div>

                       <div className="flex items-center justify-center gap-1.5 mb-1">
                          <span className="text-4xl font-black text-coral tabular-nums tracking-tighter">{result.sugar}</span>
                          <span className="text-sm font-bold text-bark-light/40 mt-2">g</span>
                       </div>
                       <p className="text-[10px] font-bold uppercase text-bark-light/40 tracking-widest">Sugar Estim.</p>
                    </div>

                    <button
                      onClick={handleLogFood}
                      className="w-full py-3.5 rounded-xl bg-bark text-white font-black text-base shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                    >
                      <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                      Log This Item
                    </button>
                    
                    <button 
                       onClick={() => { setQuery(""); setResult(null); }}
                       className="mt-3 text-[10px] font-bold text-bark-light/50 hover:text-coral transition-colors"
                    >
                       Search something else
                    </button>
                  </motion.div>
                )}

              </div>
              
              {/* Compact Footer */}
              <div className="p-2 bg-sand/20 border-t border-clay/5 text-center">
                 <p className="text-[9px] text-bark-light/40 font-medium">
                   AI estimates may vary. Check labels.
                 </p>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
