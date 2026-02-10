import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PersonaService } from '@/lib/services/persona-service';
import { withAuth } from '@/lib/utils/auth';
import { updatePersonaSchema } from '@/lib/validations/persona';

const personaService = new PersonaService();

function getIdFromUrl(req: NextRequest): string {
  const url = new URL(req.url);
  const parts = url.pathname.split('/');
  return parts[parts.length - 1];
}

export const GET = withAuth(async (req, { userId }) => {
  try {
    const id = getIdFromUrl(req);
    const persona = await personaService.getPersona(userId, id);

    return NextResponse.json({ success: true, data: persona });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao buscar persona';
    const status = message === 'Persona não encontrada' ? 404 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
});

export const PATCH = withAuth(async (req, { userId }) => {
  try {
    const id = getIdFromUrl(req);
    const body = await req.json();
    const validated = updatePersonaSchema.parse(body);

    const persona = await personaService.updatePersona(userId, id, validated);

    return NextResponse.json({ success: true, data: persona });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }
    const message = error instanceof Error ? error.message : 'Erro ao atualizar persona';
    const status = message === 'Persona não encontrada' ? 404 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
});

export const DELETE = withAuth(async (req, { userId }) => {
  try {
    const id = getIdFromUrl(req);
    await personaService.deletePersona(userId, id);

    return NextResponse.json({ success: true, message: 'Persona deletada com sucesso' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao deletar persona';
    const status = message === 'Persona não encontrada' ? 404 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
});
