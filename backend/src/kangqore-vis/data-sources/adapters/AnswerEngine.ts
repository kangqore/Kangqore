import { BaseAdapter } from '../../core/DataSourceAdapter';

export class AnswerEngineAdapter extends BaseAdapter {
  readonly name = 'answer-engine';
  readonly kind = 'answer-engine' as const;

  async isConnected(): Promise<boolean> {
    return Boolean(process.env.ANSWER_ENGINE_TRACKER_KEY);
  }
}
