"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useElevenLabs } from "@/lib/context/elevenlabs-context"
import { ApiKeyManager } from "./api-key-manager"

export function ElevenLabsApiSettings() {
  const { saveApiKey, clearApiKey, isConfigured } = useElevenLabs()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuração da API ElevenLabs</CardTitle>
        <CardDescription>Conecte ao ElevenLabs para habilitar vozes realistas nas suas personas</CardDescription>
      </CardHeader>
      <CardContent>
        <ApiKeyManager
          label="Chave de API ElevenLabs"
          placeholder="sk_xxxxxxxxxxxx"
          helpText="Obtenha sua chave de API em"
          helpLink="https://elevenlabs.io/app/settings/api-keys"
          isConfigured={isConfigured}
          onSave={saveApiKey}
          onClear={clearApiKey}
        />
      </CardContent>
    </Card>
  )
}
