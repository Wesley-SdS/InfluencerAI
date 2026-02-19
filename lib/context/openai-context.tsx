"use client"

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"

interface OpenAIContextType {
  isConfigured: boolean
  isLoading: boolean
  saveApiKey: (key: string) => Promise<boolean>
  clearApiKey: () => Promise<void>
}

const OpenAIContext = createContext<OpenAIContextType | undefined>(undefined)

export function OpenAIProvider({ children }: { children: ReactNode }) {
  const [isConfigured, setIsConfigured] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/user/api-keys')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setIsConfigured(data.data.some((k: { provider: string }) => k.provider === 'openai'))
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  const saveApiKey = useCallback(async (key: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/user/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'openai', apiKey: key }),
      })
      if (!res.ok) return false
      setIsConfigured(true)
      return true
    } catch {
      return false
    }
  }, [])

  const clearApiKey = useCallback(async () => {
    try {
      const res = await fetch('/api/user/api-keys')
      const data = await res.json()
      if (data.success && data.data) {
        const key = data.data.find((k: { provider: string }) => k.provider === 'openai')
        if (key) await fetch(`/api/user/api-keys/${key.id}`, { method: 'DELETE' })
      }
    } catch (error) {
      console.error('Error deleting OpenAI API key:', error)
    }
    setIsConfigured(false)
  }, [])

  // Clean up legacy localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("openai_api_key")
    }
  }, [])

  return (
    <OpenAIContext.Provider value={{ isConfigured, isLoading, saveApiKey, clearApiKey }}>
      {children}
    </OpenAIContext.Provider>
  )
}

export function useOpenAI() {
  const context = useContext(OpenAIContext)
  if (context === undefined) {
    throw new Error("useOpenAI must be used within an OpenAIProvider")
  }
  return context
}
