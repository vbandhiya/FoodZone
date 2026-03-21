import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettingsStore = create(
  persist(
    (set) => ({
      theme: 'light', // 'light' | 'dark'
      notifications: true,
      userName: '',
      userPhone: '',
      
      setTheme: (theme) => set({ theme }),
      toggleNotifications: () => set((state) => ({ notifications: !state.notifications })),
      setUserInfo: (name, phone) => set({ userName: name, userPhone: phone }),
    }),
    {
      name: 'foodzone-settings-v2', // Changed name to reset old state if needed
    }
  )
);
