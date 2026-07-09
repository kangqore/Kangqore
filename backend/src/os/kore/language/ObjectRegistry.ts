import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface KoreObjectPayload {
  name: string;
  description?: string;
  isSystem?: boolean;
}

export class ObjectRegistry {
  /**
   * Registers a new digital twin object in the ontology.
   */
  static async registerObject(payload: KoreObjectPayload) {
    const existing = await prisma.koreObject.findUnique({
      where: { name: payload.name }
    });

    if (existing) {
      throw new Error(`KoreObject '${payload.name}' already exists in the registry.`);
    }

    return await prisma.koreObject.create({
      data: {
        name: payload.name,
        description: payload.description,
        isSystem: payload.isSystem ?? false,
      }
    });
  }

  /**
   * Retrieves an object definition by name, including its properties and actions.
   */
  static async getObjectDefinition(name: string) {
    const obj = await prisma.koreObject.findUnique({
      where: { name },
      include: {
        properties: true,
        actions: true
      }
    });

    if (!obj) {
      throw new Error(`KoreObject '${name}' not found.`);
    }

    return obj;
  }

  /**
   * Lists all objects registered in the ontology.
   */
  static async listObjects() {
    return await prisma.koreObject.findMany({
      orderBy: { name: 'asc' }
    });
  }

  /**
   * Deletes a registered object if it is not a system object.
   */
  static async unregisterObject(name: string) {
    const obj = await prisma.koreObject.findUnique({ where: { name } });
    if (!obj) {
      throw new Error(`KoreObject '${name}' not found.`);
    }

    if (obj.isSystem) {
      throw new Error(`Cannot unregister system KoreObject '${name}'.`);
    }

    return await prisma.koreObject.delete({
      where: { name }
    });
  }
}
