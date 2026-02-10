import { z } from 'zod'

export const concatVideosSchema = z.object({
  videoUrls: z.array(z.string().url()).min(2, 'Minimum 2 videos required').max(20, 'Maximum 20 videos allowed'),
  transitionType: z.enum(['none', 'crossfade', 'fade_black']).default('none'),
  transitionDuration: z.number().min(0.1).max(3).default(0.5),
})

export const mergeAudioSchema = z.object({
  videoUrl: z.string().url(),
  audioUrl: z.string().url(),
  audioVolume: z.number().min(0).max(1).default(1),
  keepOriginalAudio: z.boolean().default(false),
  fadeAudioIn: z.number().min(0).optional(),
  fadeAudioOut: z.number().min(0).optional(),
})

export const trimVideoSchema = z.object({
  videoUrl: z.string().url(),
  startTime: z.number().min(0),
  endTime: z.number().min(0.1),
}).refine((data) => data.endTime > data.startTime, {
  message: 'endTime must be greater than startTime',
  path: ['endTime'],
})
