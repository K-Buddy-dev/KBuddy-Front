import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { screen } from '@testing-library/react';
import render from '@/utils/test/render';
import { analyticsService } from '@/services/analyticsService';
import { AnalyticsRouteTracker } from './AnalyticsRouteTracker';

function NavigateButton() {
  const navigate = useNavigate();

  return (
    <button type="button" onClick={() => navigate('/service?category=visa')}>
      Go service
    </button>
  );
}

describe('AnalyticsRouteTracker', () => {
  beforeEach(() => {
    vi.spyOn(analyticsService, 'initialize').mockImplementation(() => undefined);
    vi.spyOn(analyticsService, 'trackPageView').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes GA4 and tracks route changes', async () => {
    const { user } = await render(
      <MemoryRouter initialEntries={['/home']}>
        <AnalyticsRouteTracker measurementId="G-TEST123" />
        <Routes>
          <Route path="/home" element={<NavigateButton />} />
          <Route path="/service" element={<div>Service</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(analyticsService.initialize).toHaveBeenCalledWith('G-TEST123');
    expect(analyticsService.trackPageView).toHaveBeenLastCalledWith('/home', 'K-buddy');

    await user.click(screen.getByRole('button', { name: 'Go service' }));

    expect(analyticsService.trackPageView).toHaveBeenLastCalledWith('/service?category=visa', 'K-buddy');
  });
});
