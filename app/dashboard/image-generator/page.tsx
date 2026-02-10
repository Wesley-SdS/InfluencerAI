import { ImageGeneratorPanel } from "@/components/image-generator/image-generator-panel"
import { PersonaSelector } from "@/components/personas/persona-selector"

export default function ImageGeneratorPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerador de Imagem</h1>
          <p className="text-muted-foreground">
            Crie imagens impressionantes geradas por IA para seu influenciador digital
          </p>
        </div>
        <PersonaSelector />
      </div>
      <ImageGeneratorPanel />
    </div>
  )
}
