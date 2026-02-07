"use client"

import { useGeneration } from "@/lib/context/generation-context"
import { useReplicate } from "@/lib/context/replicate-context"
import { imageGenerationService } from "@/lib/services/ImageGenerationService"
import type { ImageGenerationState } from "@/lib/types/generation"
import type { GenerateImageRequest } from "@/lib/types/replicate"
import { extractOutputUrl, isSuccessfulResponse } from "@/lib/utils/replicateUtils"
import { useCallback, useState } from "react"

const INITIAL_STATE: ImageGenerationState = {
  modelId: "black-forest-labs/flux-schnell",
  prompt: "",
  isLoading: false,
  imageUrl: null,
  error: null,
  generatedAt: null,
  requestId: null,
}

/**
 * Hook para geração de imagens
 * Princípio: Single Responsibility Principle (SRP) refatorado
 * Responsabilidades reduzidas:
 * - Gerenciamento de estado local de UI
 * - Orquestração entre service e contextos
 * Responsabilidades extraídas:
 * - Chamadas de API → ImageGenerationService
 * - Transformação de dados → replicateUtils
 */
export function useImageGeneration() {
  const { apiKey } = useReplicate()
  const { setGeneratedImageUrl, addToHistory } = useGeneration()
  const [state, setState] = useState<ImageGenerationState>(INITIAL_STATE)

  const setModelId = useCallback((modelId: string) => {
    setState((prev) => ({ ...prev, modelId }))
  }, [])

  const setPrompt = useCallback((prompt: string) => {
    setState((prev) => ({ ...prev, prompt }))
  }, [])

  const generate = useCallback(
    async (options?: Partial<GenerateImageRequest>) => {
      if (!apiKey) {
        setState((prev) => ({ ...prev, error: "API key not configured" }))
        return
      }

      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      try {
        // Usa o serviço para fazer a chamada à API
        const response = await imageGenerationService.generate({
          modelId: state.modelId,
          prompt: state.prompt,
          apiKey,
          ...options,
        })

        if (isSuccessfulResponse(response) && response.data) {
          // Usa utilitário para extrair URL
          const imageUrl = extractOutputUrl(response.data.output)

          if (imageUrl) {
            setState((prev) => ({
              ...prev,
              isLoading: false,
              imageUrl,
              generatedAt: new Date(),
              requestId: response.data?.id || null,
            }))
            
            // Atualiza contextos globais
            setGeneratedImageUrl(imageUrl)
            addToHistory({
              type: "image",
              modelId: state.modelId,
              prompt: state.prompt,
              outputUrl: imageUrl,
            })
          }
        } else {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: response.error || "Failed to generate image",
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
    [apiKey, state.modelId, state.prompt, setGeneratedImageUrl, addToHistory],
  )

  const reset = useCallback(() => {
    setState(INITIAL_STATE)
  }, [])

  return {
    ...state,
    setModelId,
    setPrompt,
    generate,
    reset,
  }
}
