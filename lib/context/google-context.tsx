"use client"

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"

interface GoogleContextType {
  isConfigured: boolean
  isLoading: boolean
  saveApiKey: (key: string) => Promise<boolean>
  clearApiKey: () => Promise<void>
}

const GoogleContext = createContext<GoogleContextType | undefined>(undefined)

export function GoogleProvider({ children }: { children: ReactNode }) {
  const [isConfigured, setIsConfigured] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/user/api-keys')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setIsConfigured(data.data.some((k: { provider: string }) => k.provider === 'google'))
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
        body: JSON.stringify({ provider: 'google', apiKey: key }),
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
        const key = data.data.find((k: { provider: string }) => k.provider === 'google')
        if (key) await fetch(`/api/user/api-keys/${key.id}`, { method: 'DELETE' })
      }
    } catch (error) {
      console.error('Error deleting Google API key:', error)
    }
    setIsConfigured(false)
  }, [])

  // Clean up legacy localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("google_api_key")
    }
  }, [])

  return (
    <GoogleContext.Provider value={{ isConfigured, isLoading, saveApiKey, clearApiKey }}>
      {children}
    </GoogleContext.Provider>
  )
}

export function useGoogle() {
  const context = useContext(GoogleContext)
  if (context === undefined) {
    throw new Error("useGoogle must be used within a GoogleProvider")
  }
  return context
}
