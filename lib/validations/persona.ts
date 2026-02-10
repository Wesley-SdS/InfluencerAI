import { z } from 'zod'

export const createPersonaSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  bio: z.string().max(500).optional(),
  gender: z.string().optional(),
  ageRange: z.string().optional(),
  ethnicity: z.string().optional(),
  bodyType: z.string().optional(),
  hairColor: z.string().max(50).optional(),
  hairStyle: z.string().max(100).optional(),
  eyeColor: z.string().max(50).optional(),
  distinctiveFeatures: z.string().max(500).optional(),
  styleDescription: z.string().max(500).optional(),
  niche: z.string().optional(),
  targetPlatform: z.string().optional(),
  contentTone: z.string().optional(),
  language: z.string().default('pt-BR'),
})

export const updatePersonaSchema = createPersonaSchema.partial()

export const personaFiltersSchema = z.object({
  niche: z.string().optional(),
  targetPlatform: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
  isArchived: z.coerce.boolean().optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
  orderBy: z.enum(['createdAt', 'name', 'updatedAt']).default('createdAt'),
  orderDir: z.enum(['asc', 'desc']).default('desc'),
})

export const createPersonaAssetSchema = z.object({
  type: z.enum(['reference', 'generated_image', 'generated_video', 'avatar']),
  url: z.string().url(),
  prompt: z.string().optional(),
  modelId: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
})
