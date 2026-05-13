import { BaseAdapter } from '../../core/DataSourceAdapter';

export class GoogleAnalytics4Adapter extends BaseAdapter {
  readonly name = 'google-analytics-4';
  readonly kind = 'analytics' as const;

  async isConnected(): Promise<boolean> {
    return Boolean(process.env.GA4_PROPERTY_ID && process.env.GA4_SERVICE_ACCOUNT_EMAIL);
  }
}
