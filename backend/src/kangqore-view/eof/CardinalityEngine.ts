// Enforces typed cardinality rules before OntologyRelationship writes.
// Rules live in OntologyCardinalityRule — if no rule exists for a given
// (sourceType, targetType, relationshipType) triplet, the write is allowed.

import { prisma } from '../../lib/prisma'

export type CardinalityType = 'ONE_TO_ONE' | 'ONE_TO_MANY' | 'MANY_TO_ONE' | 'MANY_TO_MANY'

export interface CardinalityCheckResult {
  valid: boolean
  violation?: string
}

export const CardinalityEngine = {
  async check(
    sourceType: string,
    targetType: string,
    relationshipType: string,
    sourceId: string,
    targetId: string,
  ): Promise<CardinalityCheckResult> {
    const rule = await (prisma as any).ontologyCardinalityRule.findUnique({
      where: {
        sourceType_targetType_relationshipType: { sourceType, targetType, relationshipType },
      },
    })
    if (!rule) return { valid: true }

    const cardinality = rule.cardinality as CardinalityType

    // ONE_TO_ONE or MANY_TO_ONE: source can only have ONE outgoing edge of this type
    if (cardinality === 'ONE_TO_ONE' || cardinality === 'MANY_TO_ONE') {
      const existing = await prisma.ontologyRelationship.findFirst({
        where: {
          sourceId,
          targetType,
          relationshipType,
          validTo: null,
          NOT: { targetId },
        },
      })
      if (existing) {
        return {
          valid: false,
          violation: `Cardinality violation: ${sourceType} already has a "${relationshipType}" → ${targetType} relationship (${cardinality}). Only one outgoing allowed.`,
        }
      }
    }

    // ONE_TO_ONE or ONE_TO_MANY: target can only have ONE incoming edge of this type
    if (cardinality === 'ONE_TO_ONE' || cardinality === 'ONE_TO_MANY') {
      const existing = await prisma.ontologyRelationship.findFirst({
        where: {
          targetId,
          sourceType,
          relationshipType,
          validTo: null,
          NOT: { sourceId },
        },
      })
      if (existing) {
        return {
          valid: false,
          violation: `Cardinality violation: ${targetType} already has an incoming "${relationshipType}" from ${sourceType} (${cardinality}). Only one incoming allowed.`,
        }
      }
    }

    return { valid: true }
  },

  async createRule(
    sourceType: string,
    targetType: string,
    relationshipType: string,
    cardinality: CardinalityType,
  ) {
    return (prisma as any).ontologyCardinalityRule.upsert({
      where: { sourceType_targetType_relationshipType: { sourceType, targetType, relationshipType } },
      create: { sourceType, targetType, relationshipType, cardinality },
      update: { cardinality },
    })
  },

  async listRules() {
    return (prisma as any).ontologyCardinalityRule.findMany({
      orderBy: [{ sourceType: 'asc' }, { relationshipType: 'asc' }],
    })
  },

  async deleteRule(id: string) {
    return (prisma as any).ontologyCardinalityRule.delete({ where: { id } })
  },
}
