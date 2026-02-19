"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useGoogle } from "@/lib/context/google-context"
import { useLLM } from "@/lib/context/llm-context"
import { useOpenAI } from "@/lib/context/openai-context"
import { REFINER_MODELS } from "@/lib/types/models"
import { cn } from "@/lib/utils"
import { Check, ChevronDown } from "lucide-react"
import { useState } from "react"
import { ApiKeyManager } from "./api-key-manager"

/**
 * Componente para configuração do refinador de prompts (LLM)
 * Princípio: Single Responsibility Principle (SRP)
 * Responsabilidade: gerenciar configurações de refinamento de prompts
 */
export function PromptRefinerSettings() {
  const { saveApiKey: saveOpenAIKey, clearApiKey: clearOpenAIKey, isConfigured: isOpenAIConfigured } = useOpenAI()
  const { saveApiKey: saveGoogleKey, clearApiKey: clearGoogleKey, isConfigured: isGoogleConfigured } = useGoogle()
  const { selectedModel, setSelectedModel } = useLLM()
  const [modelOpen, setModelOpen] = useState(false)

  const openaiModels = REFINER_MODELS.filter((m) => m.provider === "openai")
  const googleModels = REFINER_MODELS.filter((m) => m.provider === "google")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Refinador de Prompts com IA</CardTitle>
        <CardDescription>Configure as APIs para refinar seus prompts automaticamente</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Seletor de Modelo */}
        <div className="space-y-2">
          <Label>Modelo de Refinamento</Label>
          <Popover open={modelOpen} onOpenChange={setModelOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between bg-transparent">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{selectedModel.name}</span>
                  <span className="text-xs text-muted-foreground">({selectedModel.provider})</span>
                </div>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-2" align="start">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground px-2 py-1">OpenAI</p>
                {openaiModels.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      setSelectedModel(model)
                      setModelOpen(false)
                    }}
                    className={cn(
                      "w-full flex items-center justify-between p-2 rounded-md text-left hover:bg-accent transition-colors",
                      selectedModel.id === model.id && "bg-accent",
                    )}
                  >
                    <div>
                      <p className="font-medium text-sm">{model.name}</p>
                      <p className="text-xs text-muted-foreground">{model.description}</p>
                    </div>
                    {selectedModel.id === model.id && <Check className="h-4 w-4 text-primary" />}
                  </button>
                ))}
                <p className="text-xs font-medium text-muted-foreground px-2 py-1 pt-3 border-t">Google</p>
                {googleModels.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      setSelectedModel(model)
                      setModelOpen(false)
                    }}
                    className={cn(
                      "w-full flex items-center justify-between p-2 rounded-md text-left hover:bg-accent transition-colors",
                      selectedModel.id === model.id && "bg-accent",
                    )}
                  >
                    <div>
                      <p className="font-medium text-sm">{model.name}</p>
                      <p className="text-xs text-muted-foreground">{model.description}</p>
                    </div>
                    {selectedModel.id === model.id && <Check className="h-4 w-4 text-primary" />}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* OpenAI API Key */}
        <ApiKeyManager
          label="Chave API OpenAI"
          placeholder="sk-..."
          helpText="Obtenha sua chave em"
          helpLink="https://platform.openai.com/api-keys"
          isConfigured={isOpenAIConfigured}
          onSave={saveOpenAIKey}
          onClear={clearOpenAIKey}
        />

        {/* Google API Key */}
        <ApiKeyManager
          label="Chave API Google (Gemini)"
          placeholder="AIza..."
          helpText="Obtenha sua chave em"
          helpLink="https://aistudio.google.com/apikey"
          isConfigured={isGoogleConfigured}
          onSave={saveGoogleKey}
          onClear={clearGoogleKey}
        />
      </CardContent>
    </Card>
  )
}
