"use client"

import { useEffect, useRef } from "react"
import { Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { VideoModelSelector } from "./video-model-selector"
import { ProductPromptInput } from "./product-prompt-input"
import { SourceImageSelector } from "./source-image-selector"
import { VideoPreview } from "./video-preview"
import { NarrationControls } from "./narration-controls"
import { ErrorMessage } from "@/components/shared/error-message"
import { useVideoGeneration } from "@/lib/hooks/use-video-generation"
import { useGenerationPipeline } from "@/lib/hooks/use-generation-pipeline"
import { useReplicate } from "@/lib/context/replicate-context"
import { usePersona } from "@/lib/context/persona-context"
import { VoicePlayer } from "@/components/voice/voice-player"
import Link from "next/link"

export function VideoGeneratorPanel() {
  const { isConfigured } = useReplicate()
  const { selectedPersona } = usePersona()
  const {
    modelId,
    productName,
    productDescription,
    callToAction,
    additionalPrompt,
    sourceImageUrl,
    isLoading,
    videoUrl,
    error,
    setModelId,
    setProductName,
    setProductDescription,
    setCallToAction,
    setAdditionalPrompt,
    setSourceImageUrl,
    generate,
    reset,
  } = useVideoGeneration()

  const pipeline = useGenerationPipeline()
  const prevPersonaId = useRef<string | null>(null)

  // Pre-fill source image from persona reference
  useEffect(() => {
    const currentId = selectedPersona?.id ?? null
    if (currentId !== prevPersonaId.current) {
      prevPersonaId.current = currentId
      if (selectedPersona?.referenceImageUrl) {
        setSourceImageUrl(selectedPersona.referenceImageUrl)
      }
    }
  }, [selectedPersona, setSourceImageUrl])

  const canGenerate = productName.trim() && productDescription.trim()

  const combinedLoading = isLoading || pipeline.isLoading
  const combinedError = error || pipeline.error
  const combinedVideoUrl = pipeline.result?.outputUrl || videoUrl

  const handleGenerate = async () => {
    if (pipeline.useNarration && pipeline.narrationText.trim()) {
      await pipeline.generateVideoWithVoice({
        promptContext: {
          productName,
          productDescription,
          action: callToAction,
          scenario: additionalPrompt,
        },
        modelId,
        sourceImageUrl: sourceImageUrl || undefined,
      })
    } else {
      generate()
    }
  }

  if (!isConfigured) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
          <p className="text-muted-foreground text-center">
            Configure sua chave de API do Replicate para começar a gerar
          </p>
          <Button asChild>
            <Link href="/dashboard/settings">Ir para Configurações</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Configuração do Vídeo</CardTitle>
              {selectedPersona && (
                <Badge variant="secondary">{selectedPersona.name}</Badge>
              )}
            </div>
            <CardDescription>Selecione o modelo e a imagem de origem</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <VideoModelSelector selectedModelId={modelId} onModelSelect={setModelId} disabled={combinedLoading} />

            <SourceImageSelector value={sourceImageUrl} onChange={setSourceImageUrl} disabled={combinedLoading} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Produto</CardTitle>
            <CardDescription>Defina o produto que seu influenciador vai promover</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ProductPromptInput
              productName={productName}
              productDescription={productDescription}
              callToAction={callToAction}
              additionalPrompt={additionalPrompt}
              onProductNameChange={setProductName}
              onProductDescriptionChange={setProductDescription}
              onCallToActionChange={setCallToAction}
              onAdditionalPromptChange={setAdditionalPrompt}
              disabled={combinedLoading}
            />

            {selectedPersona && (
              <NarrationControls
                enabled={pipeline.useNarration}
                onEnabledChange={pipeline.setUseNarration}
                text={pipeline.narrationText}
                onTextChange={pipeline.setNarrationText}
                persona={selectedPersona}
                disabled={combinedLoading}
              />
            )}

            {combinedError && <ErrorMessage message={combinedError} onRetry={reset} />}

            <Button className="w-full" size="lg" onClick={handleGenerate} disabled={combinedLoading || !canGenerate}>
              <Video className="h-5 w-5 mr-2" />
              {combinedLoading ? "Gerando..." : pipeline.useNarration && pipeline.narrationText.trim() ? "Gerar Vídeo com Narração" : "Gerar Vídeo"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="h-fit sticky top-24">
        <CardHeader>
          <CardTitle>Pré-visualização</CardTitle>
          <CardDescription>Seu vídeo promocional gerado</CardDescription>
        </CardHeader>
        <CardContent>
          <VideoPreview videoUrl={combinedVideoUrl} isLoading={combinedLoading} onRegenerate={handleGenerate} />
          {pipeline.result?.audioUrl && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium">Narração</p>
              <VoicePlayer src={pipeline.result.audioUrl} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
