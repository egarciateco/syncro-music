import { create } from 'zustand';
import { getAdminConfig, saveAdminConfig, AdminConfig } from '../services/storageService';

type AdminState = {
  config: AdminConfig;
  isLoaded: boolean;

  // Actions
  loadConfig: () => Promise<void>;
  updateConfig: (updates: Partial<AdminConfig>) => Promise<void>;
};

export const useAdminStore = create<AdminState>((set, get) => ({
  config: {
    premiumPrice: '2.99',
    paymentUrl: 'https://www.mercadopago.com.ar',
    preferenceId: '2993211976-7e998a4f-4658-41bb-94d0-4340e2d43561',
    appDescription: 'Syncro Music Premium',
  },
  isLoaded: false,

  loadConfig: async () => {
    const config = await getAdminConfig();
    set({ config, isLoaded: true });
  },

  updateConfig: async (updates) => {
    const newConfig = { ...get().config, ...updates };
    await saveAdminConfig(newConfig);
    set({ config: newConfig });
  },
}));
