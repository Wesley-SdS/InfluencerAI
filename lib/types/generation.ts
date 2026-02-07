export interface ImageGenerationState {
  modelId: string
  prompt: string
  isLoading: boolean
  imageUrl: string | null
  error: string | null
  generatedAt: Date | null
  requestId: string | null
}

export interface VideoGenerationState {
  modelId: string
  productName: string
  productDescription: string
  callToAction: string
  additionalPrompt: string
  sourceImageUrl: string
  isLoading: boolean
  videoUrl: string | null
  error: string | null
  generatedAt: Date | null
  requestId: string | null
}

export interface GenerationHistory {
  id: string
  type: "image" | "video"
  modelId: string
  prompt: string
  outputUrl: string
  createdAt: Date
}
