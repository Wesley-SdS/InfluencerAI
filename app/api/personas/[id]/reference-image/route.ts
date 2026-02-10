import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PersonaService } from '@/lib/services/persona-service';
import { withAuth } from '@/lib/utils/auth';

const personaService = new PersonaService();

const schema = z.object({
  imageUrl: z.string().url('URL da imagem inválida'),
  publicId: z.string().optional(),
});

export const POST = withAuth(async (req, { userId }) => {
  try {
    const url = new URL(req.url);
    const parts = url.pathname.split('/');
    const personaId = parts[parts.indexOf('personas') + 1];

    const body = await req.json();
    const validated = schema.parse(body);

    const persona = await personaService.setReferenceImage(
      userId,
      personaId,
      validated.imageUrl,
      validated.publicId
    );

    return NextResponse.json({ success: true, data: persona });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }
    const message = error instanceof Error ? error.message : 'Erro ao definir imagem de referência';
    const status = message === 'Persona não encontrada' ? 404 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
});
