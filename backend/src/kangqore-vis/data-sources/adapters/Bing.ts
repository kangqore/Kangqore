import { BaseAdapter } from '../../core/DataSourceAdapter';

export class BingAdapter extends BaseAdapter {
  readonly name = 'bing-webmaster';
  readonly kind = 'seo' as const;

  async isConnected(): Promise<boolean> {
    return Boolean(process.env.BING_WEBMASTER_API_KEY);
  }
}
