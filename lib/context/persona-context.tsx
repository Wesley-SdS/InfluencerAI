"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { PersonaData, PersonaFilters, CreatePersonaDTO, UpdatePersonaDTO } from "@/lib/types/persona"

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface PersonaContextType {
  personas: PersonaData[]
  selectedPersona: PersonaData | null
  isLoading: boolean
  error: string | null
  pagination: PaginationInfo | null

  fetchPersonas: (filters?: PersonaFilters) => Promise<void>
  selectPersona: (persona: PersonaData | null) => void
  createPersona: (data: CreatePersonaDTO) => Promise<PersonaData>
  updatePersona: (id: string, data: UpdatePersonaDTO) => Promise<PersonaData>
  deletePersona: (id: string) => Promise<void>
  archivePersona: (id: string) => Promise<void>

  getBasePrompt: () => string | null
  hasSelectedPersona: boolean
}

const PersonaContext = createContext<PersonaContextType | undefined>(undefined)

export function PersonaProvider({ children }: { children: ReactNode }) {
  const [personas, setPersonas] = useState<PersonaData[]>([])
  const [selectedPersona, setSelectedPersona] = useState<PersonaData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)

  const fetchPersonas = useCallback(async (filters?: PersonaFilters) => {
    setIsLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            params.set(key, String(value))
          }
        })
      }

      const res = await fetch(`/api/personas?${params.toString()}`)
      const json = await res.json()

      if (!json.success) throw new Error(json.error)

      setPersonas(json.data.personas)
      setPagination(json.data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar personas')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const selectPersona = useCallback((persona: PersonaData | null) => {
    setSelectedPersona(persona)
  }, [])

  const createPersona = useCallback(async (data: CreatePersonaDTO): Promise<PersonaData> => {
    console.log('=== CREATING PERSONA ===')
    console.log('Data being sent:', JSON.stringify(data, null, 2))

    const res = await fetch('/api/personas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json()

    console.log('API Response status:', res.status)
    console.log('API Response:', JSON.stringify(json, null, 2))

    if (!json.success) {
      // Log validation details if available
      if (json.details) {
        console.error('=== VALIDATION ERRORS ===')
        json.details.forEach((err: any, idx: number) => {
          console.error(`Error ${idx + 1}:`, {
            path: err.path,
            message: err.message,
            code: err.code,
            received: err.received,
          })
        })
      }
      throw new Error(json.error)
    }

    setPersonas((prev) => [json.data, ...prev])
    return json.data
  }, [])

  const updatePersona = useCallback(async (id: string, data: UpdatePersonaDTO): Promise<PersonaData> => {
    const res = await fetch(`/api/personas/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!json.success) throw new Error(json.error)

    setPersonas((prev) => prev.map((p) => (p.id === id ? json.data : p)))
    if (selectedPersona?.id === id) setSelectedPersona(json.data)
    return json.data
  }, [selectedPersona])

  const deletePersona = useCallback(async (id: string) => {
    const res = await fetch(`/api/personas/${id}`, { method: 'DELETE' })
    const json = await res.json()
    if (!json.success) throw new Error(json.error)

    setPersonas((prev) => prev.filter((p) => p.id !== id))
    if (selectedPersona?.id === id) setSelectedPersona(null)
  }, [selectedPersona])

  const archivePersona = useCallback(async (id: string) => {
    const res = await fetch(`/api/personas/${id}/archive`, { method: 'PATCH' })
    const json = await res.json()
    if (!json.success) throw new Error(json.error)

    setPersonas((prev) => prev.map((p) => (p.id === id ? json.data : p)))
    if (selectedPersona?.id === id) setSelectedPersona(json.data)
  }, [selectedPersona])

  const getBasePrompt = useCallback(() => {
    return selectedPersona?.basePrompt ?? null
  }, [selectedPersona])

  return (
    <PersonaContext.Provider
      value={{
        personas,
        selectedPersona,
        isLoading,
        error,
        pagination,
        fetchPersonas,
        selectPersona,
        createPersona,
        updatePersona,
        deletePersona,
        archivePersona,
        getBasePrompt,
        hasSelectedPersona: !!selectedPersona,
      }}
    >
      {children}
    </PersonaContext.Provider>
  )
}

export function usePersona() {
  const context = useContext(PersonaContext)
  if (context === undefined) {
    throw new Error("usePersona must be used within a PersonaProvider")
  }
  return context
}
