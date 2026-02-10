"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, Mic, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { VoicePlayer } from "./voice-player"
import { useVoice } from "@/lib/hooks/use-voice"
import type { ElevenLabsVoice } from "@/lib/types/voice"

interface VoiceSelectorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (voice: ElevenLabsVoice) => void
  currentVoiceId?: string | null
}

export function VoiceSelectorModal({
  open,
  onOpenChange,
  onSelect,
  currentVoiceId,
}: VoiceSelectorModalProps) {
  const { voices, isLoading, error, loadVoices } = useVoice()
  const [search, setSearch] = useState("")
  const [selectedVoice, setSelectedVoice] = useState<ElevenLabsVoice | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)

  useEffect(() => {
    if (open && voices.length === 0) {
      loadVoices()
    }
  }, [open, voices.length, loadVoices])

  const categories = useMemo(() => {
    const cats = new Set<string>()
    voices.forEach((v) => cats.add(v.category))
    return Array.from(cats).sort()
  }, [voices])

  const filteredVoices = useMemo(() => {
    return voices.filter((v) => {
      const matchesSearch =
        !search ||
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        (v.description && v.description.toLowerCase().includes(search.toLowerCase()))
      const matchesCategory = !categoryFilter || v.category === categoryFilter
      return matchesSearch && matchesCategory
    })
  }, [voices, search, categoryFilter])

  const handleConfirm = () => {
    if (selectedVoice) {
      onSelect(selectedVoice)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Selecionar Voz
          </DialogTitle>
          <DialogDescription>
            Escolha uma voz do ElevenLabs para sua persona
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar vozes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {categories.length > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              <Badge
                variant={categoryFilter === null ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setCategoryFilter(null)}
              >
                Todas
              </Badge>
              {categories.map((cat) => (
                <Badge
                  key={cat}
                  variant={categoryFilter === cat ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setCategoryFilter(cat === categoryFilter ? null : cat)}
                >
                  {cat}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 -mx-6 px-6">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-muted-foreground">Carregando vozes...</p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <p className="text-sm text-destructive">{error}</p>
              <Button variant="outline" size="sm" onClick={loadVoices}>
                Tentar novamente
              </Button>
            </div>
          )}

          {!isLoading && !error && filteredVoices.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-muted-foreground">Nenhuma voz encontrada</p>
            </div>
          )}

          {!isLoading && !error && (
            <div className="space-y-1">
              {filteredVoices.map((voice) => {
                const isSelected = selectedVoice?.voice_id === voice.voice_id
                const isCurrent = currentVoiceId === voice.voice_id

                return (
                  <button
                    key={voice.voice_id}
                    type="button"
                    className={`w-full text-left rounded-lg border p-3 transition-colors ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-transparent hover:bg-accent"
                    }`}
                    onClick={() => setSelectedVoice(voice)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{voice.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {voice.category}
                          </Badge>
                          {isCurrent && (
                            <Badge variant="outline" className="text-xs">
                              Atual
                            </Badge>
                          )}
                        </div>
                        {voice.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                            {voice.description}
                          </p>
                        )}
                        {Object.keys(voice.labels).length > 0 && (
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {Object.entries(voice.labels).slice(0, 4).map(([key, val]) => (
                              <span
                                key={key}
                                className="text-[10px] bg-muted px-1.5 py-0.5 rounded"
                              >
                                {val}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <VoicePlayer src={voice.preview_url} compact />
                        {isSelected && <Check className="h-4 w-4 text-primary" />}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedVoice}>
            Selecionar Voz
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
