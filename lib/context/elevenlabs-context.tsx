"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { LocalStorageService } from "@/lib/utils/localStorageUtils"

interface ElevenLabsContextType {
  apiKey: string | null
  setApiKey: (key: string) => void
  clearApiKey: () => void
  isConfigured: boolean
}

const ElevenLabsContext = createContext<ElevenLabsContextType | undefined>(undefined)

const STORAGE_KEY = "elevenlabs_api_key"

export function ElevenLabsProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string | null>(() => {
    return LocalStorageService.get(STORAGE_KEY)
  })

  const setApiKey = useCallback((key: string) => {
    setApiKeyState(key)
    LocalStorageService.set(STORAGE_KEY, key)
  }, [])

  const clearApiKey = useCallback(() => {
    setApiKeyState(null)
    LocalStorageService.remove(STORAGE_KEY)
  }, [])

  const isConfigured = !!apiKey

  return (
    <ElevenLabsContext.Provider value={{ apiKey, setApiKey, clearApiKey, isConfigured }}>
      {children}
    </ElevenLabsContext.Provider>
  )
}

export function useElevenLabs() {
  const context = useContext(ElevenLabsContext)
  if (context === undefined) {
    throw new Error("useElevenLabs must be used within an ElevenLabsProvider")
  }
  return context
}
