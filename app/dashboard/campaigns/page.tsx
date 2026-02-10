"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { CampaignCard } from "@/components/campaigns/campaign-card"
import { CampaignFilters } from "@/components/campaigns/campaign-filters"
import { EmptyCampaignState } from "@/components/campaigns/empty-campaign-state"
import { useCampaign } from "@/lib/context/campaign-context"
import { campaignApiService } from "@/lib/services/CampaignApiService"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import type { CampaignFilters as CampaignFiltersType } from "@/lib/types/campaign"

export default function CampaignsPage() {
  const { campaigns, isLoading, pagination, fetchCampaigns, deleteCampaign } = useCampaign()

  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const loadCampaigns = useCallback(() => {
    const filters: CampaignFiltersType = {}
    if (search) filters.search = search
    if (status !== "all") filters.status = status as CampaignFiltersType["status"]

    fetchCampaigns(filters)
  }, [search, status, fetchCampaigns])

  useEffect(() => {
    const timer = setTimeout(loadCampaigns, 300)
    return () => clearTimeout(timer)
  }, [loadCampaigns])

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteCampaign(deleteId)
      toast.success("Campanha deletada com sucesso")
      setDeleteId(null)
    } catch {
      toast.error("Erro ao deletar campanha")
    }
  }

  const handleDuplicate = async (id: string) => {
    try {
      const res = await campaignApiService.duplicateCampaign(id)
      if (res.success) {
        toast.success("Campanha duplicada com sucesso")
        loadCampaigns()
      } else {
        toast.error(res.error || "Erro ao duplicar")
      }
    } catch {
      toast.error("Erro ao duplicar campanha")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campanhas</h1>
          <p className="text-muted-foreground">
            Gerencie suas campanhas de conteúdo
          </p>
        </div>
        <div className="flex items-center gap-3">
          {pagination && (
            <Badge variant="secondary">{pagination.total} campanhas</Badge>
          )}
          <Button asChild>
            <Link href="/dashboard/campaigns/new">
              <Plus className="h-4 w-4 mr-2" />
              Nova Campanha
            </Link>
          </Button>
        </div>
      </div>

      <CampaignFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        disabled={isLoading}
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <EmptyCampaignState />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onDelete={setDeleteId}
              onDuplicate={handleDuplicate}
            />
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar campanha?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Todos os conteúdos gerados serão removidos permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
