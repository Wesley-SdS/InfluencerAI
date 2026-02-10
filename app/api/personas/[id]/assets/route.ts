import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PersonaService } from '@/lib/services/persona-service';
import { withAuth } from '@/lib/utils/auth';
import { createPersonaAssetSchema } from '@/lib/validations/persona';
import type { Prisma } from '@prisma/client';

const personaService = new PersonaService();

export const POST = withAuth(async (req, { userId }) => {
  try {
    const url = new URL(req.url);
    const parts = url.pathname.split('/');
    const personaId = parts[parts.indexOf('personas') + 1];

    const body = await req.json();
    const validated = createPersonaAssetSchema.parse(body);

    const asset = await personaService.addAsset(userId, personaId, {
      ...validated,
      metadata: validated.metadata as Prisma.InputJsonValue | undefined,
    });

    return NextResponse.json({ success: true, data: asset }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }
    const message = error instanceof Error ? error.message : 'Erro ao adicionar asset';
    const status = message === 'Persona não encontrada' ? 404 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
});
