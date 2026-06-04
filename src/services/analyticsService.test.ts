import { analyticsService } from './analyticsService';

describe('analyticsService', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    window.dataLayer = undefined;
    window.gtag = undefined;
  });

  it('initializes GA4 with the configured measurement id', () => {
    analyticsService.initialize('G-TEST123');

    expect(
      document.querySelector('script[src="https://www.googletagmanager.com/gtag/js?id=G-TEST123"]')
    ).toBeInTheDocument();
    expect(window.dataLayer).toEqual([
      ['js', expect.any(Date)],
      ['config', 'G-TEST123', { send_page_view: false }],
    ]);
  });

  it('tracks page views with path and title', () => {
    analyticsService.initialize('G-TEST123');

    analyticsService.trackPageView('/service?category=visa', 'Service');

    expect(window.dataLayer?.at(-1)).toEqual([
      'event',
      'page_view',
      {
        page_path: '/service?category=visa',
        page_title: 'Service',
        page_location: 'http://localhost:3000/service?category=visa',
      },
    ]);
  });

  it('tracks custom events after initialization', () => {
    analyticsService.initialize('G-TEST123');

    analyticsService.trackEvent('booking_completed', {
      service_id: 10,
      value: 50000,
    });

    expect(window.dataLayer?.at(-1)).toEqual([
      'event',
      'booking_completed',
      {
        service_id: 10,
        value: 50000,
      },
    ]);
  });
});
