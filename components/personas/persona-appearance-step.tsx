"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PERSONA_BODY_TYPES } from "@/lib/types/persona"
import type { CreatePersonaDTO } from "@/lib/types/persona"
import { BasePromptPreview } from "./base-prompt-preview"
import { PromptBuilderService } from "@/lib/services/prompt-builder-service"

interface PersonaAppearanceStepProps {
  data: CreatePersonaDTO
  onChange: (data: Partial<CreatePersonaDTO>) => void
}

const EYE_COLORS = [
  { value: "brown", label: "Castanhos" },
  { value: "blue", label: "Azuis" },
  { value: "green", label: "Verdes" },
  { value: "hazel", label: "Avelã" },
  { value: "gray", label: "Cinza" },
  { value: "amber", label: "Âmbar" },
  { value: "black", label: "Pretos" },
]

const HAIR_COLORS = [
  { value: "black", label: "Preto" },
  { value: "dark brown", label: "Castanho escuro" },
  { value: "brown", label: "Castanho" },
  { value: "light brown", label: "Castanho claro" },
  { value: "blonde", label: "Loiro" },
  { value: "platinum blonde", label: "Platinado" },
  { value: "red", label: "Ruivo" },
  { value: "auburn", label: "Acobreado" },
  { value: "gray", label: "Grisalho" },
  { value: "white", label: "Branco" },
]

export function PersonaAppearanceStep({ data, onChange }: PersonaAppearanceStepProps) {
  const basePrompt = PromptBuilderService.buildBasePrompt(data)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ethnicity">Etnia</Label>
          <Input
            id="ethnicity"
            placeholder="Ex: Brazilian, Asian, European"
            value={data.ethnicity || ""}
            onChange={(e) => onChange({ ethnicity: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Tipo de Corpo</Label>
          <Select value={data.bodyType || ""} onValueChange={(v) => onChange({ bodyType: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecionar" />
            </SelectTrigger>
            <SelectContent>
              {PERSONA_BODY_TYPES.map((b) => (
                <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Cor do Cabelo</Label>
          <Select value={data.hairColor || ""} onValueChange={(v) => onChange({ hairColor: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecionar" />
            </SelectTrigger>
            <SelectContent>
              {HAIR_COLORS.map((h) => (
                <SelectItem key={h.value} value={h.value}>{h.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="hairStyle">Estilo do Cabelo</Label>
          <Input
            id="hairStyle"
            placeholder="Ex: long straight, short curly"
            value={data.hairStyle || ""}
            onChange={(e) => onChange({ hairStyle: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Cor dos Olhos</Label>
        <Select value={data.eyeColor || ""} onValueChange={(v) => onChange({ eyeColor: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Selecionar" />
          </SelectTrigger>
          <SelectContent>
            {EYE_COLORS.map((e) => (
              <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="distinctiveFeatures">Características Marcantes</Label>
        <Textarea
          id="distinctiveFeatures"
          placeholder="Tatuagens, piercings, cicatrizes, sardas..."
          value={data.distinctiveFeatures || ""}
          onChange={(e) => onChange({ distinctiveFeatures: e.target.value })}
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="styleDescription">Descrição Geral do Estilo</Label>
        <Textarea
          id="styleDescription"
          placeholder="Moda casual moderna, maquiagem natural, estilo streetwear..."
          value={data.styleDescription || ""}
          onChange={(e) => onChange({ styleDescription: e.target.value })}
          rows={2}
        />
      </div>

      <BasePromptPreview prompt={basePrompt} />
    </div>
  )
}
