import { create } from 'zustand';
import { getIsPremium, setIsPremium } from '../services/storageService';

type UserState = {
  isPremium: boolean;
  isAdmin: boolean;
  isLoggedIn: boolean;
  hasSeenSplash: boolean;
  
  // Actions
  loadUserState: () => Promise<void>;
  activatePremium: () => Promise<void>;
  setAdmin: (value: boolean) => void;
  setHasSeenSplash: (value: boolean) => void;
};

export const useUserStore = create<UserState>((set) => ({
  isPremium: false,
  isAdmin: false,
  isLoggedIn: false,
  hasSeenSplash: false,

  loadUserState: async () => {
    const isPremium = await getIsPremium();
    set({ isPremium, isLoggedIn: true });
  },

  activatePremium: async () => {
    await setIsPremium(true);
    set({ isPremium: true });
  },

  setAdmin: (value) => set({ isAdmin: value }),

  setHasSeenSplash: (value) => set({ hasSeenSplash: value }),
}));
