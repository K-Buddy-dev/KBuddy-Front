import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SocialStore {
  email: string;
  oAuthUid: number | string;
  oAuthCategory: 'KAKAO' | 'GOOGLE' | 'APPLE' | null;
  firstName: string;
  lastName: string;
  setEmail: (email: string) => void;
  setoAuthUid: (uid: number | string) => void;
  setoAuthCategory: (type: 'KAKAO' | 'GOOGLE' | 'APPLE' | null) => void;
  socialStoreReset: () => void;
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
}

export const useSocialStore = create<SocialStore>()(
  persist(
    (set) => ({
      email: '',
      oAuthUid: '',
      oAuthCategory: null,
      firstName: '',
      lastName: '',
      setFirstName: (firstName) => set({ firstName }),
      setLastName: (lastName) => set({ lastName }),
      setEmail: (email) => set({ email }),
      setoAuthUid: (oAuthUid) => set({ oAuthUid }),
      setoAuthCategory: (oAuthCategory) => set({ oAuthCategory }),
      socialStoreReset: () => set({ email: '', oAuthUid: '', oAuthCategory: null, firstName: '', lastName: '' }),
    }),
    {
      name: 'social-auth',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
