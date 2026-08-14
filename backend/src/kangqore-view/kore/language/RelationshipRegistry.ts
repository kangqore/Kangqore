import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface KoreRelationshipPayload {
  objectName:      string;
  relationName:    string;
  targetObjectName: string;
  cardinality?:    'ONE_TO_ONE' | 'ONE_TO_MANY' | 'MANY_TO_MANY';
  isRequired?:     boolean;
}

export class RelationshipRegistry {
  static async listRelationships(sourceObjectName: string) {
    const obj = await prisma.koreObject.findUnique({
      where: { name: sourceObjectName },
      include: { relationships: true },
    });
    if (!obj) throw new Error(`KoreObject '${sourceObjectName}' not found`);
    return obj.relationships;
  }

  static async registerRelationship(payload: KoreRelationshipPayload) {
    const src = await prisma.koreObject.findUnique({ where: { name: payload.objectName } });
    if (!src) throw new Error(`KoreObject '${payload.objectName}' not found`);

    return await (prisma as any).koreRelationship.create({
      data: {
        sourceObjectId:   src.id,
        relationName:     payload.relationName.trim(),
        targetObjectName: payload.targetObjectName.trim(),
        cardinality:      payload.cardinality ?? 'ONE_TO_MANY',
        isRequired:       payload.isRequired ?? false,
      },
    });
  }

  static async deleteRelationship(id: string) {
    return await (prisma as any).koreRelationship.delete({ where: { id } });
  }
}
