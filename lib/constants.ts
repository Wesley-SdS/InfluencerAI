export const APP_CONFIG = {
  name: "InfluencerAI",
  description: "Create AI-powered digital influencers",
  version: "1.0.0",
} as const

export const REPLICATE_API_URL = "https://api.replicate.com/v1"

export const DEFAULT_IMAGE_SETTINGS = {
  width: 1024,
  height: 1024,
  aspectRatio: "1:1",
} as const

export const DEFAULT_VIDEO_SETTINGS = {
  duration: 5,
  fps: 24,
} as const

export const ASPECT_RATIOS = [
  { label: "1:1 (Square)", value: "1:1" },
  { label: "16:9 (Landscape)", value: "16:9" },
  { label: "9:16 (Portrait)", value: "9:16" },
  { label: "4:3 (Standard)", value: "4:3" },
  { label: "3:4 (Portrait)", value: "3:4" },
] as const

export const INFLUENCER_PROMPTS = {
  professional:
    "Professional digital influencer, photorealistic portrait, high-end fashion, studio lighting, confident expression, modern aesthetic",
  casual: "Casual digital influencer, natural lighting, friendly smile, lifestyle aesthetic, authentic look",
  glamorous: "Glamorous digital influencer, high fashion, dramatic makeup, editorial style, luxury aesthetic",
} as const
