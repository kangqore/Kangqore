import { BaseAdapter } from '../../core/DataSourceAdapter';

export class GoogleSearchConsoleAdapter extends BaseAdapter {
  readonly name = 'google-search-console';
  readonly kind = 'seo' as const;

  async isConnected(): Promise<boolean> {
    return Boolean(process.env.GSC_SERVICE_ACCOUNT_EMAIL && process.env.GSC_PRIVATE_KEY);
  }
}
