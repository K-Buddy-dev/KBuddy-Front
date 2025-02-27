import { create } from 'zustand';

interface TabsStore {
  activeTab: number;
  setActiveTab: (number: number) => void;
}

export const useTabsStore = create<TabsStore>((set) => ({
  activeTab: 1,
  setActiveTab: (number) => set({ activeTab: number }),
}));
