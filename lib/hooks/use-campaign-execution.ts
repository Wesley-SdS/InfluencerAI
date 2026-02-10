"use client"

import { useState, useCallback } from "react"
import { campaignApiService } from "@/lib/services/CampaignApiService"
import type { CampaignData, ExecuteCampaignOptions, ExecutionStep } from "@/lib/types/campaign"

export function useCampaignExecution() {
  const [isExecuting, setIsExecuting] = useState(false)
  const [result, setResult] = useState<CampaignData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState<ExecutionStep | null>(null)

  const execute = useCallback(async (campaignId: string, options?: ExecuteCampaignOptions) => {
    setIsExecuting(true)
    setError(null)
    setResult(null)
    setCurrentStep('image')

    try {
      const response = await campaignApiService.executeCampaign(campaignId, options)

      if (response.success && response.data) {
        setResult(response.data)
        return response.data
      } else {
        setError(response.error || "Erro ao executar campanha")
        return null
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao executar campanha"
      setError(message)
      return null
    } finally {
      setIsExecuting(false)
      setCurrentStep(null)
    }
  }, [])

  const duplicate = useCallback(async (campaignId: string) => {
    try {
      const response = await campaignApiService.duplicateCampaign(campaignId)
      if (response.success && response.data) {
        return response.data
      } else {
        setError(response.error || "Erro ao duplicar campanha")
        return null
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao duplicar campanha"
      setError(message)
      return null
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return {
    isExecuting,
    result,
    error,
    currentStep,
    execute,
    duplicate,
    clearError,
  }
}
