"use client"

import { AboutSettings } from "@/components/settings/about-settings"
import { AppearanceSettings } from "@/components/settings/appearance-settings"
import { DataManagementSettings } from "@/components/settings/data-management-settings"
import { PromptRefinerSettings } from "@/components/settings/prompt-refiner-settings"
import { ReplicateApiSettings } from "@/components/settings/replicate-api-settings"

/**
 * Página de Configurações
 * Princípio: Single Responsibility Principle (SRP) refatorado
 * Responsabilidade: apenas composição de componentes de configuração
 * Todas as responsabilidades específicas foram extraídas para componentes individuais
 */
export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">Configure suas preferências do InfluencerAI</p>
      </div>

      <div className="grid gap-6">
        <ReplicateApiSettings />
        <PromptRefinerSettings />
        <AppearanceSettings />
        <DataManagementSettings />
        <AboutSettings />
      </div>
    </div>
  )
}
