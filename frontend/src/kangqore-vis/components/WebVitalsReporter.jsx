import { useWebVitals } from '../hooks/useWebVitals';

function VitalsCollector() {
  useWebVitals();
  return null;
}

const WebVitalsReporter = () => {
  if (typeof window === 'undefined') return null;
  if (typeof document === 'undefined') return null;
  if (typeof navigator === 'undefined') return null;

  if (typeof Array.prototype.at !== 'function') return null;

  const ua = navigator.userAgent || '';
  if (/HeadlessChrome|react-snap|Puppeteer/i.test(ua)) return null;

  return <VitalsCollector />;
};

export default WebVitalsReporter;
