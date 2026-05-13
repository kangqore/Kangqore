import { KangqoreVisRegistry } from '../core/KangqoreVisRegistry';
import { GoogleSearchConsoleAdapter } from './adapters/GoogleSearchConsole';
import { GoogleAnalytics4Adapter } from './adapters/GoogleAnalytics4';
import { BingAdapter } from './adapters/Bing';
import { AhrefsAdapter } from './adapters/Ahrefs';
import { SemrushAdapter } from './adapters/Semrush';
import { LighthouseAdapter } from './adapters/Lighthouse';
import { AnswerEngineAdapter } from './adapters/AnswerEngine';

export function registerDataSources(): void {
  KangqoreVisRegistry.registerAdapter(new GoogleSearchConsoleAdapter());
  KangqoreVisRegistry.registerAdapter(new GoogleAnalytics4Adapter());
  KangqoreVisRegistry.registerAdapter(new BingAdapter());
  KangqoreVisRegistry.registerAdapter(new AhrefsAdapter());
  KangqoreVisRegistry.registerAdapter(new SemrushAdapter());
  KangqoreVisRegistry.registerAdapter(new LighthouseAdapter());
  KangqoreVisRegistry.registerAdapter(new AnswerEngineAdapter());
}

export { DataSourceRegistry } from './DataSourceRegistry';
