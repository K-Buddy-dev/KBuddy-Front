import create from 'zustand';

const useTabsStore = create((set) => ({
  tab: '',
  setTab: (number) => set({ tab: number }),
}));

export default useTabsStore;
