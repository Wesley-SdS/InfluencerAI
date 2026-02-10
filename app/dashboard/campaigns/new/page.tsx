"use client"

import { useSearchParams } from "next/navigation"
import { CampaignWizard } from "@/components/campaigns/campaign-wizard"

export default function NewCampaignPage() {
  const searchParams = useSearchParams()
  const personaId = searchParams.get("personaId") || undefined
  const templateId = searchParams.get("templateId") || undefined

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nova Campanha</h1>
        <p className="text-muted-foreground">
          Crie uma campanha de conteúdo usando um template e uma persona
        </p>
      </div>

      <CampaignWizard initialPersonaId={personaId} initialTemplateId={templateId} />
    </div>
  )
}
