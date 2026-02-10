"use client"

import { Copy, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface PersonaPromptCardProps {
  basePrompt: string | null
}

export function PersonaPromptCard({ basePrompt }: PersonaPromptCardProps) {
  if (!basePrompt) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(basePrompt)
    toast.success("Prompt copiado!")
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Prompt Base
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleCopy}>
          <Copy className="h-4 w-4 mr-1" />
          Copiar
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground italic">{basePrompt}</p>
      </CardContent>
    </Card>
  )
}
