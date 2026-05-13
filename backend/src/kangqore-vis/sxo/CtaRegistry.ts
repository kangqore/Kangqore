import type { KangqoreVisCtaKind } from '@prisma/client';

export interface CtaConfig {
  kind: KangqoreVisCtaKind;
  label: string;
  href: string;
}

const DEFAULT_CTAS: Record<KangqoreVisCtaKind, CtaConfig> = {
  BOOK_CONSULTATION: { kind: 'BOOK_CONSULTATION', label: 'Book a Consultation', href: '/contact?intent=consultation' },
  CONTACT_SALES: { kind: 'CONTACT_SALES', label: 'Talk to Sales', href: '/contact?intent=sales' },
  REQUEST_PROPOSAL: { kind: 'REQUEST_PROPOSAL', label: 'Request a Proposal', href: '/contact?intent=proposal' },
  DOWNLOAD_ASSET: { kind: 'DOWNLOAD_ASSET', label: 'Download', href: '#' },
  SUBSCRIBE: { kind: 'SUBSCRIBE', label: 'Subscribe', href: '/newsletter' },
  APPLY: { kind: 'APPLY', label: 'Apply', href: '/careers' },
  NONE: { kind: 'NONE', label: '', href: '#' },
};

export class CtaRegistry {
  static get(kind: KangqoreVisCtaKind): CtaConfig {
    return DEFAULT_CTAS[kind];
  }

  static all(): CtaConfig[] {
    return Object.values(DEFAULT_CTAS);
  }
}
