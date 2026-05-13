interface RedirectRule {
  from: string;
  to: string;
  status: 301 | 302;
}

export class RedirectService {
  private static rules: RedirectRule[] = [];

  static register(rule: RedirectRule): void {
    this.rules.push(rule);
  }

  static lookup(path: string): RedirectRule | undefined {
    return this.rules.find((r) => r.from === path);
  }

  static all(): RedirectRule[] {
    return [...this.rules];
  }
}
