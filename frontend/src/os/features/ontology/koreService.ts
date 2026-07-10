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

export const koreService = {
  getObjects(): Promise<KoreObject[]> {
    return apiFetch('/kangqore/kore/objects');
  },

  getObject(name: string): Promise<KoreObject> {
    return apiFetch(`/kangqore/kore/objects/${name}`);
  },

  createObject(payload: { name: string; description?: string; isSystem?: boolean }): Promise<KoreObject> {
    return apiFetch('/kangqore/kore/objects', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  addProperty(objectName: string, payload: Omit<KoreProperty, 'id'>): Promise<KoreProperty> {
    return apiFetch(`/kangqore/kore/objects/${objectName}/properties`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  addAction(objectName: string, payload: Omit<KoreAction, 'id'>): Promise<KoreAction> {
    return apiFetch(`/kangqore/kore/objects/${objectName}/actions`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
