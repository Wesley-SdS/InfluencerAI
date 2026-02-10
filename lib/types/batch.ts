// ============================================
// BATCH GENERATION TYPES (Sprint 9)
// ============================================

import type { BatchJob } from '@prisma/client'

export interface CampaignBatchParams {
  userId: string
  personaId: string
  templateId: string
  items: Array<{
    name: string
    variables: Record<string, string>
    platform?: string
    scheduledFor?: Date
  }>
}

export interface VariationBatchParams {
  userId: string
  personaId: string
  templateId: string
  baseVariables: Record<string, string>
  variations: Array<{
    label: string
    variableOverrides: Record<string, string>
  }>
}

export interface BatchJobWithProgress extends BatchJob {
  progressPercentage: number
}

export type BatchJobType = 'campaign_batch' | 'image_batch' | 'variation_batch'
export type BatchJobStatus = 'queued' | 'running' | 'completed' | 'failed' | 'canceled'
