import { PublishChecklist } from './PublishChecklist';
import { KangqoreVisFlags } from '../core/flags';

export class PreflightService {
  static async canPublish(
    blueprintId: string
  ): Promise<{ ok: boolean; failures: string[]; mode: 'audit' | 'blocking' | 'off' }> {
    const mode = KangqoreVisFlags.governanceMode();
    if (mode === 'off') return { ok: true, failures: [], mode };

    const outcomes = await PublishChecklist.run(blueprintId);
    const failures = outcomes.filter((o) => !o.passed).map((o) => `${o.id}: ${o.detail ?? 'failed'}`);

    if (mode === 'audit') {
      return { ok: true, failures, mode };
    }
    return { ok: failures.length === 0, failures, mode };
  }
}
