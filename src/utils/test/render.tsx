import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

export default async (component: React.ReactNode) => {
  const user = userEvent.setup();

  return {
    user,
    ...render(component),
  };
};
