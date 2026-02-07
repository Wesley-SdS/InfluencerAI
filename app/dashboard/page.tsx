"use client"

import { ImageIcon, VideoIcon, Sparkles } from "lucide-react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { WorkflowSteps } from "@/components/dashboard/workflow-steps"
import { RecentGenerations } from "@/components/dashboard/recent-generations"
import { useGeneration } from "@/lib/context/generation-context"
import { useReplicate } from "@/lib/context/replicate-context"

export default function DashboardPage() {
  const { history } = useGeneration()
  const { isConfigured } = useReplicate()

  const imageCount = history.filter((item) => item.type === "image").length
  const videoCount = history.filter((item) => item.type === "video").length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Painel</h1>
        <p className="text-muted-foreground">Crie e gerencie seus influenciadores digitais com IA</p>
      </div>

      {!isConfigured && (
        <div className="rounded-lg border border-primary/50 bg-primary/5 p-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Começar</p>
              <p className="text-sm text-muted-foreground">
                Configure sua chave de API do Replicate em Configurações para começar a gerar conteúdo
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Imagens Geradas"
          value={imageCount}
          description="Total de imagens de influenciadores"
          icon={ImageIcon}
        />
        <StatsCard
          title="Vídeos Criados"
          value={videoCount}
          description="Total de vídeos promocionais"
          icon={VideoIcon}
        />
        <StatsCard
          title="Status da API"
          value={isConfigured ? "Conectado" : "Não Configurado"}
          description="Conexão com API Replicate"
          icon={Sparkles}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <WorkflowSteps />
        <QuickActions />
      </div>

      <RecentGenerations />
    </div>
  )
}
