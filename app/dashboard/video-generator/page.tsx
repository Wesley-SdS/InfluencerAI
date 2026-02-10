import { VideoGeneratorPanel } from "@/components/video-generator/video-generator-panel"
import { PersonaSelector } from "@/components/personas/persona-selector"

export default function VideoGeneratorPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerador de Vídeo</h1>
          <p className="text-muted-foreground">Crie vídeos promocionais com seu influenciador digital</p>
        </div>
        <PersonaSelector />
      </div>
      <VideoGeneratorPanel />
    </div>
  )
}
