"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { VoicePlayer } from "@/components/voice/voice-player"
import type { PersonaData } from "@/lib/types/persona"

interface NarrationControlsProps {
  enabled: boolean
  onEnabledChange: (enabled: boolean) => void
  text: string
  onTextChange: (text: string) => void
  persona: PersonaData | null
  disabled?: boolean
}

const MAX_CHARS = 5000

export function NarrationControls({
  enabled,
  onEnabledChange,
  text,
  onTextChange,
  persona,
  disabled = false,
}: NarrationControlsProps) {
  const hasVoice = !!persona?.voiceId
  const canEnable = hasVoice && !disabled

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">Adicionar Narração</Label>
          {enabled && <Badge variant="secondary" className="text-xs">Ativo</Badge>}
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={onEnabledChange}
          disabled={!canEnable}
        />
      </div>

      {!hasVoice && (
        <p className="text-xs text-muted-foreground">
          Configure uma voz na persona para habilitar narração.
        </p>
      )}

      {enabled && hasVoice && (
        <div className="space-y-3 rounded-lg border p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{persona?.voiceName}</p>
              <p className="text-xs text-muted-foreground capitalize">{persona?.voiceProvider}</p>
            </div>
            <VoicePlayer src={persona?.voicePreviewUrl ?? null} compact />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Texto da Narração</Label>
            <Textarea
              value={text}
              onChange={(e) => onTextChange(e.target.value)}
              placeholder="Digite o texto que a persona irá narrar..."
              rows={3}
              disabled={disabled}
              maxLength={MAX_CHARS}
            />
            <div className="flex justify-end">
              <span className="text-xs text-muted-foreground tabular-nums">
                {text.length}/{MAX_CHARS}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
