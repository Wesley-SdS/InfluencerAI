import { NextRequest, NextResponse } from 'next/server';
import { PersonaService } from '@/lib/services/persona-service';
import { withAuth } from '@/lib/utils/auth';

const personaService = new PersonaService();

export const PATCH = withAuth(async (req, { userId }) => {
  try {
    const url = new URL(req.url);
    const parts = url.pathname.split('/');
    const id = parts[parts.indexOf('personas') + 1];

    const persona = await personaService.archivePersona(userId, id);

    return NextResponse.json({ success: true, data: persona });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao arquivar persona';
    const status = message === 'Persona não encontrada' ? 404 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
});
