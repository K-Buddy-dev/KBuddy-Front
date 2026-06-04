import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analyticsService } from '@/services/analyticsService';

interface AnalyticsRouteTrackerProps {
  measurementId?: string;
}

export function AnalyticsRouteTracker({ measurementId }: AnalyticsRouteTrackerProps) {
  const location = useLocation();

  useEffect(() => {
    analyticsService.initialize(measurementId);
  }, [measurementId]);

  useEffect(() => {
    analyticsService.trackPageView(`${location.pathname}${location.search}`, document.title || 'K-buddy');
  }, [location.pathname, location.search]);

  return null;
}
