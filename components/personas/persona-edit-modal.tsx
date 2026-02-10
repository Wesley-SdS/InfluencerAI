"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PersonaIdentityStep } from "./persona-identity-step"
import { PersonaAppearanceStep } from "./persona-appearance-step"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePersona } from "@/lib/context/persona-context"
import { toast } from "sonner"
import type { PersonaData, UpdatePersonaDTO } from "@/lib/types/persona"

interface PersonaEditModalProps {
  persona: PersonaData
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdated: () => void
}

export function PersonaEditModal({ persona, open, onOpenChange, onUpdated }: PersonaEditModalProps) {
  const { updatePersona } = usePersona()
  const [data, setData] = useState<UpdatePersonaDTO>({
    name: persona.name,
    bio: persona.bio || "",
    gender: persona.gender || "",
    ageRange: persona.ageRange || "",
    niche: persona.niche || "",
    targetPlatform: persona.targetPlatform || "",
    contentTone: persona.contentTone || "",
    ethnicity: persona.ethnicity || "",
    bodyType: persona.bodyType || "",
    hairColor: persona.hairColor || "",
    hairStyle: persona.hairStyle || "",
    eyeColor: persona.eyeColor || "",
    distinctiveFeatures: persona.distinctiveFeatures || "",
    styleDescription: persona.styleDescription || "",
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updatePersona(persona.id, data)
      toast.success("Persona atualizada com sucesso!")
      onOpenChange(false)
      onUpdated()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao atualizar")
    } finally {
      setIsSaving(false)
    }
  }

  const updateField = (partial: Partial<UpdatePersonaDTO>) => {
    setData((prev) => ({ ...prev, ...partial }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Persona</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="identity">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="identity">Identidade</TabsTrigger>
            <TabsTrigger value="appearance">Aparência</TabsTrigger>
          </TabsList>
          <TabsContent value="identity" className="mt-4">
            <PersonaIdentityStep
              data={{ name: data.name || "", ...data }}
              onChange={updateField}
            />
          </TabsContent>
          <TabsContent value="appearance" className="mt-4">
            <PersonaAppearanceStep
              data={{ name: data.name || "", ...data }}
              onChange={updateField}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
