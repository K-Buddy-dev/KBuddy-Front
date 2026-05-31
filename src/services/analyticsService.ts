type AnalyticsEventParams = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[][];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_SCRIPT_ID = 'ga4-script';

class AnalyticsService {
  private measurementId?: string;

  initialize(measurementId?: string) {
    if (!measurementId || (this.measurementId === measurementId && window.gtag)) {
      return;
    }

    this.measurementId = measurementId;
    window.dataLayer = window.dataLayer || [];
    window.gtag = (...args: unknown[]) => {
      window.dataLayer?.push(args);
    };

    if (!document.getElementById(GA_SCRIPT_ID)) {
      const script = document.createElement('script');
      script.id = GA_SCRIPT_ID;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);
    }

    window.gtag('js', new Date());
    window.gtag('config', measurementId, { send_page_view: false });
  }

  trackPageView(path: string, title = document.title) {
    if (!this.measurementId || !window.gtag) {
      return;
    }

    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: title,
      page_location: `${window.location.origin}${path}`,
    });
  }

  trackEvent(eventName: string, params?: AnalyticsEventParams) {
    if (!this.measurementId || !window.gtag) {
      return;
    }

    window.gtag('event', eventName, params || {});
  }
}

export const analyticsService = new AnalyticsService();
