"use client"

import { Copy, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface BasePromptPreviewProps {
  prompt: string
}

export function BasePromptPreview({ prompt }: BasePromptPreviewProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(prompt)
    toast.success("Prompt copiado!")
  }

  if (!prompt || prompt === "A person") return null

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Prompt Base (Preview)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground italic">{prompt}</p>
        <Button variant="ghost" size="sm" className="mt-2 h-7 text-xs" onClick={handleCopy}>
          <Copy className="h-3 w-3 mr-1" />
          Copiar
        </Button>
      </CardContent>
    </Card>
  )
}
