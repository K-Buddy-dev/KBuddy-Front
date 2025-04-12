import { useStackStateContext } from '@/hooks';
import clsx from 'clsx';

export const StackRenderer = () => {
  const { stack } = useStackStateContext();

  return (
    <div className="w-full min-h-screen relative overflow-hidden">
      {stack.map((activity, i) => {
        const { transition, direction } = activity;

        const translateClass =
          transition === 'animating'
            ? direction === 'right'
              ? 'translate-x-full'
              : '-translate-x-full'
            : 'translate-x-0';

        return (
          <div
            key={activity.key}
            className={clsx(
              'absolute top-0 left-0 w-full h-full',
              'transition-transform duration-300 ease-in-out',
              translateClass,
              transition === 'animating' ? 'pointer-events-none' : 'pointer-events-auto',
              `z-[${i}]`
            )}
          >
            {activity.element}
          </div>
        );
      })}
    </div>
  );
};
