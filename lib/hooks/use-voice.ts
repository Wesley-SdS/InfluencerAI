"use client"

import { useState, useCallback } from "react"
import { voiceApiService } from "@/lib/services/VoiceApiService"
import type { ElevenLabsVoice, VoiceSettings } from "@/lib/types/voice"

export function useVoice() {
  const [voices, setVoices] = useState<ElevenLabsVoice[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadVoices = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await voiceApiService.listVoices()
      if (response.success && response.data) {
        setVoices(response.data.voices)
      } else {
        setError(response.error || "Falha ao carregar vozes")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar vozes")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const assignToPersona = useCallback(async (
    personaId: string,
    voice: ElevenLabsVoice,
    settings?: VoiceSettings
  ) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await voiceApiService.assignVoice(personaId, {
        voiceProvider: "elevenlabs",
        voiceId: voice.voice_id,
        voiceName: voice.name,
        voicePreviewUrl: voice.preview_url,
        voiceSettings: settings,
      })
      if (!response.success) {
        throw new Error(response.error || "Falha ao configurar voz")
      }
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao configurar voz")
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const removeFromPersona = useCallback(async (personaId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await voiceApiService.removeVoice(personaId)
      if (!response.success) {
        throw new Error(response.error || "Falha ao remover voz")
      }
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao remover voz")
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const generateSpeech = useCallback(async (personaId: string, text: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await voiceApiService.generateSpeech({ personaId, text })
      if (response.success && response.data) {
        return response.data
      }
      throw new Error(response.error || "Falha ao gerar áudio")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar áudio")
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return {
    voices,
    isLoading,
    error,
    clearError,
    loadVoices,
    assignToPersona,
    removeFromPersona,
    generateSpeech,
  }
}
