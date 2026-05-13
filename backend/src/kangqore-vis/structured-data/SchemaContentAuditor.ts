import { prisma } from '../../lib/prisma';

interface AuditResult {
  blueprintId: string;
  url: string;
  schemaKind: string;
  passed: boolean;
  reason?: string;
}

export class SchemaContentAuditor {
  static async audit(): Promise<AuditResult[]> {
    const records = await prisma.kangqoreVisSchemaRecord.findMany({
      include: { blueprint: { select: { id: true, url: true, faqRequired: true, faqs: true } } },
    });

    const results: AuditResult[] = [];

    for (const record of records) {
      const { blueprint } = record;
      let passed = true;
      let reason: string | undefined;

      if (record.schemaKind === 'FAQ_PAGE') {
        if (!blueprint.faqRequired || blueprint.faqs.length === 0) {
          passed = false;
          reason = 'FAQPage schema declared but no visible FAQ block / FAQ records found.';
        }
      }

      results.push({
        blueprintId: blueprint.id,
        url: blueprint.url,
        schemaKind: record.schemaKind,
        passed,
        reason,
      });

      if (!passed) {
        await prisma.kangqoreVisAudit
          .create({
            data: {
              kind: 'SCHEMA_CONTENT_MATCH',
              severity: 'ERROR',
              blueprintId: blueprint.id,
              message: reason ?? 'Schema/content mismatch',
              details: { schemaKind: record.schemaKind },
            },
          })
          .catch(() => undefined);
      }
    }

    return results;
  }
}
