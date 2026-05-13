const BASE_URL = process.env.PUBLIC_BASE_URL || 'https://kangqore.com';

export class CanonicalService {
  static resolve(path: string): string {
    if (!path || path === '/') return BASE_URL;
    return path.startsWith('http') ? path : `${BASE_URL}${path.startsWith('/') ? path : '/' + path}`;
  }
}
