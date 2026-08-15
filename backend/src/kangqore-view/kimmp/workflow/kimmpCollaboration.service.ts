// D10 — KimmpCollaboration
// Human collaboration on workflow runs: comments, approvals, @mentions.

import { prisma } from '../../../lib/prisma'

export type CommentType = 'COMMENT' | 'APPROVAL' | 'REJECTION' | 'INFO'

export interface WorkflowComment {
  id:        string
  runId:     string
  userId:    string
  content:   string
  mentions:  string[]
  type:      CommentType
  createdAt: Date
}

export class KimmpCollaboration {

  static async addComment(
    runId:    string,
    userId:   string,
    content:  string,
    type:     CommentType = 'COMMENT',
  ): Promise<WorkflowComment> {
    const mentions = (content.match(/@[\w-]+/g) ?? []).map(m => m.slice(1))
    const comment  = await (prisma as any).kimmpWorkflowComment.create({
      data: { runId, userId, content, mentions, type },
    })
    return comment
  }

  static async approve(runId: string, userId: string, note?: string): Promise<void> {
    await KimmpCollaboration.addComment(runId, userId, note ?? 'Approved.', 'APPROVAL')
    // The actual run resume is triggered by the caller (WAOE or route handler)
  }

  static async reject(runId: string, userId: string, reason: string): Promise<void> {
    await KimmpCollaboration.addComment(runId, userId, reason, 'REJECTION')
    await (prisma as any).kimmpWorkflowRun.update({
      where: { id: runId },
      data:  { status: 'FAILED', failedAt: new Date(), outcome: `Rejected: ${reason}` },
    })
  }

  static async getComments(runId: string): Promise<WorkflowComment[]> {
    return (prisma as any).kimmpWorkflowComment.findMany({
      where:   { runId },
      orderBy: { createdAt: 'asc' },
    }).catch(() => [])
  }

  // Check whether a run has been approved
  static async isApproved(runId: string): Promise<boolean> {
    const count = await (prisma as any).kimmpWorkflowComment.count({
      where: { runId, type: 'APPROVAL' },
    }).catch(() => 0)
    return count > 0
  }

  // Check whether a run has been rejected
  static async isRejected(runId: string): Promise<boolean> {
    const count = await (prisma as any).kimmpWorkflowComment.count({
      where: { runId, type: 'REJECTION' },
    }).catch(() => 0)
    return count > 0
  }
}
