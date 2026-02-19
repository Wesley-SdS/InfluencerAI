import { z } from 'zod'

// Preprocess to clean empty strings from the entire object
const cleanEmptyStrings = (data: unknown) => {
  if (typeof data !== 'object' || data === null) return data

  const cleaned: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(data)) {
    // Always keep required fields as-is (they'll be validated)
    if (key === 'name' || key === 'language') {
      cleaned[key] = value
    }
    // For optional fields, only include if not empty
    else if (value !== '') {
      cleaned[key] = value
    }
    // Empty strings are omitted (become undefined)
  }
  return cleaned
}

// Base schema without preprocessing
const basePersonaSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  bio: z.string().max(2000).optional(),
  gender: z.string().optional(),
  ageRange: z.string().optional(),
  ethnicity: z.string().optional(),
  bodyType: z.string().optional(),
  hairColor: z.string().max(50).optional(),
  hairStyle: z.string().max(100).optional(),
  eyeColor: z.string().max(50).optional(),
  distinctiveFeatures: z.string().max(500).optional(),
  styleDescription: z.string().max(1000).optional(),
  niche: z.string().optional(),
  targetPlatform: z.string().optional(),
  contentTone: z.string().optional(),
  language: z.string().default('pt-BR'),
})

// Create schema with preprocessing
export const createPersonaSchema = z.preprocess(
  cleanEmptyStrings,
  basePersonaSchema
)

// Update schema with preprocessing and partial
export const updatePersonaSchema = z.preprocess(
  cleanEmptyStrings,
  basePersonaSchema.partial()
)

export const personaFiltersSchema = z.object({
  niche: z.string().optional(),
  targetPlatform: z.string().optional(),
  isActive: z.string().optional().transform(v => v === undefined ? undefined : v === 'true'),
  isArchived: z.string().optional().transform(v => v === undefined ? undefined : v === 'true'),
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
