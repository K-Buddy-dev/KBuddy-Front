import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SocialStore {
  email: string;
  oAuthUid: number | string;
  oAuthCategory: 'KAKAO' | 'GOOGLE' | 'APPLE' | null;
  setEmail: (email: string) => void;
  setoAuthUid: (uid: number | string) => void;
  setoAuthCategory: (type: 'KAKAO' | 'GOOGLE' | 'APPLE' | null) => void;
  reset: () => void;
}

export const useSocialStore = create<SocialStore>()(
  persist(
    (set) => ({
      email: '',
      oAuthUid: '',
      oAuthCategory: null,
      setEmail: (email) => set({ email }),
      setoAuthUid: (oAuthUid) => set({ oAuthUid }),
      setoAuthCategory: (oAuthCategory) => set({ oAuthCategory }),
      reset: () => set({ email: '', oAuthUid: '', oAuthCategory: null }),
    }),
    {
      name: 'social-auth',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
