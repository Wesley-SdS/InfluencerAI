"use client"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import type { VoiceSettings } from "@/lib/types/voice"
import { DEFAULT_VOICE_SETTINGS } from "@/lib/types/voice"

interface VoiceSettingsFormProps {
  settings: VoiceSettings
  onChange: (settings: VoiceSettings) => void
  disabled?: boolean
}

export function VoiceSettingsForm({ settings, onChange, disabled = false }: VoiceSettingsFormProps) {
  const update = (key: keyof VoiceSettings, value: number | boolean) => {
    onChange({ ...settings, [key]: value })
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm">Estabilidade</Label>
          <span className="text-xs text-muted-foreground tabular-nums">
            {settings.stability.toFixed(2)}
          </span>
        </div>
        <Slider
          value={[settings.stability]}
          onValueChange={([v]) => update("stability", v)}
          min={0}
          max={1}
          step={0.05}
          disabled={disabled}
        />
        <p className="text-xs text-muted-foreground">
          Maior estabilidade = voz mais consistente. Menor = mais expressiva.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm">Similaridade</Label>
          <span className="text-xs text-muted-foreground tabular-nums">
            {settings.similarity_boost.toFixed(2)}
          </span>
        </div>
        <Slider
          value={[settings.similarity_boost]}
          onValueChange={([v]) => update("similarity_boost", v)}
          min={0}
          max={1}
          step={0.05}
          disabled={disabled}
        />
        <p className="text-xs text-muted-foreground">
          Maior valor = mais próxima da voz original.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm">Estilo</Label>
          <span className="text-xs text-muted-foreground tabular-nums">
            {settings.style.toFixed(2)}
          </span>
        </div>
        <Slider
          value={[settings.style]}
          onValueChange={([v]) => update("style", v)}
          min={0}
          max={1}
          step={0.05}
          disabled={disabled}
        />
        <p className="text-xs text-muted-foreground">
          Exagero de estilo. Valores altos podem distorcer a voz.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="text-sm">Speaker Boost</Label>
          <p className="text-xs text-muted-foreground">
            Melhora a clareza e presença da voz
          </p>
        </div>
        <Switch
          checked={settings.use_speaker_boost}
          onCheckedChange={(v) => update("use_speaker_boost", v)}
          disabled={disabled}
        />
      </div>

      <button
        type="button"
        className="text-xs text-primary hover:underline"
        onClick={() => onChange(DEFAULT_VOICE_SETTINGS)}
        disabled={disabled}
      >
        Restaurar padrões
      </button>
    </div>
  )
}
