import { PrismaClient } from '@prisma/client';
import { ObjectRegistry } from './ObjectRegistry';

const prisma = new PrismaClient();

export interface KorePropertyPayload {
  objectName: string;
  name: string;
  type: string;
  isRequired?: boolean;
  isUnique?: boolean;
  description?: string;
}

export class PropertyRegistry {
  /**
   * Registers a new property on a given KoreObject.
   */
  static async registerProperty(payload: KorePropertyPayload) {
    const obj = await prisma.koreObject.findUnique({
      where: { name: payload.objectName }
    });

    if (!obj) {
      throw new Error(`Cannot register property. KoreObject '${payload.objectName}' not found.`);
    }

    const existing = await prisma.koreProperty.findUnique({
      where: {
        objectId_name: {
          objectId: obj.id,
          name: payload.name
        }
      }
    });

    if (existing) {
      throw new Error(`Property '${payload.name}' already exists on KoreObject '${payload.objectName}'.`);
    }

    return await prisma.koreProperty.create({
      data: {
        objectId: obj.id,
        name: payload.name,
        type: payload.type,
        isRequired: payload.isRequired ?? false,
        isUnique: payload.isUnique ?? false,
        description: payload.description,
      }
    });
  }

  /**
   * Unregisters a property from a given KoreObject.
   */
  static async unregisterProperty(objectName: string, propertyName: string) {
    const obj = await prisma.koreObject.findUnique({ where: { name: objectName } });
    if (!obj) {
      throw new Error(`KoreObject '${objectName}' not found.`);
    }

    return await prisma.koreProperty.delete({
      where: {
        objectId_name: {
          objectId: obj.id,
          name: propertyName
        }
      }
    });
  }
}
