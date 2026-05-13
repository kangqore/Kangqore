const DEFAULT_OG_IMAGE = '/assets/og-image.jpg';

const OG_IMAGE_MAP: Record<string, string> = {
  '/': '/assets/og-image.jpg',
};

export class OgImageRegistry {
  static get(url: string): string {
    return OG_IMAGE_MAP[url] ?? DEFAULT_OG_IMAGE;
  }

  static register(url: string, imagePath: string): void {
    OG_IMAGE_MAP[url] = imagePath;
  }
}
