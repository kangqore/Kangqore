import { useEffect } from 'react';

const ENDPOINT = '/api/kangqore-vis/perf/cwv';

function send(payload) {
  try {
    const body = JSON.stringify({ ...payload, userAgent: navigator.userAgent });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'application/json' }));
    } else {
      fetch(ENDPOINT, { method: 'POST', body, headers: { 'Content-Type': 'application/json' }, keepalive: true });
    }
  } catch {
    // intentionally silent
  }
}

export function useWebVitals() {
  useEffect(() => {
    let cancelled = false;
    import('web-vitals')
      .then(({ onLCP, onINP, onCLS, onFCP, onTTFB }) => {
        if (cancelled) return;
        const handler = (metric) => {
          send({
            url: window.location.pathname,
            metric: metric.name,
            value: metric.value,
            rating: metric.rating,
            navigationType: metric.navigationType,
          });
        };
        onLCP(handler);
        onINP(handler);
        onCLS(handler);
        onFCP(handler);
        onTTFB(handler);
      })
      .catch(() => {
        // web-vitals not installed yet — KangqoreVis performance module will collect once `npm install web-vitals` is run.
      });
    return () => {
      cancelled = true;
    };
  }, []);
}
