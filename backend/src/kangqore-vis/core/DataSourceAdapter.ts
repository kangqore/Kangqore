import type { AdapterKind } from './types';

export type AdapterResult<T> =
  | { status: 'connected'; data: T }
  | { status: 'unconnected'; reason: string }
  | { status: 'error'; error: string };

export interface DataSourceAdapter<T = unknown> {
  readonly name: string;
  readonly kind: AdapterKind;
  isConnected(): Promise<boolean>;
  fetch(params?: Record<string, unknown>): Promise<AdapterResult<T>>;
}

export abstract class BaseAdapter<T = unknown> implements DataSourceAdapter<T> {
  abstract readonly name: string;
  abstract readonly kind: AdapterKind;

  async isConnected(): Promise<boolean> {
    return false;
  }

  async fetch(_params?: Record<string, unknown>): Promise<AdapterResult<T>> {
    return {
      status: 'unconnected',
      reason: `${this.name} is not configured. Set the required env vars and implement fetch().`,
    };
  }
}
