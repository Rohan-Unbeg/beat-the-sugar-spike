"use client";

import { useStore } from "@/lib/store";
import { signInWithGoogle, signOut } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LogOut, Shield, Flame, Trophy, Calendar, Loader2, ChevronRight, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/navigation/BottomNav";
import Toast from "@/components/feedback/Toast";
import Image from "next/image";
import EditProfileModal from "@/components/profile/EditProfileModal";
import SettingsModal from "@/components/profile/SettingsModal";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const { user, logs, showToast, syncToFirestore, setUser, resetStore, isLoading } = useStore();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  // ROUTE GUARD: Redirect if not onboarded
  useEffect(() => {
    if (!isSigningOut && mounted && !isLoading && !user.isOnboarded) {
       router.replace("/onboarding");
    }
  }, [mounted, isLoading, user.isOnboarded, router, isSigningOut]);

  // Prevent flicker: If still loading, show loading state
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-warm-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-coral" />
          <p className="text-sm font-medium text-bark-light/60">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user.isOnboarded) return null;

  const level = Math.floor(user.score / 50) + 1;
  const isSignedIn = !!user.uid;

  const handleGoogleSignIn = async () => {
    console.log("[Profile] Sign-in button CLICKED");
    setLoading(true);
    const result = await signInWithGoogle();
    console.log("[Profile] Sign-in result:", result);
    setLoading(false);
    if (result.success) {
      showToast("🎉 Signed in successfully!");
    } else if (result.error) {
      showToast(`❌ ${result.error}`);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
    
    // Explicitly reset ALL state to defaults
    resetStore();
    
    showToast("👋 Data cleared");
    router.push("/"); // Send to Landing Page
  };

  const stats = [
    { label: "Level", value: level, icon: Shield, color: "text-coral", bg: "bg-rose-50" },
    { label: "XP", value: user.score, icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-50" },
    { label: "Streak", value: `${user.streak}d`, icon: Flame, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Total Logs", value: logs.length, icon: Calendar, color: "text-blue-500", bg: "bg-blue-50" },
  ];

  return (
    <div className="min-h-screen bg-warm-white pb-32 text-bark relative">
      <Toast />
      
      {/* Header */}
      <header className="fixed top-0 right-0 p-6 z-50">
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 rounded-full bg-white/50 backdrop-blur-sm border border-clay/30 text-bark-light hover:bg-white transition-colors cursor-pointer active:scale-95"
        >
          <Settings className="w-5 h-5" />
        </button>
      </header>

      <main className="max-w-md mx-auto px-6 pt-24 space-y-8">
        {/* Profile Card */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full p-1 bg-white border border-clay shadow-xl">
               {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="w-full h-full rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-sand flex items-center justify-center">
                  <span className="font-display font-black text-3xl text-bark">
                    {user.displayName ? user.displayName[0].toUpperCase() : "?"}
                  </span>
                </div>
              )}
            </div>
            {isSignedIn && (
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-warm-white flex items-center justify-center">
                 <div className="w-3 h-3 bg-white rounded-full" />
              </div>
            )}
          </div>

          <div className="font-display text-2xl font-black text-bark mb-1">
            {!user.displayName ? <Skeleton className="h-8 w-48 mx-auto" /> : (user.displayName || "Anonymous User")}
          </div>
          <div className="text-sm text-bark-light/60 font-medium h-5">
             {!user.uid ? <Skeleton className="h-4 w-32 mx-auto" /> : (isSignedIn ? user.email : "Sign in to sync your data")}
          </div>

          {!isSignedIn && (
            <Button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="mt-6 bg-bark text-white rounded-xl px-6 py-2.5 h-auto shadow-lg shadow-bark/20 hover:bg-bark-light transition-all active:scale-95 cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : "Connect Google Account"}
            </Button>
          )}
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-4 gap-3">
          {stats.map(({ label, value, icon: Icon, color, bg }) => (
            <motion.div
              key={label}
              whileHover={{ y: -2 }}
              className="p-3 rounded-2xl bg-white border border-clay/30 shadow-sm flex flex-col items-center justify-center gap-2 cursor-default"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${bg}`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <div className="text-center">
                <span className="block font-bold text-lg text-bark leading-none mb-0.5">{value}</span>
                <span className="text-[10px] text-bark-light/50 font-bold uppercase tracking-wide">{label}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Body Stats */}
        <div className="bg-white rounded-3xl p-6 border border-clay/30 shadow-sm space-y-4">
          <div className="flex items-center justify-between mb-2">
             <h3 className="font-display font-bold text-bark text-lg">Body Stats</h3>
             <button 
               onClick={() => setIsEditOpen(true)}
               className="text-xs font-bold text-coral hover:text-coral-dark transition-colors cursor-pointer"
             >
               Edit
             </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ProfileRow label="Age" value={`${user.age || '--'} yrs`} />
            <ProfileRow label="Weight" value={`${user.weight || '--'} kg`} />
            <ProfileRow label="Height" value={`${user.height || '--'} cm`} />
            <ProfileRow label="Gender" value={user.gender || '--'} capitalize />
          </div>
        </div>

        {/* Settings / Menu */}
        <div className="bg-white rounded-3xl overflow-hidden border border-clay/30 shadow-sm">
           <div onClick={() => setIsSettingsOpen(true)}>
             <MenuItem label="Daily Sugar Limit" value="50g" />
           </div>
           
           <MenuItem label="App Version" value="v1.0.0" showArrow={false} />
           
           <MenuItem label="Data Storage" value={isSignedIn ? "Cloud Sync" : "Local Device"} showArrow={false} />
           
           {/* Show Sign Out only for real accounts. For Anon, show "Reset Data" or nothing */}
           {user.email ? (
             <button 
               onClick={handleSignOut}
               className="w-full p-4 flex items-center justify-center gap-2 text-rose-500 font-bold text-sm bg-rose-50/50 hover:bg-rose-50 transition-colors cursor-pointer"
             >
               <LogOut className="w-4 h-4" />
               Sign Out
             </button>
           ) : (
             <div className="p-4 bg-sand/30 text-center">
               <p className="text-[10px] text-bark-light/50 font-bold uppercase tracking-widest mb-2">Danger Zone</p>
               <button 
                 onClick={() => {
                   if (confirm("This will delete your current progress properly. Are you sure?")) {
                      handleSignOut();
                   }
                 }}
                 className="text-xs text-rose-400 font-bold hover:text-rose-600 transition-colors cursor-pointer"
               >
                 Reset / Clear Data
               </button>
             </div>
           )}
        </div>
      </main>

      <EditProfileModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      
      <BottomNav />
    </div>
  );
}

function ProfileRow({ label, value, capitalize }: { label: string; value: string; capitalize?: boolean }) {
  return (
    <div className="p-3 rounded-2xl bg-sand/30">
      <span className="block text-[10px] font-bold text-bark-light/40 uppercase tracking-widest mb-1">{label}</span>
      <span className={`block font-bold text-bark text-base ${capitalize ? "capitalize" : ""}`}>{value}</span>
    </div>
  );
}

function MenuItem({ label, value, showArrow = true }: { label: string; value: string; showArrow?: boolean }) {
  return (
    <div className="p-4 flex items-center justify-between border-b border-clay/20 last:border-0 hover:bg-sand/20 transition-colors cursor-pointer">
      <span className="font-medium text-sm text-bark">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm text-bark-light/50 font-medium">{value}</span>
        {showArrow && <ChevronRight className="w-4 h-4 text-bark-light/30" />}
      </div>
    </div>
  );
}
