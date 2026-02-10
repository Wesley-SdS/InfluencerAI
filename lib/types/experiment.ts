// ============================================
// A/B TESTING TYPES (Sprint 9)
// ============================================

import type { Experiment, ExperimentVariant } from '@prisma/client'

export interface CreateExperimentParams {
  name: string
  description?: string
  personaId: string
  testVariable: TestVariable
  variants: Array<{
    label: string
    config: Record<string, unknown>
  }>
}

export type TestVariable = 'prompt' | 'model' | 'caption_style' | 'posting_time' | 'platform' | 'template'

export interface ExperimentWithVariants extends Experiment {
  variants: ExperimentVariant[]
}

export interface ExperimentResult {
  experimentId: string
  winnerId: string | null
  variants: Array<{
    id: string
    label: string
    likes: number
    comments: number
    views: number
    engagementRate: number | null
    isWinner: boolean
  }>
}
