"use client";

import { useStore } from "@/lib/store";
import { motion } from "framer-motion";
import { Trophy, Medal, Crown, TrendingUp, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const MOCK_LEADERBOARD = [
  { id: "u1", name: "Sarah K.", score: 850, avatar: "bg-emerald-100", trend: "up" },
  { id: "u2", name: "Mike R.", score: 720, avatar: "bg-blue-100", trend: "same" },
  { id: "u3", name: "Jessica T.", score: 690, avatar: "bg-purple-100", trend: "up" },
  { id: "u4", name: "David L.", score: 610, avatar: "bg-orange-100", trend: "down" },
  { id: "u5", name: "Alex P.", score: 580, avatar: "bg-indigo-100", trend: "up" },
];

interface LeaderboardUser {
  id: string;
  name: string;
  score: number;
  avatar: string;
  trend: string;
  isMe?: boolean;
}

export default function Leaderboard() {
  const { user } = useStore();

  const getRankIcon = (index: number) => {
    switch(index) {
      case 0: return <Crown className="w-5 h-5 text-yellow-500 fill-yellow-500" />;
      case 1: return <Medal className="w-5 h-5 text-gray-400 fill-gray-400" />;
      case 2: return <Medal className="w-5 h-5 text-amber-700 fill-amber-700" />;
      default: return <span className="text-sm font-bold text-bark-light/50">#{index + 1}</span>;
    }
  };

  // Case 1: Guest User (Limited View)
  if (user.isAnonymous) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2 text-bark-light/40">
          <h3 className="font-display text-lg font-bold flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Global League
          </h3>
          <span className="text-[10px] font-black uppercase tracking-widest bg-clay/10 px-2 py-1 rounded-md">Locked</span>
        </div>

        <div className="bg-white rounded-[2rem] border border-clay/20 shadow-sm overflow-hidden relative group">
          <div className="absolute inset-0 z-20 bg-white/40 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-bark flex items-center justify-center mb-4 shadow-xl">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-display font-bold text-bark text-xl mb-1">Join the League</h4>
            <p className="text-sm text-bark-light/60 font-medium mb-6 max-w-[200px]">Compare your progress with 2,400+ health warriors.</p>
            <button 
              onClick={() => {
                  import("@/lib/auth").then(({ signInWithGoogle }) => {
                    signInWithGoogle().then(res => {
                        if(res.success) window.location.reload();
                    });
                  });
              }}
              className="px-6 py-3 bg-coral text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
            >
              Connect Now <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-clay/5 grayscale opacity-30 select-none">
            {MOCK_LEADERBOARD.slice(0, 3).map((u, idx) => (
              <div key={u.id} className="p-4 flex items-center gap-4">
                <div className="w-8 flex justify-center shrink-0">
                  {getRankIcon(idx)}
                </div>
                <div className={cn("w-10 h-10 rounded-full bg-clay/10 shrink-0")} />
                <div className="flex-1">
                   <div className="h-4 w-24 bg-clay/10 rounded mb-1" />
                   <div className="h-3 w-12 bg-clay/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Case 2: Authenticated User (Full Access)
  const userEntry: LeaderboardUser = {
    id: user.uid || "me",
    name: user.displayName || "You",
    score: user.score,
    avatar: "bg-coral/20",
    isMe: true,
    trend: "up"
  };

  const allUsers: LeaderboardUser[] = [...MOCK_LEADERBOARD, userEntry].sort((a, b) => b.score - a.score);
  const displayUsers = allUsers.slice(0, 5);
  if (!displayUsers.find(u => u.isMe)) {
     displayUsers[4] = userEntry;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="font-display text-lg font-bold text-bark flex items-center gap-2">
          <Trophy className="w-5 h-5 text-coral" />
          Community Top 5
        </h3>
        <span className="text-xs font-bold text-coral bg-coral/10 px-2 py-1 rounded-full">
           Global League
        </span>
      </div>

      <div className="bg-white rounded-[2rem] border border-clay/20 shadow-sm overflow-hidden relative">
         <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-200/20 to-transparent rounded-bl-[4rem]" />
         
         <div className="divide-y divide-clay/10">
           {displayUsers.map((u, idx) => (
             <motion.div
               key={u.id}
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: idx * 0.1 }}
               className={`p-4 flex items-center gap-4 ${u.isMe ? 'bg-sand/30' : ''}`}
             >
               <div className="w-8 flex justify-center shrink-0">
                 {getRankIcon(idx)}
               </div>
               
               <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-bark/60 ${u.avatar} shrink-0 border-2 border-white shadow-sm`}>
                 {u.name[0]}
               </div>
               
               <div className="flex-1 min-w-0">
                 <h4 className={`text-sm font-bold truncate ${u.isMe ? 'text-coral' : 'text-bark'}`}>
                   {u.name} {u.isMe && "(You)"}
                 </h4>
                 <div className="flex items-center gap-1">
                   <span className="text-xs font-medium text-bark-light/60">{u.score} XP</span>
                   {u.trend === 'up' && <TrendingUp className="w-3 h-3 text-emerald-500" />}
                 </div>
               </div>
             </motion.div>
           ))}
         </div>
         
         <div className="p-3 bg-sand/20 text-center">
            <p className="text-[10px] font-bold text-bark-light/40 uppercase tracking-widest">
              Update: Live
            </p>
         </div>
      </div>
    </div>
  );
}
