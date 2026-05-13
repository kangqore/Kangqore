export interface ProofPoint {
  kind: 'methodology' | 'security' | 'policy' | 'certification' | 'case-study';
  title: string;
  url: string;
  description?: string;
}

const PROOF_POINTS: ProofPoint[] = [
  { kind: 'policy', title: 'Privacy Policy', url: '/privacy-policy' },
  { kind: 'policy', title: 'Terms & Conditions', url: '/terms-and-conditions' },
  { kind: 'policy', title: 'Cookie Policy', url: '/cookie-policy' },
  { kind: 'policy', title: 'Accessibility Statement', url: '/accessibility-statement' },
];

export class ProofPointService {
  static list(): ProofPoint[] {
    return [...PROOF_POINTS];
  }

  static register(p: ProofPoint): void {
    PROOF_POINTS.push(p);
  }
}
