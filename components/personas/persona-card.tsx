"use client"

import Link from "next/link"
import { MoreHorizontal, Archive, Pencil, Trash2, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { PersonaData } from "@/lib/types/persona"
import { PERSONA_NICHES, PERSONA_PLATFORMS } from "@/lib/types/persona"

interface PersonaCardProps {
  persona: PersonaData
  onArchive: (id: string) => void
  onDelete: (id: string) => void
}

export function PersonaCard({ persona, onArchive, onDelete }: PersonaCardProps) {
  const nicheLabel = PERSONA_NICHES.find((n) => n.value === persona.niche)?.label
  const platformLabel = PERSONA_PLATFORMS.find((p) => p.value === persona.targetPlatform)?.label

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-md hover:border-primary/30">
      <Link href={`/dashboard/personas/${persona.id}`}>
        <div className="aspect-square relative bg-muted">
          {persona.referenceImageUrl ? (
            <img
              src={persona.referenceImageUrl}
              alt={persona.name}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                const fallback = e.currentTarget.nextElementSibling as HTMLElement
                if (fallback) fallback.style.display = 'flex'
              }}
            />
          ) : null}
          <div className={`flex h-full w-full items-center justify-center ${persona.referenceImageUrl ? 'hidden' : ''}`}>
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <span className="text-3xl font-bold text-primary">
                {persona.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          {persona.isArchived && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60">
              <Badge variant="secondary">Arquivada</Badge>
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/dashboard/personas/${persona.id}`} className="min-w-0 flex-1">
            <h3 className="font-semibold truncate">{persona.name}</h3>
            {persona.bio && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{persona.bio}</p>
            )}
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/personas/${persona.id}`}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Editar
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onArchive(persona.id)}>
                <Archive className="h-4 w-4 mr-2" />
                {persona.isArchived ? 'Desarquivar' : 'Arquivar'}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(persona.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Deletar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {nicheLabel && <Badge variant="secondary" className="text-xs">{nicheLabel}</Badge>}
          {platformLabel && <Badge variant="outline" className="text-xs">{platformLabel}</Badge>}
        </div>

        <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
          <User className="h-3 w-3" />
          <span>{persona._count.generations} {persona._count.generations === 1 ? 'geração' : 'gerações'}</span>
        </div>
      </CardContent>
    </Card>
  )
}
