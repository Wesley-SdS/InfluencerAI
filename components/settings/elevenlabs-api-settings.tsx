"use client"

import { useState } from "react"
import { Eye, EyeOff, Key, Check, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useElevenLabs } from "@/lib/context/elevenlabs-context"
import { toast } from "sonner"

export function ElevenLabsApiSettings() {
  const { apiKey, setApiKey, clearApiKey, isConfigured } = useElevenLabs()
  const [showKey, setShowKey] = useState(false)
  const [inputValue, setInputValue] = useState(apiKey || "")
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    const key = inputValue.trim()
    if (!key) return

    setIsSaving(true)
    try {
      // Salvar no DB via API
      const res = await fetch("/api/user/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: "elevenlabs", apiKey: key }),
      })
      const json = await res.json()

      if (json.success) {
        // Salvar no context/localStorage
        setApiKey(key)
        toast.success("Chave API do ElevenLabs salva com sucesso")
      } else {
        toast.error(json.error || "Erro ao salvar chave API")
      }
    } catch {
      toast.error("Erro ao salvar chave API")
    } finally {
      setIsSaving(false)
    }
  }

  const handleClear = async () => {
    clearApiKey()
    setInputValue("")
    toast.success("Chave API do ElevenLabs removida")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuração da API ElevenLabs</CardTitle>
        <CardDescription>Conecte ao ElevenLabs para habilitar vozes realistas nas suas personas</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="elevenlabs-key" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Chave de API ElevenLabs
          </Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="elevenlabs-key"
                type={showKey ? "text" : "password"}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="sk_xxxxxxxxxxxx"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            <Button onClick={handleSave} disabled={!inputValue.trim() || isSaving}>
              {isConfigured ? <Check className="h-4 w-4" /> : isSaving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Obtenha sua chave de API em{" "}
          <a
            href="https://elevenlabs.io/app/settings/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            elevenlabs.io
          </a>
        </p>
        {isConfigured && (
          <div className="pt-4 border-t border-border">
            <Button variant="destructive" size="sm" onClick={handleClear}>
              <Trash2 className="h-4 w-4 mr-2" />
              Remover Chave API
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
