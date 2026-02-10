import { z } from 'zod'

// ============================================
// SOCIAL PUBLISHING VALIDATIONS (Sprint 7)
// ============================================

// ============================================
// PUBLISH NOW
// ============================================

export const publishSchema = z.object({
  socialAccountId: z.string().min(1, 'Conta social é obrigatória'),
  mediaUrl: z.string().url('URL da mídia inválida'),
  mediaType: z.enum(['image', 'video', 'carousel'], {
    errorMap: () => ({ message: 'Tipo de mídia inválido' }),
  }),
  caption: z
    .string()
    .max(2200, 'Legenda muito longa (máximo 2200 caracteres)')
    .optional(),
  hashtags: z.string().max(1000, 'Hashtags muito longas').optional(),
})

export type PublishInput = z.infer<typeof publishSchema>

// ============================================
// SCHEDULE POST
// ============================================

export const scheduleSchema = publishSchema.extend({
  scheduledFor: z.coerce
    .date()
    .refine((date) => date > new Date(), {
      message: 'Data de agendamento deve ser no futuro',
    }),
  campaignId: z.string().optional(),
})

export type ScheduleInput = z.infer<typeof scheduleSchema>

// ============================================
// RESCHEDULE POST
// ============================================

export const rescheduleSchema = z.object({
  scheduledFor: z.coerce
    .date()
    .refine((date) => date > new Date(), {
      message: 'Data de reagendamento deve ser no futuro',
    }),
})

export type RescheduleInput = z.infer<typeof rescheduleSchema>

// ============================================
// LIST SCHEDULED FILTERS
// ============================================

export const listScheduledSchema = z.object({
  status: z
    .enum(['scheduled', 'publishing', 'published', 'failed', 'canceled'])
    .optional(),
  platform: z.enum(['instagram', 'tiktok', 'youtube']).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

export type ListScheduledFilters = z.infer<typeof listScheduledSchema>

// ============================================
// OAUTH CALLBACK
// ============================================

export const oauthCallbackSchema = z.object({
  code: z.string().min(1, 'Código OAuth ausente'),
  state: z.string().min(1, 'State ausente'),
})

export type OAuthCallbackInput = z.infer<typeof oauthCallbackSchema>

// ============================================
// DISCONNECT ACCOUNT
// ============================================

export const disconnectAccountSchema = z.object({
  accountId: z.string().min(1, 'ID da conta ausente'),
})

export type DisconnectAccountInput = z.infer<typeof disconnectAccountSchema>

// ============================================
// HASHTAG VALIDATION
// ============================================

export const validateHashtags = (hashtags: string): { valid: boolean; error?: string } => {
  if (!hashtags || hashtags.trim() === '') {
    return { valid: true }
  }

  // Split by spaces or commas
  const tags = hashtags.split(/[\s,]+/).filter((tag) => tag.trim() !== '')

  // Check count (Instagram limit = 30)
  if (tags.length > 30) {
    return {
      valid: false,
      error: `Muitas hashtags. Máximo: 30, fornecidas: ${tags.length}`,
    }
  }

  // Check format (must start with #)
  const invalidTags = tags.filter((tag) => !tag.startsWith('#'))
  if (invalidTags.length > 0) {
    return {
      valid: false,
      error: `Hashtags inválidas (devem começar com #): ${invalidTags.join(', ')}`,
    }
  }

  // Check hashtag length (max 30 chars per tag)
  const longTags = tags.filter((tag) => tag.length > 30)
  if (longTags.length > 0) {
    return {
      valid: false,
      error: `Hashtags muito longas (máximo 30 caracteres): ${longTags.join(', ')}`,
    }
  }

  return { valid: true }
}

// ============================================
// CAPTION VALIDATION BY PLATFORM
// ============================================

export const validateCaptionForPlatform = (
  caption: string,
  platform: 'instagram' | 'tiktok' | 'youtube'
): { valid: boolean; error?: string } => {
  const limits: Record<string, number> = {
    instagram: 2200,
    tiktok: 2200,
    youtube: 5000,
  }

  const maxLength = limits[platform]

  if (caption.length > maxLength) {
    return {
      valid: false,
      error: `Legenda muito longa para ${platform}. Máximo: ${maxLength} caracteres, fornecidos: ${caption.length}`,
    }
  }

  return { valid: true }
}
