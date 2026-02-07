"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * Componente para informações sobre o app
 * Princípio: Single Responsibility Principle (SRP)
 * Responsabilidade: exibir APENAS informações sobre o app
 */

const APP_INFO = [
  { label: "Versão", value: "1.0.0" },
  { label: "Framework", value: "Next.js 16" },
  { label: "Geração de Mídia", value: "Replicate" },
  { label: "Refinador de Prompts", value: "OpenAI / Google Gemini" },
] as const

export function AboutSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sobre</CardTitle>
        <CardDescription>Informações do aplicativo</CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="space-y-2 text-sm">
          {APP_INFO.map(({ label, value }) => (
            <div key={label} className="flex justify-between">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}
