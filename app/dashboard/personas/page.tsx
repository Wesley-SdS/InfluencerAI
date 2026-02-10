"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { PersonaCard } from "@/components/personas/persona-card"
import { PersonaFilters } from "@/components/personas/persona-filters"
import { EmptyPersonaState } from "@/components/personas/empty-persona-state"
import { usePersona } from "@/lib/context/persona-context"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

export default function PersonasPage() {
  const { personas, isLoading, pagination, fetchPersonas, archivePersona, deletePersona } = usePersona()

  const [search, setSearch] = useState("")
  const [niche, setNiche] = useState("all")
  const [platform, setPlatform] = useState("all")
  const [showArchived, setShowArchived] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const loadPersonas = useCallback(() => {
    const filters: Record<string, unknown> = {}
    if (search) filters.search = search
    if (niche !== "all") filters.niche = niche
    if (platform !== "all") filters.targetPlatform = platform
    if (showArchived) filters.isArchived = true
    else filters.isArchived = false

    fetchPersonas(filters)
  }, [search, niche, platform, showArchived, fetchPersonas])

  useEffect(() => {
    const timer = setTimeout(loadPersonas, 300)
    return () => clearTimeout(timer)
  }, [loadPersonas])

  const handleArchive = async (id: string) => {
    try {
      await archivePersona(id)
      toast.success("Persona atualizada")
      loadPersonas()
    } catch {
      toast.error("Erro ao arquivar persona")
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deletePersona(deleteId)
      toast.success("Persona deletada com sucesso")
      setDeleteId(null)
    } catch {
      toast.error("Erro ao deletar persona")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Minhas Personas</h1>
          <p className="text-muted-foreground">
            Gerencie seus influenciadores virtuais
          </p>
        </div>
        <div className="flex items-center gap-3">
          {pagination && (
            <Badge variant="secondary">{pagination.total} personas</Badge>
          )}
          <Button asChild>
            <Link href="/dashboard/personas/new">
              <Plus className="h-4 w-4 mr-2" />
              Nova Persona
            </Link>
          </Button>
        </div>
      </div>

      <PersonaFilters
        search={search}
        niche={niche}
        platform={platform}
        showArchived={showArchived}
        onSearchChange={setSearch}
        onNicheChange={setNiche}
        onPlatformChange={setPlatform}
        onShowArchivedChange={setShowArchived}
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : personas.length === 0 ? (
        <EmptyPersonaState />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {personas.map((persona) => (
            <PersonaCard
              key={persona.id}
              persona={persona}
              onArchive={handleArchive}
              onDelete={setDeleteId}
            />
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar persona?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Todos os assets e gerações associadas serão removidos permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
