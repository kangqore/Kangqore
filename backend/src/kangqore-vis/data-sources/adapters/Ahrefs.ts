import { BaseAdapter } from '../../core/DataSourceAdapter';

export class AhrefsAdapter extends BaseAdapter {
  readonly name = 'ahrefs';
  readonly kind = 'seo' as const;

  async isConnected(): Promise<boolean> {
    return Boolean(process.env.AHREFS_API_TOKEN);
  }
}
