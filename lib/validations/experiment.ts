import { z } from 'zod'

// ============================================
// EXPERIMENT VALIDATIONS (Sprint 9)
// ============================================

export const createExperimentSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100),
  description: z.string().max(500).optional(),
  personaId: z.string().min(1, 'Persona é obrigatória'),
  testVariable: z.enum([
    'prompt',
    'model',
    'caption_style',
    'posting_time',
    'platform',
    'template',
  ]),
  variants: z
    .array(
      z.object({
        label: z.string().min(1).max(50),
        config: z.record(z.unknown()),
      })
    )
    .min(2, 'Experimento deve ter no mínimo 2 variantes')
    .max(4, 'Experimento deve ter no máximo 4 variantes'),
})

export const declareWinnerSchema = z.object({
  variantId: z.string().optional(),
})
