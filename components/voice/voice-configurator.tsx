"use client"

import { useState, useCallback } from "react"
import { Mic, Settings2, Trash2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { VoicePlayer } from "./voice-player"
import { VoiceSelectorModal } from "./voice-selector-modal"
import { VoiceSettingsForm } from "./voice-settings-form"
import { useVoice } from "@/lib/hooks/use-voice"
import type { PersonaData } from "@/lib/types/persona"
import type { ElevenLabsVoice, VoiceSettings } from "@/lib/types/voice"
import { DEFAULT_VOICE_SETTINGS } from "@/lib/types/voice"
import { toast } from "sonner"

interface VoiceConfiguratorProps {
  persona: PersonaData
  onRefresh: () => void
}

export function VoiceConfigurator({ persona, onRefresh }: VoiceConfiguratorProps) {
  const { isLoading, error, assignToPersona, removeFromPersona, generateSpeech, clearError } = useVoice()
  const [showSelector, setShowSelector] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>(
    (persona.voiceSettings as unknown as VoiceSettings) || DEFAULT_VOICE_SETTINGS
  )
  const [testText, setTestText] = useState("")
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null)

  const hasVoice = !!persona.voiceId

  const handleSelectVoice = useCallback(async (voice: ElevenLabsVoice) => {
    clearError()
    const success = await assignToPersona(persona.id, voice, voiceSettings)
    if (success) {
      toast.success(`Voz "${voice.name}" configurada com sucesso`)
      onRefresh()
    } else {
      toast.error("Erro ao configurar voz")
    }
  }, [persona.id, voiceSettings, assignToPersona, clearError, onRefresh])

  const handleRemoveVoice = useCallback(async () => {
    clearError()
    const success = await removeFromPersona(persona.id)
    if (success) {
      toast.success("Voz removida da persona")
      setGeneratedAudioUrl(null)
      onRefresh()
    } else {
      toast.error("Erro ao remover voz")
    }
  }, [persona.id, removeFromPersona, clearError, onRefresh])

  const handleGenerateTest = useCallback(async () => {
    if (!testText.trim()) return
    clearError()
    const result = await generateSpeech(persona.id, testText.trim())
    if (result) {
      setGeneratedAudioUrl(result.audioUrl)
      toast.success("Áudio gerado com sucesso")
    } else {
      toast.error("Erro ao gerar áudio de teste")
    }
  }, [persona.id, testText, generateSpeech, clearError])

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Mic className="h-4 w-4" />
              Configuração de Voz
            </CardTitle>
            {hasVoice && (
              <Badge variant="secondary">{persona.voiceName}</Badge>
            )}
          </div>
          <CardDescription>
            {hasVoice
              ? "Voz configurada via ElevenLabs"
              : "Adicione uma voz à sua persona para narrações"
            }
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {!hasVoice ? (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowSelector(true)}
              disabled={isLoading}
            >
              <Mic className="h-4 w-4 mr-2" />
              Selecionar Voz
            </Button>
          ) : (
            <>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{persona.voiceName}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {persona.voiceProvider}
                    </p>
                  </div>
                  <VoicePlayer src={persona.voicePreviewUrl} compact />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setShowSelector(true)}
                    disabled={isLoading}
                  >
                    <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                    Alterar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSettings(!showSettings)}
                    disabled={isLoading}
                  >
                    <Settings2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveVoice}
                    disabled={isLoading}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {showSettings && (
                  <div className="border rounded-lg p-3 space-y-3">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Configurações de Voz
                    </p>
                    <VoiceSettingsForm
                      settings={voiceSettings}
                      onChange={setVoiceSettings}
                      disabled={isLoading}
                    />
                  </div>
                )}

                <div className="border-t pt-3 space-y-2">
                  <Label className="text-sm">Testar Voz</Label>
                  <Textarea
                    value={testText}
                    onChange={(e) => setTestText(e.target.value)}
                    placeholder="Digite um texto para ouvir a voz..."
                    rows={2}
                    disabled={isLoading}
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={handleGenerateTest}
                      disabled={isLoading || !testText.trim()}
                    >
                      {isLoading ? "Gerando..." : "Gerar Áudio"}
                    </Button>
                    {generatedAudioUrl && (
                      <VoicePlayer src={generatedAudioUrl} />
                    )}
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-xs text-destructive">{error}</p>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <VoiceSelectorModal
        open={showSelector}
        onOpenChange={setShowSelector}
        onSelect={handleSelectVoice}
        currentVoiceId={persona.voiceId}
      />
    </>
  )
}
