import { create } from 'zustand';

interface SocialStore {
  email: string;
  oAuthUid: number | string;
  oAuthCategory: 'KAKAO' | 'GOOGLE' | 'APPLE' | null;
  setEmail: (email: string) => void;
  setoAuthUid: (uid: number | string) => void;
  setoAuthCategory: (type: 'KAKAO' | 'GOOGLE' | 'APPLE' | null) => void;
}

export const useSocialStore = create<SocialStore>((set) => ({
  email: '',
  setEmail: (email) => set({ email: email }),
  oAuthUid: '',
  setoAuthUid: (uid) => set({ oAuthUid: uid }),
  oAuthCategory: null,
  setoAuthCategory: (type) => set({ oAuthCategory: type }),
}));
