"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PersonaIdentityStep } from "./persona-identity-step"
import { PersonaAppearanceStep } from "./persona-appearance-step"
import { PersonaReferenceStep } from "./persona-reference-step"
import { usePersona } from "@/lib/context/persona-context"
import { toast } from "sonner"
import type { CreatePersonaDTO } from "@/lib/types/persona"

const STEPS = [
  { title: "Identidade", description: "Informações básicas da persona" },
  { title: "Aparência", description: "Características visuais" },
  { title: "Referência", description: "Imagem de referência" },
]

const INITIAL_DATA: CreatePersonaDTO = {
  name: "",
  bio: "",
  gender: "",
  ageRange: "",
  niche: "",
  targetPlatform: "",
  contentTone: "",
  ethnicity: "",
  bodyType: "",
  hairColor: "",
  hairStyle: "",
  eyeColor: "",
  distinctiveFeatures: "",
  styleDescription: "",
  language: "pt-BR",
}

export function PersonaWizard() {
  const router = useRouter()
  const { createPersona } = usePersona()
  const [step, setStep] = useState(0)
  const [data, setData] = useState<CreatePersonaDTO>(INITIAL_DATA)
  const [referenceUrl, setReferenceUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateData = (partial: Partial<CreatePersonaDTO>) => {
    setData((prev) => ({ ...prev, ...partial }))
  }

  const canAdvance = () => {
    if (step === 0) return data.name.trim().length >= 2
    return true
  }

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1)
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep((s) => s - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Schema validation will clean empty strings automatically
      const persona = await createPersona(data)

      // If reference URL was provided, set it
      if (referenceUrl) {
        await fetch(`/api/personas/${persona.id}/reference-image`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: referenceUrl }),
        })
      }

      toast.success("Persona criada com sucesso!")
      router.push(`/dashboard/personas/${persona.id}`)
    } catch (err) {
      console.error("Error creating persona:", err)
      toast.error(err instanceof Error ? err.message : "Erro ao criar persona")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Step indicators */}
      <div className="flex items-center justify-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s.title} className="flex items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                i < step
                  ? "bg-primary text-primary-foreground"
                  : i === step
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 w-8 sm:w-12 mx-1 ${i < step ? "bg-primary" : "bg-muted"}`} />
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{STEPS[step].title}</CardTitle>
          <CardDescription>{STEPS[step].description}</CardDescription>
        </CardHeader>
        <CardContent>
          {step === 0 && <PersonaIdentityStep data={data} onChange={updateData} />}
          {step === 1 && <PersonaAppearanceStep data={data} onChange={updateData} />}
          {step === 2 && (
            <PersonaReferenceStep
              data={data}
              referenceUrl={referenceUrl}
              onReferenceUrlChange={setReferenceUrl}
            />
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack} disabled={step === 0}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        {step < STEPS.length - 1 ? (
          <Button onClick={handleNext} disabled={!canAdvance()}>
            Próximo
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isSubmitting || !canAdvance()}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Criando...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Criar Persona
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
