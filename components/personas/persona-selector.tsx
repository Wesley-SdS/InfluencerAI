"use client"

import { useEffect, useRef } from "react"
import { Plus, Users, X } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { usePersona } from "@/lib/context/persona-context"

export function PersonaSelector() {
  const { personas, selectedPersona, isLoading, error, fetchPersonas, selectPersona } = usePersona()
  const hasFetched = useRef(false)

  useEffect(() => {
    if (!hasFetched.current && personas.length === 0 && !isLoading) {
      hasFetched.current = true
      fetchPersonas({ isArchived: false, limit: 50 })
    }
  }, [personas.length, isLoading, fetchPersonas])

  const handleChange = (value: string) => {
    if (value === "none") {
      selectPersona(null)
      return
    }
    const persona = personas.find((p) => p.id === value)
    if (persona) selectPersona(persona)
  }

  return (
    <div className="flex items-center gap-2">
      <Users className="h-4 w-4 text-muted-foreground shrink-0" />
      <Select
        value={selectedPersona?.id || "none"}
        onValueChange={handleChange}
      >
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="Sem persona" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Sem persona (avulsa)</SelectItem>
          {personas.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              <span className="flex items-center gap-2">
                {p.referenceImageUrl ? (
                  <img
                    src={p.referenceImageUrl}
                    alt=""
                    className="h-5 w-5 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement
                      if (fallback) fallback.style.display = 'flex'
                    }}
                  />
                ) : null}
                <span className={`flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary ${p.referenceImageUrl ? 'hidden' : ''}`}>
                  {p.name.charAt(0)}
                </span>
                {p.name}
              </span>
            </SelectItem>
          ))}
          <div className="border-t mt-1 pt-1">
            <Link
              href="/dashboard/personas/new"
              className="flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Plus className="h-4 w-4" />
              Criar nova persona
            </Link>
          </div>
        </SelectContent>
      </Select>

      {selectedPersona && (
        <Badge variant="secondary" className="gap-1">
          {selectedPersona.name}
          <button onClick={() => selectPersona(null)} className="hover:text-foreground">
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}
    </div>
  )
}
