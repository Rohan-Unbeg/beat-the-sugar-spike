import { motion } from 'framer-motion';
import { PlusCircle, Activity, HeartPulse, Trophy } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-zinc-950">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Overview Dashboard</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Monitor your metabolic health and daily stats.</p>
        </div>
        <Link href="/log" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg flex items-center transition-all shadow-sm">
          <PlusCircle size={18} className="mr-2" /> 
          Log Sugar
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Stat Cards */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <h3 className="font-semibold text-zinc-700 dark:text-zinc-300">Daily Average</h3>
            <Activity className="text-blue-500" size={20} />
          </div>
          <div className="pt-4">
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">92 <span className="text-lg font-normal text-zinc-500">mg/dL</span></p>
            <p className="text-sm text-emerald-500 mt-1 flex items-center">↓ 4% from last week</p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <h3 className="font-semibold text-zinc-700 dark:text-zinc-300">Time in Range</h3>
            <HeartPulse className="text-emerald-500" size={20} />
          </div>
          <div className="pt-4">
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">88<span className="text-lg font-normal text-zinc-500">%</span></p>
            <p className="text-sm text-zinc-500 mt-1 flex items-center">Target: &gt;70%</p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <h3 className="font-semibold text-zinc-700 dark:text-zinc-300">Current Streak</h3>
            <Trophy className="text-amber-500" size={20} />
          </div>
          <div className="pt-4">
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">14 <span className="text-lg font-normal text-zinc-500">Days</span></p>
            <p className="text-sm text-zinc-500 mt-1 flex items-center">Keep it up!</p>
          </div>
        </div>
      </div>
      
      {/* Chart Section Placeholder */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex-1 min-h-[300px] flex flex-col">
         <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4">Glucose Trends</h3>
         <div className="flex-1 flex items-center justify-center bg-zinc-50 dark:bg-zinc-950/50 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-400">Chart rendering synchronized...</p>
         </div>
      </div>
    </div>
  );
}