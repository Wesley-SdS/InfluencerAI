"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useReplicate } from "@/lib/context/replicate-context"
import { type AIModel, IMAGE_MODELS, VIDEO_MODELS } from "@/lib/types/models"

interface UseReplicateModelsOptions {
  type: "image" | "video"
}

interface UseReplicateModelsReturn {
  models: AIModel[]
  isLoading: boolean
  error: string | null
  searchModels: (query: string) => Promise<void>
  refetch: () => Promise<void>
  totalCount: number
}

export function useReplicateModels({ type }: UseReplicateModelsOptions): UseReplicateModelsReturn {
  const { apiKey } = useReplicate()
  const fallback = type === "image" ? IMAGE_MODELS : VIDEO_MODELS
  const [models, setModels] = useState<AIModel[]>(fallback)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(fallback.length)
  const hasFetched = useRef(false)

  const fetchModels = useCallback(
    async (query?: string) => {
      if (!apiKey) {
        setModels(fallback)
        setTotalCount(fallback.length)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams({ type })
        if (query) params.set("query", query)

        const response = await fetch(`/api/replicate/models?${params}`, {
          headers: {
            "x-replicate-api-key": apiKey,
          },
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Erro ao buscar modelos")
        }

        if (data.data?.models?.length > 0) {
          setModels(data.data.models)
          setTotalCount(data.data.total || data.data.models.length)
        } else {
          setModels(fallback)
          setTotalCount(fallback.length)
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erro ao buscar modelos"
        setError(message)
        setModels(fallback)
        setTotalCount(fallback.length)
      } finally {
        setIsLoading(false)
      }
    },
    [apiKey, type, fallback],
  )

  const searchModels = useCallback(
    async (query: string) => {
      await fetchModels(query)
    },
    [fetchModels],
  )

  const refetch = useCallback(async () => {
    hasFetched.current = false
    await fetchModels()
  }, [fetchModels])

  useEffect(() => {
    if (!hasFetched.current && apiKey) {
      hasFetched.current = true
      fetchModels()
    }
  }, [fetchModels, apiKey])

  return { models, isLoading, error, searchModels, refetch, totalCount }
}
