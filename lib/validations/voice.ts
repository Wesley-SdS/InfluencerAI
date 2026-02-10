import { z } from 'zod';

export const voiceSettingsSchema = z.object({
  stability: z.number().min(0).max(1).default(0.5),
  similarity_boost: z.number().min(0).max(1).default(0.75),
  style: z.number().min(0).max(1).default(0.0),
  use_speaker_boost: z.boolean().default(true),
});

export const generateSpeechSchema = z.object({
  personaId: z.string().min(1, 'Persona é obrigatória'),
  text: z.string().min(1, 'Texto é obrigatório').max(5000),
  voiceSettings: voiceSettingsSchema.partial().optional(),
});

export const setPersonaVoiceSchema = z.object({
  voiceProvider: z.literal('elevenlabs'),
  voiceId: z.string().min(1),
  voiceName: z.string().min(1),
  voicePreviewUrl: z.string().url().nullable().optional(),
  voiceSettings: voiceSettingsSchema.optional(),
});

export const cloneVoiceSchema = z.object({
  personaId: z.string().min(1),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});
