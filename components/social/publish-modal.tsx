"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarIcon, Loader2, Send } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { toast } from "sonner"
import type { SocialAccount } from "@prisma/client"
import { HashtagSuggester } from "./hashtag-suggester"

interface PublishModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mediaUrl: string
  mediaType: "image" | "video"
  campaignId?: string
  onSuccess?: () => void
}

export function PublishModal({
  open,
  onOpenChange,
  mediaUrl,
  mediaType,
  campaignId,
  onSuccess,
}: PublishModalProps) {
  const [accounts, setAccounts] = useState<SocialAccount[]>([])
  const [selectedAccountId, setSelectedAccountId] = useState("")
  const [caption, setCaption] = useState("")
  const [hashtags, setHashtags] = useState("")
  const [isScheduled, setIsScheduled] = useState(false)
  const [scheduledDate, setScheduledDate] = useState<Date>()
  const [scheduledTime, setScheduledTime] = useState("12:00")
  const [isPublishing, setIsPublishing] = useState(false)
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false)

  useEffect(() => {
    if (open) {
      loadAccounts()
    }
  }, [open])

  const loadAccounts = async () => {
    setIsLoadingAccounts(true)
    try {
      const res = await fetch("/api/social/accounts")
      if (res.ok) {
        const data = await res.json()
        const activeAccounts = data.data.filter((a: SocialAccount) => a.isActive)
        setAccounts(activeAccounts)
        if (activeAccounts.length > 0 && !selectedAccountId) {
          setSelectedAccountId(activeAccounts[0].id)
        }
      }
    } catch (error) {
      toast.error("Erro ao carregar contas")
    } finally {
      setIsLoadingAccounts(false)
    }
  }

  const handlePublish = async () => {
    if (!selectedAccountId) {
      toast.error("Selecione uma conta")
      return
    }

    setIsPublishing(true)

    try {
      let scheduledFor: Date | undefined

      if (isScheduled) {
        if (!scheduledDate) {
          toast.error("Selecione uma data")
          setIsPublishing(false)
          return
        }

        const [hours, minutes] = scheduledTime.split(":").map(Number)
        scheduledFor = new Date(scheduledDate)
        scheduledFor.setHours(hours, minutes, 0, 0)

        if (scheduledFor <= new Date()) {
          toast.error("Data deve ser no futuro")
          setIsPublishing(false)
          return
        }
      }

      const endpoint = isScheduled ? "/api/social/schedule" : "/api/social/publish"
      const payload: any = {
        socialAccountId: selectedAccountId,
        mediaUrl,
        mediaType,
        caption: caption.trim() || undefined,
        hashtags: hashtags.trim() || undefined,
      }

      if (isScheduled) {
        payload.scheduledFor = scheduledFor!.toISOString()
        payload.campaignId = campaignId
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success(isScheduled ? "Post agendado com sucesso!" : "Post publicado com sucesso!")
        onOpenChange(false)
        onSuccess?.()

        // Reset form
        setCaption("")
        setHashtags("")
        setIsScheduled(false)
        setScheduledDate(undefined)
        setScheduledTime("12:00")
      } else {
        toast.error(data.error || "Erro ao publicar")
      }
    } catch (error) {
      toast.error("Erro ao publicar")
    } finally {
      setIsPublishing(false)
    }
  }

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Publicar Conteúdo</DialogTitle>
          <DialogDescription>
            Publique imediatamente ou agende para mais tarde
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Account Selector */}
          <div className="space-y-2">
            <Label>Conta</Label>
            {isLoadingAccounts ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Carregando contas...
              </div>
            ) : accounts.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                Nenhuma conta conectada.{" "}
                <a href="/dashboard/social" className="text-primary hover:underline">
                  Conecte uma conta
                </a>
              </div>
            ) : (
              <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.platform} - @{account.platformUsername || "Sem nome"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Caption */}
          <div className="space-y-2">
            <Label>Legenda</Label>
            <Textarea
              placeholder="Escreva uma legenda para seu post..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={4}
              maxLength={2200}
            />
            <p className="text-xs text-muted-foreground">
              {caption.length} / 2200 caracteres
            </p>
          </div>

          {/* Hashtag Suggester */}
          <HashtagSuggester value={hashtags} onChange={setHashtags} />

          {/* Schedule Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Agendar publicação</Label>
              <p className="text-xs text-muted-foreground">
                Publicar agora ou agendar para mais tarde
              </p>
            </div>
            <Switch checked={isScheduled} onCheckedChange={setIsScheduled} />
          </div>

          {/* Date/Time Picker (if scheduled) */}
          {isScheduled && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Data</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {scheduledDate ? (
                        format(scheduledDate, "PPP", { locale: ptBR })
                      ) : (
                        "Selecione uma data"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={scheduledDate}
                      onSelect={setScheduledDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Hora</Label>
                <Select value={scheduledTime} onValueChange={setScheduledTime}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                      <SelectItem key={hour} value={`${hour.toString().padStart(2, "0")}:00`}>
                        {hour.toString().padStart(2, "0")}:00
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPublishing}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handlePublish}
              disabled={isPublishing || accounts.length === 0}
              className="flex-1"
            >
              {isPublishing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isScheduled ? "Agendando..." : "Publicando..."}
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  {isScheduled ? "Agendar" : "Publicar Agora"}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
