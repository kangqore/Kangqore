import { adminApi } from '../../lib/api';

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
  async getObjects(): Promise<KoreObject[]> {
    const res = await adminApi.get('/kangqore/kore/objects');
    return res.data;
  },

  async getObject(name: string): Promise<KoreObject> {
    const res = await adminApi.get(`/kangqore/kore/objects/${name}`);
    return res.data;
  },

  async createObject(payload: { name: string; description?: string; isSystem?: boolean }): Promise<KoreObject> {
    const res = await adminApi.post('/kangqore/kore/objects', payload);
    return res.data;
  },

  async addProperty(objectName: string, payload: Omit<KoreProperty, 'id'>): Promise<KoreProperty> {
    const res = await adminApi.post(`/kangqore/kore/objects/${objectName}/properties`, payload);
    return res.data;
  },

  async addAction(objectName: string, payload: Omit<KoreAction, 'id'>): Promise<KoreAction> {
    const res = await adminApi.post(`/kangqore/kore/objects/${objectName}/actions`, payload);
    return res.data;
  }
};
