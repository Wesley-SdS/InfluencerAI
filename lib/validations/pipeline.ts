import { z } from 'zod';
import { voiceSettingsSchema } from './voice';

const imagePromptContextSchema = z.object({
  scenario: z.string().optional(),
  action: z.string().optional(),
  style: z.string().optional(),
  additionalDetails: z.string().optional(),
});

const videoPromptContextSchema = z.object({
  scenario: z.string().optional(),
  action: z.string().optional(),
  productName: z.string().optional(),
  productDescription: z.string().optional(),
  cameraMovement: z.string().optional(),
  mood: z.string().optional(),
});

export const pipelinePersonaImageSchema = z.object({
  personaId: z.string().min(1),
  promptContext: imagePromptContextSchema,
  modelId: z.string().min(1),
  aspectRatio: z.string().optional(),
  useFaceConsistency: z.boolean().default(false),
  faceConsistencyStrategy: z.enum(['pulid', 'instant-id', 'photomaker']).optional(),
  faceConsistencyStrength: z.number().min(0).max(5).optional(),
});

export const pipelinePersonaVideoSchema = z.object({
  personaId: z.string().min(1),
  promptContext: videoPromptContextSchema,
  modelId: z.string().min(1),
  sourceImageUrl: z.string().url().optional(),
  duration: z.number().min(2).max(30).optional(),
});

export const pipelinePersonaVideoWithVoiceSchema = pipelinePersonaVideoSchema.extend({
  narrationText: z.string().min(1).max(5000),
  voiceSettings: voiceSettingsSchema.partial().optional(),
});
