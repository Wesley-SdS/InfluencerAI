"use client"

import { useState } from "react"
import { Loader2, Download, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LIP_SYNC_MODELS, type LipSyncModel } from "@/lib/types/lip-sync"
import type { PersonaData } from "@/lib/types/persona"
import { toast } from "sonner"

interface LipSyncDialogProps {
  persona: PersonaData
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete?: () => void
}

type Step = "input" | "generating-audio" | "generating-video" | "done"

export function LipSyncDialog({ persona, open, onOpenChange, onComplete }: LipSyncDialogProps) {
  const [model, setModel] = useState<LipSyncModel>("sadtalker")
  const [text, setText] = useState("")
  const [step, setStep] = useState<Step>("input")
  const [resultVideoUrl, setResultVideoUrl] = useState<string | null>(null)

  const canGenerate = text.trim().length >= 5

  const handleGenerate = async () => {
    if (!canGenerate) return

    try {
      // Step 1: Generate audio
      setStep("generating-audio")
      const audioRes = await fetch("/api/voice/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personaId: persona.id,
          text: text.trim(),
        }),
      })
      const audioData = await audioRes.json()
      if (!audioData.success) throw new Error(audioData.error || "Erro ao gerar áudio")

      const audioUrl = audioData.data.audioUrl

      // Step 2: Generate lip sync video
      setStep("generating-video")
      const lipSyncRes = await fetch("/api/replicate/generate-lip-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personaId: persona.id,
          imageUrl: persona.referenceImageUrl,
          audioUrl,
          model,
        }),
      })
      const lipSyncData = await lipSyncRes.json()
      if (!lipSyncData.success) throw new Error(lipSyncData.error || "Erro ao gerar lip sync")

      setResultVideoUrl(lipSyncData.data.videoUrl)
      setStep("done")
      toast.success("Vídeo lip sync gerado com sucesso!")
      onComplete?.()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao gerar vídeo")
      setStep("input")
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    // Reset state after close animation
    setTimeout(() => {
      setStep("input")
      setText("")
      setResultVideoUrl(null)
    }, 200)
  }

  const isGenerating = step === "generating-audio" || step === "generating-video"

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Gerar Vídeo Falando
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">Beta</Badge>
          </DialogTitle>
          <DialogDescription>
            Gere um vídeo da persona {persona.name} falando um texto com sincronização labial.
          </DialogDescription>
        </DialogHeader>

        {step === "done" && resultVideoUrl ? (
          <div className="space-y-4">
            <video
              src={resultVideoUrl}
              controls
              autoPlay
              className="w-full rounded-lg"
            />
            <Button variant="outline" className="w-full" asChild>
              <a href={resultVideoUrl} download target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4 mr-2" />
                Download Vídeo
              </a>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Modelo</Label>
              <Select value={model} onValueChange={(v) => setModel(v as LipSyncModel)} disabled={isGenerating}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LIP_SYNC_MODELS.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      <span className="font-medium">{m.name}</span>
                      <span className="text-muted-foreground ml-2 text-xs">{m.description}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Texto da narração</Label>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Digite o texto que a persona vai falar..."
                rows={4}
                disabled={isGenerating}
              />
              <p className="text-xs text-muted-foreground">
                Mínimo 5 caracteres. O texto será convertido em áudio e sincronizado com a imagem.
              </p>
            </div>

            <Button
              className="w-full"
              onClick={handleGenerate}
              disabled={!canGenerate || isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {step === "generating-audio" ? "Gerando áudio..." : "Gerando vídeo lip sync..."}
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4 mr-2" />
                  Gerar Vídeo
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
