"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Instagram, Music2, Youtube, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import type { SocialAccount } from "@prisma/client"

interface SocialAccountCardProps {
  account: SocialAccount
  onDisconnect: (accountId: string) => Promise<void>
}

const platformIcons = {
  instagram: Instagram,
  tiktok: Music2,
  youtube: Youtube,
}

const platformColors = {
  instagram: "bg-gradient-to-br from-purple-600 to-pink-500",
  tiktok: "bg-black",
  youtube: "bg-red-600",
}

export function SocialAccountCard({ account, onDisconnect }: SocialAccountCardProps) {
  const [showDisconnect, setShowDisconnect] = useState(false)
  const [isDisconnecting, setIsDisconnecting] = useState(false)

  const PlatformIcon = platformIcons[account.platform as keyof typeof platformIcons]
  const platformColor = platformColors[account.platform as keyof typeof platformColors]

  const handleDisconnect = async () => {
    setIsDisconnecting(true)
    try {
      await onDisconnect(account.id)
    } finally {
      setIsDisconnecting(false)
      setShowDisconnect(false)
    }
  }

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Platform Icon */}
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${platformColor}`}>
              {PlatformIcon && <PlatformIcon className="h-6 w-6 text-white" />}
            </div>

            {/* Account Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold truncate">
                  {account.displayName || account.platformUsername || "Sem nome"}
                </h3>
                {account.isActive ? (
                  <Badge variant="outline" className="gap-1 text-green-600 border-green-600">
                    <CheckCircle2 className="h-3 w-3" />
                    Conectado
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-1 text-gray-600">
                    <XCircle className="h-3 w-3" />
                    Desconectado
                  </Badge>
                )}
              </div>

              {account.platformUsername && (
                <p className="text-sm text-muted-foreground truncate">
                  @{account.platformUsername}
                </p>
              )}

              <p className="text-xs text-muted-foreground mt-2">
                Plataforma: {account.platform}
              </p>

              {account.lastSyncAt && (
                <p className="text-xs text-muted-foreground">
                  Última sincronização: {new Date(account.lastSyncAt).toLocaleString("pt-BR")}
                </p>
              )}
            </div>

            {/* Avatar */}
            {account.avatarUrl && (
              <Avatar className="h-10 w-10">
                <AvatarImage src={account.avatarUrl} alt={account.displayName || ""} />
                <AvatarFallback>
                  {(account.displayName || account.platformUsername || "U")[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
          </div>

          {/* Actions */}
          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDisconnect(true)}
              disabled={isDisconnecting}
            >
              Desconectar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Disconnect Confirmation Dialog */}
      <AlertDialog open={showDisconnect} onOpenChange={setShowDisconnect}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Desconectar conta?</AlertDialogTitle>
            <AlertDialogDescription>
              Todos os posts agendados para esta conta serão cancelados. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDisconnecting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDisconnect}
              disabled={isDisconnecting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDisconnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Desconectando...
                </>
              ) : (
                "Desconectar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
