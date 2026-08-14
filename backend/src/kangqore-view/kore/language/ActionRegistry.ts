import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface KoreActionPayload {
  objectName: string;
  name: string;
  description?: string;
  permissions?: string[];
}

export class ActionRegistry {
  /**
   * Registers a new action on a given KoreObject.
   */
  static async registerAction(payload: KoreActionPayload) {
    const obj = await prisma.koreObject.findUnique({
      where: { name: payload.objectName }
    });

    if (!obj) {
      throw new Error(`Cannot register action. KoreObject '${payload.objectName}' not found.`);
    }

    const existing = await prisma.koreAction.findUnique({
      where: {
        objectId_name: {
          objectId: obj.id,
          name: payload.name
        }
      }
    });

    if (existing) {
      throw new Error(`Action '${payload.name}' already exists on KoreObject '${payload.objectName}'.`);
    }

    return await prisma.koreAction.create({
      data: {
        objectId: obj.id,
        name: payload.name,
        description: payload.description,
        permissions: payload.permissions ?? [],
      }
    });
  }

  /**
   * Retrieves an action definition.
   */
  static async getActionDefinition(objectName: string, actionName: string) {
    const obj = await prisma.koreObject.findUnique({
      where: { name: objectName },
      include: {
        actions: {
          where: { name: actionName }
        }
      }
    });

    if (!obj || obj.actions.length === 0) {
      throw new Error(`Action '${actionName}' not found on KoreObject '${objectName}'.`);
    }

    return obj.actions[0];
  }
}
