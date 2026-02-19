"use client"

import { useGeneration } from "@/lib/context/generation-context"
import { useReplicate } from "@/lib/context/replicate-context"
import { videoGenerationService } from "@/lib/services/VideoGenerationService"
import type { VideoGenerationState } from "@/lib/types/generation"
import type { GenerateVideoRequest } from "@/lib/types/replicate"
import { buildProductVideoPrompt } from "@/lib/utils/promptUtils"
import { extractOutputUrl, isSuccessfulResponse } from "@/lib/utils/replicateUtils"
import { useCallback, useState } from "react"

const INITIAL_STATE: VideoGenerationState = {
  modelId: "tencent/hunyuan-video",
  productName: "",
  productDescription: "",
  callToAction: "",
  additionalPrompt: "",
  sourceImageUrl: "",
  isLoading: false,
  videoUrl: null,
  error: null,
  generatedAt: null,
  requestId: null,
}

/**
 * Hook para geração de vídeos
 * Princípio: Single Responsibility Principle (SRP) refatorado
 * Responsabilidades reduzidas:
 * - Gerenciamento de estado local de UI
 * - Orquestração entre service e contextos
 * Responsabilidades extraídas:
 * - Chamadas de API → VideoGenerationService
 * - Transformação de dados → replicateUtils
 * - Construção de prompt → promptUtils
 */
export function useVideoGeneration() {
  const { isConfigured } = useReplicate()
  const { generatedImageUrl, addToHistory } = useGeneration()
  const [state, setState] = useState<VideoGenerationState>({
    ...INITIAL_STATE,
    sourceImageUrl: generatedImageUrl || "",
  })

  const setModelId = useCallback((modelId: string) => {
    setState((prev) => ({ ...prev, modelId }))
  }, [])

  const setProductName = useCallback((productName: string) => {
    setState((prev) => ({ ...prev, productName }))
  }, [])

  const setProductDescription = useCallback((productDescription: string) => {
    setState((prev) => ({ ...prev, productDescription }))
  }, [])

  const setCallToAction = useCallback((callToAction: string) => {
    setState((prev) => ({ ...prev, callToAction }))
  }, [])

  const setAdditionalPrompt = useCallback((additionalPrompt: string) => {
    setState((prev) => ({ ...prev, additionalPrompt }))
  }, [])

  const setSourceImageUrl = useCallback((sourceImageUrl: string) => {
    setState((prev) => ({ ...prev, sourceImageUrl }))
  }, [])

  const generate = useCallback(
    async (options?: Partial<GenerateVideoRequest>) => {
      if (!isConfigured) {
        setState((prev) => ({ ...prev, error: "API key não configurada" }))
        return
      }

      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      // Usa utilitário para construir o prompt
      const prompt = buildProductVideoPrompt(
        state.productName,
        state.productDescription,
        state.callToAction,
        state.additionalPrompt
      )

      try {
        // Usa o serviço para fazer a chamada à API
        const response = await videoGenerationService.generate({
          modelId: state.modelId,
          prompt,
          imageUrl: state.sourceImageUrl || generatedImageUrl || undefined,
          ...options,
        })

        if (isSuccessfulResponse(response) && response.data) {
          // Usa utilitário para extrair URL
          const videoUrl = extractOutputUrl(response.data.output)

          if (videoUrl) {
            setState((prev) => ({
              ...prev,
              isLoading: false,
              videoUrl,
              generatedAt: new Date(),
              requestId: response.data?.id || null,
            }))
            
            // Atualiza contexto global
            addToHistory({
              type: "video",
              modelId: state.modelId,
              prompt,
              outputUrl: videoUrl,
            })
          }
        } else {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: response.error || "Failed to generate video",
          }))
        }
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : "Unknown error",
        }))
      }
    },
    [isConfigured, state, generatedImageUrl, addToHistory],
  )

  const reset = useCallback(() => {
    setState(INITIAL_STATE)
  }, [])

  return {
    ...state,
    setModelId,
    setProductName,
    setProductDescription,
    setCallToAction,
    setAdditionalPrompt,
    setSourceImageUrl,
    generate,
    reset,
  }
}
