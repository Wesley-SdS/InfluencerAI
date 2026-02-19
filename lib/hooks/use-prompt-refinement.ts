"use client"

import { useGoogle } from "@/lib/context/google-context"
import { useLLM } from "@/lib/context/llm-context"
import { useOpenAI } from "@/lib/context/openai-context"

/**
 * Hook composto para facilitar acesso a capacidade de refinamento
 * Princípio: Facade Pattern
 * Responsabilidade: fornecer interface simplificada para verificar capacidade de refinamento
 */
export function usePromptRefinement() {
  const { isConfigured: openaiConfigured } = useOpenAI()
  const { isConfigured: googleConfigured } = useGoogle()
  const { selectedModel } = useLLM()

  // Pode refinar se tiver a chave do provider do modelo selecionado
  const canRefine = selectedModel.provider === "openai" ? openaiConfigured : googleConfigured

  return {
    canRefine,
    activeProvider: selectedModel.provider,
    selectedModel,
  }
}
