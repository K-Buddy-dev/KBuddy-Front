import { create } from 'zustand';

interface TabsStore {
  activeTab: number;
  setActiveTab: (number: number) => void;
}

const useTabsStore = create<TabsStore>((set) => ({
  activeTab: 1,
  setActiveTab: (number) => set({ activeTab: number }),
}));

export default useTabsStore;
