import { create } from 'zustand';

interface SignupState {
  email: string;
  setEmail: (email: string) => void;
}

export const useSignupStore = create<SignupState>((set) => ({
  email: '',
  setEmail: (email: string) => set({ email }),
}));
