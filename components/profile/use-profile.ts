"use client"

import { useState, useCallback } from "react"
import { useSession } from "next-auth/react"

export interface UserProfile {
  id: string
  name: string | null
  email: string
  image: string | null
  emailVerified: string | null
  createdAt: string
  updatedAt: string
}

export interface UpdateProfileData {
  name?: string
  image?: string
}

export interface UseProfileReturn {
  profile: UserProfile | null
  loading: boolean
  saving: boolean
  error: string | null
  fetchProfile: () => Promise<void>
  updateProfile: (data: UpdateProfileData) => Promise<boolean>
}

export function useProfile(): UseProfileReturn {
  const { update: updateSession } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/user/profile")
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error ?? "Erro ao carregar perfil")
      setProfile(json.data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateProfile = useCallback(
    async (data: UpdateProfileData): Promise<boolean> => {
      setSaving(true)
      setError(null)
      try {
        const res = await fetch("/api/user/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
        const json = await res.json()
        if (!res.ok || !json.success) throw new Error(json.error ?? "Erro ao salvar perfil")
        setProfile(json.data)
        // Sync NextAuth session so header avatar/name updates immediately
        await updateSession({ name: json.data.name, image: json.data.image })
        return true
      } catch (err: any) {
        setError(err.message)
        return false
      } finally {
        setSaving(false)
      }
    },
    [updateSession]
  )

  return { profile, loading, saving, error, fetchProfile, updateProfile }
}
