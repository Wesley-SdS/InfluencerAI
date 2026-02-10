"use client"

import { useState } from "react"
import { Heart, Trash2, ImageIcon, VideoIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { PersonaAssetData } from "@/lib/types/persona"
import { toast } from "sonner"

interface PersonaAssetGalleryProps {
  assets: PersonaAssetData[]
  personaId: string
  onRefresh: () => void
}

export function PersonaAssetGallery({ assets, personaId, onRefresh }: PersonaAssetGalleryProps) {
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredAssets = typeFilter === "all"
    ? assets
    : assets.filter((a) => a.type === typeFilter)

  const handleToggleFavorite = async (assetId: string) => {
    try {
      const res = await fetch(`/api/personas/${personaId}/assets/${assetId}/favorite`, {
        method: "PATCH",
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      onRefresh()
    } catch {
      toast.error("Erro ao favoritar asset")
    }
  }

  const handleDelete = async (assetId: string) => {
    try {
      const res = await fetch(`/api/personas/${personaId}/assets/${assetId}`, {
        method: "DELETE",
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      toast.success("Asset removido")
      onRefresh()
    } catch {
      toast.error("Erro ao remover asset")
    }
  }

  const getTypeIcon = (type: string) => {
    if (type.includes("video")) return <VideoIcon className="h-3 w-3" />
    return <ImageIcon className="h-3 w-3" />
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Galeria</h2>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="generated_image">Imagens</SelectItem>
            <SelectItem value="generated_video">Vídeos</SelectItem>
            <SelectItem value="avatar">Avatares</SelectItem>
            <SelectItem value="reference">Referências</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredAssets.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm">
          Nenhum asset encontrado
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredAssets.map((asset) => (
            <Card key={asset.id} className="group overflow-hidden">
              <div className="aspect-square relative bg-muted">
                {asset.type.includes("video") ? (
                  <video
                    src={asset.url}
                    className="h-full w-full object-cover"
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    src={asset.url}
                    alt={asset.prompt || "Asset"}
                    className="h-full w-full object-cover"
                  />
                )}

                <div className="absolute top-1 left-1">
                  <Badge variant="secondary" className="text-xs gap-1">
                    {getTypeIcon(asset.type)}
                  </Badge>
                </div>

                <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleToggleFavorite(asset.id)}
                  >
                    <Heart
                      className={`h-3.5 w-3.5 ${asset.isFavorite ? "fill-red-500 text-red-500" : ""}`}
                    />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleDelete(asset.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
