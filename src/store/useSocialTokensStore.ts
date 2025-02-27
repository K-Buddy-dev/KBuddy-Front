import { create } from 'zustand';

interface SocialTokensStore {
  kakaoToken: string | null;
  setKakaoToken: (token: string | null) => void;
  googleToken: string;
  setGoogleToken: (token: string) => void;
  appleToken: string;
  setAppleToken: (token: string) => void;
}

export const useSocialTokensStore = create<SocialTokensStore>((set) => ({
  kakaoToken: '',
  setKakaoToken: (token) => set({ kakaoToken: token }),
  googleToken: '',
  setGoogleToken: (token) => set({ googleToken: token }),
  appleToken: '',
  setAppleToken: (token) => set({ appleToken: token }),
}));
