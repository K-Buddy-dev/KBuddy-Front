import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import render from '@/utils/test/render';
import { ToastProvider } from '@/hooks/useToastContext';
import { DetailTopbar } from './DetailTopbar';

it('keeps the detail topbar visible while scrolling when sticky is enabled', async () => {
  await render(
    <ToastProvider>
      <MemoryRouter>
        <DetailTopbar isSticky showDetailModal={false} setShowDetailModal={vi.fn()} title="Post title" type="back" />
      </MemoryRouter>
    </ToastProvider>
  );

  expect(screen.getByTestId('detail-topbar')).toHaveClass('sticky', 'top-0', 'z-20');
});
