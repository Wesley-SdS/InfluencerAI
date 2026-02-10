import { z } from 'zod';

export const consistentImageSchema = z.object({
  personaId: z.string().min(1, 'Persona é obrigatória'),
  strategy: z.enum(['ip-adapter-faceid', 'instant-id', 'photomaker']).default('ip-adapter-faceid'),
  prompt: z.string().min(1, 'Prompt é obrigatório').max(2000),
  faceImageUrl: z.string().url('URL da imagem de referência inválida'),
  strength: z.number().min(0).max(1.5).optional(),
  aspectRatio: z.string().optional(),
  negativePrompt: z.string().max(1000).optional(),
});
