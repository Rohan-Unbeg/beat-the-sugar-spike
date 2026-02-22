'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate authentication API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      if (!email.includes('@')) {
        throw new Error("Please enter a valid email address");
      }
      
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || "Failed to authenticate");
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl w-full max-w-md border border-zinc-100 dark:border-zinc-800">
        
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <User size={32} />
          </div>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
            {isSigningIn ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-center">
            {isSigningIn 
              ? 'Enter your credentials to access your dashboard' 
              : 'Sign up to start tracking your metabolic health'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              required
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <motion.div 
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: 'auto' }}
               className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm flex items-center gap-2"
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isSigningIn ? (
               <><LogIn size={18} /> Sign In</>
            ) : (
               <><UserPlus size={18} /> Sign Up</>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-zinc-100 dark:border-zinc-800 pt-6">
          <p className="text-zinc-600 dark:text-zinc-400">
            {isSigningIn ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              disabled={isLoading}
              onClick={() => setIsSigningIn(!isSigningIn)}
              className="text-blue-600 font-medium hover:underline focus:outline-none"
            >
              {isSigningIn ? 'Create one' : 'Sign in instead'}
            </button>
          </p>
        </div>
      </div>
    </motion.div>
  );
}