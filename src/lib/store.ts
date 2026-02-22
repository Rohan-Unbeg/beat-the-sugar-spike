import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

import { generateAnonName } from './utils';
type Gender = 'male' | 'female' | 'other' | null;

interface UserProfile {
  age: number | null;
  weight: number | null; // in kg
  height: number | null; // in cm
  gender: Gender;
  isOnboarded: boolean;
  streak: number;
  score: number;
  lastSeenLevel?: number; // Track for modal
  lastLogDate: string | null;
  uid: string | null;
  displayName: string | null;
  photoURL: string | null;
  email: string | null;
  bmi: number | null;
  isAnonymous: boolean;
  isPassiveSyncEnabled: boolean;
  passiveData: {
    steps: number;
    heartRate: number;
    sleepHours: number;
  };
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
  isSyncing: boolean;
  isLoading: boolean;
  setUser: (data: Partial<UserProfile>) => void;
  addLog: (log: Omit<SugarLog, 'id'>) => void;
  removeLog: (id: string) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  addScore: (points: number) => void;
  completeOnboarding: () => void;
  togglePassiveSync: (enabled: boolean) => void;
  updatePassiveData: (data: Partial<AppState['user']['passiveData']>) => void;
  showToast: (message: string) => void;
  clearToast: () => void;
  getTodaysLogs: () => SugarLog[];
  syncToFirestore: () => Promise<void>;
  loadFromFirestore: (uid: string) => Promise<void>;
  validateStreak: () => void;
  resetStore: () => void;
}

const getDateStr = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

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
        lastSeenLevel: 1, // Default
        lastLogDate: null,
        uid: null,
        displayName: null,
        photoURL: null,
        email: null,
        bmi: null,
        isAnonymous: true,
        isPassiveSyncEnabled: false,
        passiveData: {
          steps: 0,
          heartRate: 72,
          sleepHours: 8,
        },
      },
      logs: [],
      toastMessage: null,
      isSyncing: false,
      isLoading: true,
      setUser: (data) =>
        set((state) => ({ user: { ...state.user, ...data } })),
      completeOnboarding: () =>
        set((state) => ({ user: { ...state.user, isOnboarded: true } })),
      togglePassiveSync: (enabled) =>
        set((state) => ({ user: { ...state.user, isPassiveSyncEnabled: enabled } })),
      updatePassiveData: (data) =>
        set((state) => ({
          user: {
            ...state.user,
            passiveData: { ...state.user.passiveData, ...data }
          }
        })),
      addLog: (log) =>
        set((state) => {
          // Validation: Ensure amount is valid
          if (log.amount <= 0) {
            console.warn("[Store] Ignoring log with zero or negative amount:", log.amount);
            return state;
          }

          const today = getDateStr(new Date());
          const lastLog = state.user.lastLogDate;
          let newStreak = state.user.streak;

          // Streak logic: first log of the day increments streak
          if (lastLog !== today) {
            const yesterday = getDateStr(new Date(Date.now() - 86400000));
            if (lastLog === yesterday || lastLog === null) {
              newStreak += 1;
            } else {
              newStreak = 1;
            }
          }

          const newState = {
            logs: [
              ...state.logs,
              { ...log, id: Math.random().toString(36).substring(2, 9) },
            ],
            user: {
              ...state.user,
              lastLogDate: today,
              streak: newStreak,
            },
          };

          // Fire-and-forget Firestore sync after state update
          setTimeout(() => get().syncToFirestore(), 100);

          return newState;
        }),
      removeLog: (id: string) =>
        set((state) => {
          const newState = {
            logs: state.logs.filter((log) => log.id !== id),
            user: { ...state.user, score: Math.max(0, state.user.score - 5) },
          };
          setTimeout(() => get().syncToFirestore(), 100);
          return newState;
        }),
      incrementStreak: () =>
        set((state) => ({ user: { ...state.user, streak: state.user.streak + 1 } })),
      resetStreak: () =>
        set((state) => ({ user: { ...state.user, streak: 0 } })),
      addScore: (points) => {
        const state = get();
        let totalPoints = points;

        // Bonus: Early Log (Before 6 PM)
        const hour = new Date().getHours();
        if (hour < 18) {
          totalPoints += 3;
        }

        // Bonus: High Activity (Steps > 5000)
        if (state.user.isPassiveSyncEnabled && (state.user.passiveData?.steps || 0) > 5000) {
          totalPoints += 5;
        }

        // VARIABLE REWARD: Random Luck Bonus (+1 to +3)
        const luckBonus = Math.floor(Math.random() * 3) + 1;
        totalPoints += luckBonus;

        set((state) => ({ user: { ...state.user, score: state.user.score + totalPoints } }));
        setTimeout(() => get().syncToFirestore(), 100);

        const bonusTotal = totalPoints - points;
        if (bonusTotal > 0) {
          get().showToast(`✨ +${bonusTotal} Bonus XP! (${luckBonus} Luck Bonus included)`);
        }
      },
      showToast: (message) => set({ toastMessage: message }),
      clearToast: () => set({ toastMessage: null }),
      getTodaysLogs: () => {
        const today = new Date().toDateString();
        return get().logs.filter(log => new Date(log.timestamp).toDateString() === today);
      },

      // ---- Firestore Sync ----
      syncToFirestore: async () => {
        const state = get();
        const uid = state.user.uid;
        if (!uid || state.isLoading) return;

        // Debounce/Race protection: If already syncing, we might want to let it finish or just set flag
        set({ isSyncing: true });
        try {
          await setDoc(doc(db, 'users', uid), {
            profile: {
              age: state.user.age,
              weight: state.user.weight,
              height: state.user.height,
              gender: state.user.gender,
              isOnboarded: state.user.isOnboarded,
              streak: state.user.streak,
              score: state.user.score,
              lastLogDate: state.user.lastLogDate,
              displayName: state.user.displayName,
              email: state.user.email,
              photoURL: state.user.photoURL,
              isAnonymous: state.user.isAnonymous, // Explicitly save this
              lastSeenLevel: state.user.lastSeenLevel || 1,
              isPassiveSyncEnabled: state.user.isPassiveSyncEnabled,
              passiveData: state.user.passiveData,
            },
            logs: state.logs,
            updatedAt: new Date().toISOString(),
          });
        } catch (err) {
          console.error('[Firestore] Sync failed:', err);
        } finally {
          // Immediately hide spinner, rely on UI transition for smoothness if needed
          set({ isSyncing: false });
        }
      },

      loadFromFirestore: async (uid: string) => {
        // Since we now have enableMultiTabIndexedDbPersistence,
        // getDoc will return from CACHE immediately if available.

        // OPTIMISTIC LOADING: If we already have a name in memory (from persist), 
        // don't show a skeleton. Use what we have while we verify with the cloud.
        if (get().user.displayName) {
          set({ isLoading: false });
        }

        try {
          const snap = await getDoc(doc(db, 'users', uid));
          if (snap.exists()) {
            const data = snap.data();
            const profile = data.profile || {};

            // Merge cloud data with local state
            // CRITICAL: Cloud takes priority for STATS (score, streak, logs)
            // But for IDENTITY (isAnonymous, email, photo, name), we must be careful
            // not to overwrite our shiny new Google session with an old "Anonymous" record from DB.
            const current = get().user;

            // If our current local state says we are NOT anonymous (e.g. just linked Google),
            // and the DB says we ARE anonymous (old data), ignore DB's identity fields.
            const trustLocalIdentity = !current.isAnonymous;

            set({
              user: {
                ...current,
                ...profile,
                // IDENTITY: Prioritize local if we are "more authenticated" than DB
                uid,
                displayName: trustLocalIdentity ? current.displayName : (profile.displayName || current.displayName),
                email: trustLocalIdentity ? current.email : (profile.email || current.email),
                photoURL: trustLocalIdentity ? current.photoURL : (profile.photoURL || current.photoURL),
                isAnonymous: trustLocalIdentity ? false : (profile.isAnonymous ?? current.isAnonymous),

                lastSeenLevel: profile.lastSeenLevel || 1,
              },
              logs: data.logs || [],
            });

            console.log('[Firestore] Synced user data for:', uid);
          } else {
            // New user: AuthProvider already generated a name for us.
            // Just ensure the UID is correct.
            set(state => ({ user: { ...state.user, uid } }));
            // Sync our newly generated local state to the cloud.
            setTimeout(() => get().syncToFirestore(), 1000);
          }
        } catch (err: any) {
          console.error('[Firestore] Load error (using local cache):', err);
          // With persistence, even if this fails, we likely have the local store data.
        } finally {
          set({ isLoading: false });
          // Ensure streak is valid on load
          get().validateStreak();
        }
      },
      validateStreak: () => {
        const state = get();
        const lastLog = state.user.lastLogDate;
        if (!lastLog || state.user.streak === 0) return;

        const today = getDateStr(new Date());
        const yesterday = getDateStr(new Date(Date.now() - 86400000));

        // If last log was before yesterday, streak is broken
        if (lastLog !== today && lastLog !== yesterday) {
          console.log("[Store] Streak broken! Last log was:", lastLog);
          set((state) => ({ user: { ...state.user, streak: 0 } }));
          setTimeout(() => get().syncToFirestore(), 100);
        }
      },
      resetStore: () => {
        set({
          user: {
            age: null,
            weight: null,
            height: null,
            gender: null,
            isOnboarded: false,
            streak: 0,
            score: 0,
            lastSeenLevel: 1,
            lastLogDate: null,
            uid: null,
            displayName: null,
            photoURL: null,
            email: null,
            bmi: null,
            isAnonymous: true,
            isPassiveSyncEnabled: false,
            passiveData: {
              steps: 0,
              heartRate: 72,
              sleepHours: 8,
            },
          },
          logs: [],
          toastMessage: null,
          isSyncing: false,
          isLoading: false
        });
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

