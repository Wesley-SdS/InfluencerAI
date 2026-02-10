"use client"

import Link from "next/link"
import { Users, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function EmptyPersonaState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
        <Users className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold">Nenhuma persona criada ainda</h3>
      <p className="text-sm text-muted-foreground text-center max-w-md mt-2">
        Crie seu primeiro influencer virtual para começar a gerar conteúdo consistente
      </p>
      <Button asChild className="mt-6">
        <Link href="/dashboard/personas/new">
          <Plus className="h-4 w-4 mr-2" />
          Criar Primeira Persona
        </Link>
      </Button>
    </div>
  )
}
