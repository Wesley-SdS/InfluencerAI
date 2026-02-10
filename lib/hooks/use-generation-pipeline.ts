"use client"

import { useState, useCallback, useMemo } from "react"
import { usePersona } from "@/lib/context/persona-context"
import { pipelineService } from "@/lib/services/PipelineService"
import type { PipelineResult } from "@/lib/types/pipeline"
import type { FaceConsistencyStrategyName } from "@/lib/types/face-consistency"
import type { ImagePromptContext, VideoPromptContext } from "@/lib/types/persona"
import type { VoiceSettings } from "@/lib/types/voice"

export function useGenerationPipeline() {
  const { selectedPersona } = usePersona()

  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<PipelineResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Face consistency controls
  const [useFaceConsistency, setUseFaceConsistency] = useState(false)
  const [faceConsistencyStrategy, setFaceConsistencyStrategy] = useState<FaceConsistencyStrategyName>("ip-adapter-faceid")
  const [faceConsistencyStrength, setFaceConsistencyStrength] = useState(0.6)

  // Narration controls
  const [useNarration, setUseNarration] = useState(false)
  const [narrationText, setNarrationText] = useState("")

  const capabilities = useMemo(() => ({
    hasReferenceImage: !!selectedPersona?.referenceImageUrl,
    hasVoice: !!selectedPersona?.voiceId,
    hasBasePrompt: !!selectedPersona?.basePrompt,
  }), [selectedPersona])

  const shouldUsePipeline = !!selectedPersona && (useFaceConsistency || useNarration)

  const generateImage = useCallback(async (params: {
    promptContext: ImagePromptContext
    modelId: string
    aspectRatio?: string
  }) => {
    if (!selectedPersona) return null
    setIsLoading(true)
    setError(null)

    try {
      const response = await pipelineService.generatePersonaImage({
        personaId: selectedPersona.id,
        promptContext: params.promptContext,
        modelId: params.modelId,
        aspectRatio: params.aspectRatio,
        useFaceConsistency,
        faceConsistencyStrategy: useFaceConsistency ? faceConsistencyStrategy : undefined,
        faceConsistencyStrength: useFaceConsistency ? faceConsistencyStrength : undefined,
      })

      if (response.success && response.data) {
        setResult(response.data)
        return response.data
      } else {
        setError(response.error || "Erro no pipeline de imagem")
        return null
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro no pipeline"
      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [selectedPersona, useFaceConsistency, faceConsistencyStrategy, faceConsistencyStrength])

  const generateVideo = useCallback(async (params: {
    promptContext: VideoPromptContext
    modelId: string
    sourceImageUrl?: string
    duration?: number
  }) => {
    if (!selectedPersona) return null
    setIsLoading(true)
    setError(null)

    try {
      const response = await pipelineService.generatePersonaVideo({
        personaId: selectedPersona.id,
        ...params,
      })

      if (response.success && response.data) {
        setResult(response.data)
        return response.data
      } else {
        setError(response.error || "Erro no pipeline de vídeo")
        return null
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro no pipeline"
      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [selectedPersona])

  const generateVideoWithVoice = useCallback(async (params: {
    promptContext: VideoPromptContext
    modelId: string
    sourceImageUrl?: string
    duration?: number
    voiceSettings?: Partial<VoiceSettings>
  }) => {
    if (!selectedPersona) return null
    setIsLoading(true)
    setError(null)

    try {
      const response = await pipelineService.generatePersonaVideoWithVoice({
        personaId: selectedPersona.id,
        narrationText,
        ...params,
      })

      if (response.success && response.data) {
        setResult(response.data)
        return response.data
      } else {
        setError(response.error || "Erro no pipeline de vídeo com narração")
        return null
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro no pipeline"
      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [selectedPersona, narrationText])

  const clearError = useCallback(() => setError(null), [])

  return {
    isLoading,
    result,
    error,
    clearError,
    capabilities,
    shouldUsePipeline,
    selectedPersona,
    // Face consistency
    useFaceConsistency,
    setUseFaceConsistency,
    faceConsistencyStrategy,
    setFaceConsistencyStrategy,
    faceConsistencyStrength,
    setFaceConsistencyStrength,
    // Narration
    useNarration,
    setUseNarration,
    narrationText,
    setNarrationText,
    // Actions
    generateImage,
    generateVideo,
    generateVideoWithVoice,
  }
}
