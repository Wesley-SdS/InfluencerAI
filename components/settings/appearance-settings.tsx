"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

/**
 * Componente para configuração de aparência/tema
 * Princípio: Single Responsibility Principle (SRP)
 * Responsabilidade: gerenciar APENAS configurações de tema
 */

const THEMES = [
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Escuro", icon: Moon },
  { value: "system", label: "Sistema", icon: Monitor },
] as const

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aparência</CardTitle>
        <CardDescription>Personalize a aparência do aplicativo</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label>Tema</Label>
          <div className="flex gap-2">
            {THEMES.map((t) => (
              <Button
                key={t.value}
                variant="outline"
                size="sm"
                onClick={() => setTheme(t.value)}
                className={cn("flex-1", mounted && theme === t.value && "border-primary bg-primary/10 text-primary")}
              >
                <t.icon className="h-4 w-4 mr-2" />
                {t.label}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
