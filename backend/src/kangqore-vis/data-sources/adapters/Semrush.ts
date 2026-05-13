import { BaseAdapter } from '../../core/DataSourceAdapter';

export class SemrushAdapter extends BaseAdapter {
  readonly name = 'semrush';
  readonly kind = 'seo' as const;

  async isConnected(): Promise<boolean> {
    return Boolean(process.env.SEMRUSH_API_KEY);
  }
}
