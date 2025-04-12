import { StackActionContext, StackStateContext } from '@/hooks';
import { Activity, TransitionDirection, TransitionState } from '@/types';
import { useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';

export const StackContextProvider = () => {
  const [stack, setStack] = useState<Activity[]>([]);

  const push = (activity: Omit<Activity, 'transition' | 'direction'>) => {
    const newActivity: Activity = {
      ...activity,
      transition: 'animating',
      direction: 'right',
    };

    setStack((prev) => [...prev, newActivity]);

    requestAnimationFrame(() => {
      setStack((prev) =>
        prev.map((item, i) =>
          i === prev.length - 1
            ? { ...item, transition: 'current' }
            : item.transition === 'current'
              ? { ...item, transition: 'animating', direction: 'left' }
              : item
        )
      );
    });
  };

  const pop = () => {
    setStack((prev) => {
      const newStack = [...prev];
      const current = newStack[newStack.length - 1];
      const prevPage = newStack[newStack.length - 2];

      if (current) {
        current.transition = 'animating';
        current.direction = 'right';
      }
      if (prevPage) {
        prevPage.transition = 'animating';
        prevPage.direction = 'left';
      }

      return newStack;
    });

    requestAnimationFrame(() => {
      setStack((prev) =>
        prev.map((item, i) =>
          i === prev.length - 2 && item.transition === 'animating' ? { ...item, transition: 'current' } : item
        )
      );
    });

    setTimeout(() => {
      setStack((prev) => prev.slice(0, -1));
    }, 300);
  };

  const init = (activities: Omit<Activity, 'transition' | 'direction'>[]) => {
    if (activities.length === 0) {
      setStack([]);
      return;
    }

    const newStack = activities.map((activity, i) => {
      const isLast = i === activities.length - 1;
      return {
        ...activity,
        transition: isLast ? ('current' as TransitionState) : ('animating' as TransitionState),
        direction: isLast ? ('right' as TransitionDirection) : ('left' as TransitionDirection),
      };
    });

    setStack(newStack);
  };

  const clear = () => {
    setStack([]);
  };

  const stateValue = useMemo(() => ({ stack }), [stack]);
  const actionValue = useMemo(() => ({ push, pop, clear, init }), [push, pop, clear, init]);

  return (
    <StackStateContext.Provider value={stateValue}>
      <StackActionContext.Provider value={actionValue}>
        <Outlet />
      </StackActionContext.Provider>
    </StackStateContext.Provider>
  );
};
