"use client"

import { ApiKeyInput } from "@/components/shared/api-key-input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useReplicate } from "@/lib/context/replicate-context"
import { Trash2 } from "lucide-react"

/**
 * Componente para configuração da API Replicate
 * Princípio: Single Responsibility Principle (SRP)
 * Responsabilidade: gerenciar APENAS configurações da API Replicate
 */
export function ReplicateApiSettings() {
  const { clearApiKey, isConfigured } = useReplicate()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuração da API Replicate</CardTitle>
        <CardDescription>Conecte ao Replicate para habilitar a geração de imagens e vídeos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ApiKeyInput />
        {isConfigured && (
          <div className="pt-4 border-t border-border">
            <Button variant="destructive" size="sm" onClick={clearApiKey}>
              <Trash2 className="h-4 w-4 mr-2" />
              Remover Chave API
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
