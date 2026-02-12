"use client";

import { Home, BarChart3, Trophy, User } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navItems = [
  { icon: Home, label: "Home", path: "/dashboard" },
  { icon: BarChart3, label: "Stats", path: "/stats" },
  { icon: Trophy, label: "Rewards", path: "/rewards" },
  { icon: User, label: "Profile", path: "/profile" },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-6 left-0 right-0 z-50 px-6 pointer-events-none">
      <div className="max-w-md mx-auto bg-white/90 backdrop-blur-xl border border-white/20 shadow-xl shadow-bark/5 rounded-full px-2 py-2 flex items-center justify-between pointer-events-auto">
        {navItems.map(({ icon: Icon, label, path }) => {
          const active = pathname === path;
          return (
            <button
              key={path}
              onClick={() => router.push(path)}
              className={`relative flex flex-1 flex-col items-center justify-center gap-1 h-12 rounded-full transition-all duration-300 cursor-pointer ${
                active ? "text-coral" : "text-bark-light/40 hover:text-bark-light/70"
              }`}
            >
              {active && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-coral/10 rounded-full -z-10"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className={`w-5 h-5 ${active ? "fill-coral/20" : ""}`} />
              {active && (
                 <motion.span 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-[10px] font-bold"
                 >
                   {label}
                 </motion.span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
