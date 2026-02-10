"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { PersonaData } from "@/lib/types/persona"
import {
  PERSONA_GENDERS,
  PERSONA_AGE_RANGES,
  PERSONA_BODY_TYPES,
} from "@/lib/types/persona"

interface PersonaInfoCardProps {
  persona: PersonaData
}

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null
  return (
    <div className="flex justify-between py-1.5 border-b border-border/50 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}

export function PersonaInfoCard({ persona }: PersonaInfoCardProps) {
  const genderLabel = PERSONA_GENDERS.find((g) => g.value === persona.gender)?.label
  const ageLabel = PERSONA_AGE_RANGES.find((a) => a.value === persona.ageRange)?.label
  const bodyLabel = PERSONA_BODY_TYPES.find((b) => b.value === persona.bodyType)?.label

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Informações</CardTitle>
      </CardHeader>
      <CardContent className="space-y-0">
        <InfoRow label="Gênero" value={genderLabel} />
        <InfoRow label="Faixa Etária" value={ageLabel} />
        <InfoRow label="Etnia" value={persona.ethnicity} />
        <InfoRow label="Tipo de Corpo" value={bodyLabel} />
        <InfoRow label="Cor do Cabelo" value={persona.hairColor} />
        <InfoRow label="Estilo do Cabelo" value={persona.hairStyle} />
        <InfoRow label="Cor dos Olhos" value={persona.eyeColor} />
        {persona.distinctiveFeatures && (
          <div className="py-1.5 border-b border-border/50">
            <span className="text-sm text-muted-foreground">Características</span>
            <p className="text-sm mt-1">{persona.distinctiveFeatures}</p>
          </div>
        )}
        {persona.styleDescription && (
          <div className="py-1.5">
            <span className="text-sm text-muted-foreground">Estilo</span>
            <p className="text-sm mt-1">{persona.styleDescription}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
