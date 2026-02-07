"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useGeneration } from "@/lib/context/generation-context"
import { Trash2 } from "lucide-react"

/**
 * Componente para gerenciamento de dados
 * Princípio: Single Responsibility Principle (SRP)
 * Responsabilidade: gerenciar APENAS dados do histórico
 */
export function DataManagementSettings() {
  const { clearHistory, history } = useGeneration()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciamento de Dados</CardTitle>
        <CardDescription>Gerencie seu histórico de gerações e dados armazenados</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Histórico de Gerações</p>
            <p className="text-sm text-muted-foreground">{history.length} itens no histórico</p>
          </div>
          <Button variant="outline" size="sm" onClick={clearHistory} disabled={history.length === 0}>
            <Trash2 className="h-4 w-4 mr-2" />
            Limpar Histórico
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
