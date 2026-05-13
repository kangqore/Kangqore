import { BaseAdapter } from '../../core/DataSourceAdapter';

export class LighthouseAdapter extends BaseAdapter {
  readonly name = 'lighthouse';
  readonly kind = 'performance' as const;

  async isConnected(): Promise<boolean> {
    return Boolean(process.env.PAGESPEED_API_KEY);
  }
}
