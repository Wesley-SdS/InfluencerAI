"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { FACE_CONSISTENCY_STRATEGY_LIST } from "@/lib/constants/face-consistency"
import type { FaceConsistencyStrategyName } from "@/lib/types/face-consistency"

interface FaceConsistencyControlsProps {
  enabled: boolean
  onEnabledChange: (enabled: boolean) => void
  strategy: FaceConsistencyStrategyName
  onStrategyChange: (strategy: FaceConsistencyStrategyName) => void
  strength: number
  onStrengthChange: (strength: number) => void
  hasReferenceImage: boolean
  referenceImageUrl?: string | null
  disabled?: boolean
}

export function FaceConsistencyControls({
  enabled,
  onEnabledChange,
  strategy,
  onStrategyChange,
  strength,
  onStrengthChange,
  hasReferenceImage,
  referenceImageUrl,
  disabled = false,
}: FaceConsistencyControlsProps) {
  const selectedStrategy = FACE_CONSISTENCY_STRATEGY_LIST.find((s) => s.name === strategy)
  const canEnable = hasReferenceImage && !disabled

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">Consistência Facial</Label>
          {enabled && <Badge variant="secondary" className="text-xs">Ativo</Badge>}
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={onEnabledChange}
          disabled={!canEnable}
        />
      </div>

      {!hasReferenceImage && (
        <p className="text-xs text-muted-foreground">
          Adicione uma imagem de referência à persona para usar consistência facial.
        </p>
      )}

      {enabled && hasReferenceImage && (
        <div className="space-y-4 rounded-lg border p-3">
          {referenceImageUrl && (
            <div className="flex items-center gap-3">
              <img
                src={referenceImageUrl}
                alt="Referência"
                className="h-12 w-12 rounded-lg object-cover"
              />
              <p className="text-xs text-muted-foreground">Imagem de referência da persona</p>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-xs">Estratégia</Label>
            <Select
              value={strategy}
              onValueChange={(v) => onStrategyChange(v as FaceConsistencyStrategyName)}
              disabled={disabled}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FACE_CONSISTENCY_STRATEGY_LIST.map((s) => (
                  <SelectItem key={s.name} value={s.name}>
                    <div>
                      <span>{s.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedStrategy && (
              <p className="text-xs text-muted-foreground">{selectedStrategy.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Força</Label>
              <span className="text-xs text-muted-foreground tabular-nums">
                {strength.toFixed(selectedStrategy && selectedStrategy.strengthStep >= 1 ? 0 : 2)}
              </span>
            </div>
            <Slider
              value={[strength]}
              onValueChange={([v]) => onStrengthChange(v)}
              min={selectedStrategy?.minStrength ?? 0}
              max={selectedStrategy?.maxStrength ?? 1}
              step={selectedStrategy?.strengthStep ?? 0.05}
              disabled={disabled}
            />
          </div>
        </div>
      )}
    </div>
  )
}
