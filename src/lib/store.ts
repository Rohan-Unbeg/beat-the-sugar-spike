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
}

interface SugarLog {
  id: string;
  type: string;
  timestamp: string;
  amount: number; // estimated grams
}

interface AppState {
  user: UserProfile;
  logs: SugarLog[];
  setUser: (data: Partial<UserProfile>) => void;
  addLog: (log: Omit<SugarLog, 'id'>) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  addScore: (points: number) => void;
  completeOnboarding: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: {
        age: null,
        weight: null,
        height: null,
        gender: null,
        isOnboarded: false,
        streak: 0,
        score: 0,
      },
      logs: [],
      setUser: (data) =>
        set((state) => ({ user: { ...state.user, ...data } })),
      completeOnboarding: () =>
        set((state) => ({ user: { ...state.user, isOnboarded: true } })),
      addLog: (log) =>
        set((state) => ({
          logs: [
            ...state.logs,
            { ...log, id: Math.random().toString(36).substr(2, 9) },
          ],
        })),
        incrementStreak: () =>
          set((state) => ({ user: { ...state.user, streak: state.user.streak + 1 } })),
        resetStreak: () =>
          set((state) => ({ user: { ...state.user, streak: 0 } })),
        addScore: (points) =>
          set((state) => ({ user: { ...state.user, score: state.user.score + points } })),
    }),
    {
      name: 'beat-the-sugar-spike-storage',
    }
  )
);
