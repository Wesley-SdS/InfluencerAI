"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  PERSONA_NICHES,
  PERSONA_PLATFORMS,
  PERSONA_TONES,
  PERSONA_GENDERS,
  PERSONA_AGE_RANGES,
} from "@/lib/types/persona"
import type { CreatePersonaDTO } from "@/lib/types/persona"

interface PersonaIdentityStepProps {
  data: CreatePersonaDTO
  onChange: (data: Partial<CreatePersonaDTO>) => void
}

export function PersonaIdentityStep({ data, onChange }: PersonaIdentityStepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome *</Label>
        <Input
          id="name"
          placeholder="Ex: Sofia Martinez"
          value={data.name}
          onChange={(e) => onChange({ name: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Biografia</Label>
        <Textarea
          id="bio"
          placeholder="Uma breve descrição da persona..."
          value={data.bio || ""}
          onChange={(e) => onChange({ bio: e.target.value })}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Gênero</Label>
          <Select value={data.gender || ""} onValueChange={(v) => onChange({ gender: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecionar" />
            </SelectTrigger>
            <SelectContent>
              {PERSONA_GENDERS.map((g) => (
                <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Faixa Etária</Label>
          <Select value={data.ageRange || ""} onValueChange={(v) => onChange({ ageRange: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecionar" />
            </SelectTrigger>
            <SelectContent>
              {PERSONA_AGE_RANGES.map((a) => (
                <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Nicho</Label>
          <Select value={data.niche || ""} onValueChange={(v) => onChange({ niche: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecionar nicho" />
            </SelectTrigger>
            <SelectContent>
              {PERSONA_NICHES.map((n) => (
                <SelectItem key={n.value} value={n.value}>{n.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Plataforma Alvo</Label>
          <Select value={data.targetPlatform || ""} onValueChange={(v) => onChange({ targetPlatform: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecionar plataforma" />
            </SelectTrigger>
            <SelectContent>
              {PERSONA_PLATFORMS.map((p) => (
                <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tom de Conteúdo</Label>
        <Select value={data.contentTone || ""} onValueChange={(v) => onChange({ contentTone: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Selecionar tom" />
          </SelectTrigger>
          <SelectContent>
            {PERSONA_TONES.map((t) => (
              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
