import { apiFetch } from '@lib/api';

export interface KoreProperty {
  id: string;
  name: string;
  type: string;
  isRequired: boolean;
  isUnique: boolean;
  description?: string;
}

export interface KoreAction {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
}

export interface KoreObject {
  id: string;
  name: string;
  description?: string;
  isSystem: boolean;
  properties?: KoreProperty[];
  actions?: KoreAction[];
  createdAt: string;
  updatedAt: string;
}

type KoreResp<T> = { success: boolean; data: T }

export const koreService = {
  getObjects(): Promise<KoreObject[]> {
    return apiFetch<KoreResp<KoreObject[]>>('/kangqore/kore/objects').then(r => r.data ?? []);
  },

  getObject(name: string): Promise<KoreObject> {
    return apiFetch<KoreResp<KoreObject>>(`/kangqore/kore/objects/${name}`).then(r => r.data);
  },

  createObject(payload: { name: string; description?: string; isSystem?: boolean }): Promise<KoreObject> {
    return apiFetch<KoreResp<KoreObject>>('/kangqore/kore/objects', {
      method: 'POST',
      body: JSON.stringify(payload),
    }).then(r => r.data);
  },

  addProperty(objectName: string, payload: Omit<KoreProperty, 'id'>): Promise<KoreProperty> {
    return apiFetch<KoreResp<KoreProperty>>(`/kangqore/kore/objects/${objectName}/properties`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }).then(r => r.data);
  },

  addAction(objectName: string, payload: Omit<KoreAction, 'id'>): Promise<KoreAction> {
    return apiFetch<KoreResp<KoreAction>>(`/kangqore/kore/objects/${objectName}/actions`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }).then(r => r.data);
  },
};
