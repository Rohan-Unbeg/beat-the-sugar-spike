import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Gender = 'male' | 'female' | 'other' | null;

interface UserProfile {
  age: number | null;
  weight: number | null; // in kg
  height: number | null; // in cm
  gender: Gender;
  isOnboarded: boolean;
  streak: number;
  score: number;
  lastLogDate: string | null; // ISO date string for streak tracking
}

interface SugarLog {
  id: string;
  type: string;
  label: string;
  timestamp: string;
  amount: number; // estimated grams
}

interface AppState {
  user: UserProfile;
  logs: SugarLog[];
  toastMessage: string | null;
  setUser: (data: Partial<UserProfile>) => void;
  addLog: (log: Omit<SugarLog, 'id'>) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  addScore: (points: number) => void;
  completeOnboarding: () => void;
  showToast: (message: string) => void;
  clearToast: () => void;
  getTodaysLogs: () => SugarLog[];
}

const getDateStr = (d: Date) => d.toISOString().split('T')[0];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: {
        age: null,
        weight: null,
        height: null,
        gender: null,
        isOnboarded: false,
        streak: 0,
        score: 0,
        lastLogDate: null,
      },
      logs: [],
      toastMessage: null,
      setUser: (data) =>
        set((state) => ({ user: { ...state.user, ...data } })),
      completeOnboarding: () =>
        set((state) => ({ user: { ...state.user, isOnboarded: true } })),
      addLog: (log) =>
        set((state) => {
          const today = getDateStr(new Date());
          const lastLog = state.user.lastLogDate;
          let newStreak = state.user.streak;

          // Streak logic: first log of the day increments streak
          if (lastLog !== today) {
            const yesterday = getDateStr(new Date(Date.now() - 86400000));
            if (lastLog === yesterday || lastLog === null) {
              newStreak += 1; // Continuing the streak or first ever log
            } else {
              newStreak = 1; // Missed a day, reset to 1
            }
          }

          return {
            logs: [
              ...state.logs,
              { ...log, id: Math.random().toString(36).substr(2, 9) },
            ],
            user: {
              ...state.user,
              lastLogDate: today,
              streak: newStreak,
            },
          };
        }),
      incrementStreak: () =>
        set((state) => ({ user: { ...state.user, streak: state.user.streak + 1 } })),
      resetStreak: () =>
        set((state) => ({ user: { ...state.user, streak: 0 } })),
      addScore: (points) =>
        set((state) => ({ user: { ...state.user, score: state.user.score + points } })),
      showToast: (message) => set({ toastMessage: message }),
      clearToast: () => set({ toastMessage: null }),
      getTodaysLogs: () => {
        const today = new Date().toDateString();
        return get().logs.filter(log => new Date(log.timestamp).toDateString() === today);
      },
    }),
    {
      name: 'beat-the-sugar-spike-storage',
      partialize: (state) => ({
        user: state.user,
        logs: state.logs,
      }),
    }
  )
);
