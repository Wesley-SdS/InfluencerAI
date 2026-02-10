"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Instagram, Music2, Youtube, Calendar, ExternalLink, X, Clock } from "lucide-react"
import type { ScheduledPost, SocialAccount } from "@prisma/client"
import { POST_STATUS_LABELS, POST_STATUS_COLORS } from "@/lib/types/social"
import Image from "next/image"

interface ScheduledPostCardProps {
  post: ScheduledPost & {
    socialAccount: SocialAccount
    campaign?: { id: string; name: string } | null
  }
  onCancel?: (postId: string) => Promise<void>
  onReschedule?: (postId: string) => void
}

const platformIcons = {
  instagram: Instagram,
  tiktok: Music2,
  youtube: Youtube,
}

export function ScheduledPostCard({ post, onCancel, onReschedule }: ScheduledPostCardProps) {
  const [isCanceling, setIsCanceling] = useState(false)

  const PlatformIcon = platformIcons[post.socialAccount.platform as keyof typeof platformIcons]
  const statusColor = POST_STATUS_COLORS[post.status as keyof typeof POST_STATUS_COLORS]
  const statusLabel = POST_STATUS_LABELS[post.status as keyof typeof POST_STATUS_LABELS]

  const handleCancel = async () => {
    if (!onCancel) return
    setIsCanceling(true)
    try {
      await onCancel(post.id)
    } finally {
      setIsCanceling(false)
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "published":
        return "default"
      case "failed":
        return "destructive"
      case "scheduled":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Media Thumbnail */}
          <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
            {post.mediaUrl && (
              <Image
                src={post.mediaUrl}
                alt="Post media"
                fill
                className="object-cover"
                unoptimized
              />
            )}
            {post.mediaType === "video" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                  <div className="w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-black border-b-4 border-b-transparent ml-1" />
                </div>
              </div>
            )}
          </div>

          {/* Post Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                {PlatformIcon && <PlatformIcon className="h-4 w-4 text-muted-foreground" />}
                <span className="text-sm font-medium">
                  @{post.socialAccount.platformUsername || "Conta"}
                </span>
              </div>
              <Badge variant={getBadgeVariant(post.status)}>{statusLabel}</Badge>
            </div>

            {/* Caption Preview */}
            {post.caption && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {post.caption}
              </p>
            )}

            {/* Scheduled Time */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(post.scheduledFor)}
              </div>
              {post.campaign && (
                <div className="flex items-center gap-1">
                  <span>Campanha: {post.campaign.name}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {post.status === "scheduled" && onCancel && (
                <>
                  {onReschedule && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onReschedule(post.id)}
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      Reagendar
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancel}
                    disabled={isCanceling}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Cancelar
                  </Button>
                </>
              )}

              {post.status === "published" && post.platformPostUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a href={post.platformPostUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Ver post
                  </a>
                </Button>
              )}

              {post.status === "failed" && post.errorMessage && (
                <div className="text-xs text-destructive">
                  Erro: {post.errorMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
