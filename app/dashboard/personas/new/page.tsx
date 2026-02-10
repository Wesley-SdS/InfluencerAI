import { PersonaWizard } from "@/components/personas/persona-wizard"

export default function NewPersonaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nova Persona</h1>
        <p className="text-muted-foreground">
          Crie um novo influenciador virtual com identidade única
        </p>
      </div>
      <PersonaWizard />
    </div>
  )
}
