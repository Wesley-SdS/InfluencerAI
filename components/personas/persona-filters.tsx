"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { PERSONA_NICHES, PERSONA_PLATFORMS } from "@/lib/types/persona"

interface PersonaFiltersProps {
  search: string
  niche: string
  platform: string
  showArchived: boolean
  onSearchChange: (value: string) => void
  onNicheChange: (value: string) => void
  onPlatformChange: (value: string) => void
  onShowArchivedChange: (value: boolean) => void
}

export function PersonaFilters({
  search,
  niche,
  platform,
  showArchived,
  onSearchChange,
  onNicheChange,
  onPlatformChange,
  onShowArchivedChange,
}: PersonaFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select value={niche} onValueChange={onNicheChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Nicho" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os nichos</SelectItem>
          {PERSONA_NICHES.map((n) => (
            <SelectItem key={n.value} value={n.value}>{n.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={platform} onValueChange={onPlatformChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Plataforma" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas</SelectItem>
          {PERSONA_PLATFORMS.map((p) => (
            <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2">
        <Switch
          id="show-archived"
          checked={showArchived}
          onCheckedChange={onShowArchivedChange}
        />
        <Label htmlFor="show-archived" className="text-sm whitespace-nowrap">
          Arquivadas
        </Label>
      </div>
    </div>
  )
}
