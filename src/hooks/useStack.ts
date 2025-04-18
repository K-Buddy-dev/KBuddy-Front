import { createContext, useContext } from 'react';
import { Activity } from '@/types';

export interface StackStateContextType {
  stack: Activity[];
}

export interface StackActionContextType {
  push: (activity: Activity) => void;
  pop: () => void;
  clear: () => void;
  init: (activities: Activity[]) => void;
}

export const StackStateContext = createContext<StackStateContextType | undefined>(undefined);
export const StackActionContext = createContext<StackActionContextType | undefined>(undefined);

export const useStackStateContext = () => {
  const state = useContext(StackStateContext);
  if (state === undefined) {
    throw new Error('useStackStateContext must be used within an StackStateContextProvider');
  }
  return state;
};

export const useStackActionContext = () => {
  const actions = useContext(StackActionContext);
  if (actions === undefined) {
    throw new Error('useStackActionContext must be used within an StackActionContextProvider');
  }
  return actions;
};
