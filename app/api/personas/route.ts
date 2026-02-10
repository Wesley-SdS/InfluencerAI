import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PersonaService } from '@/lib/services/persona-service';
import { withAuth } from '@/lib/utils/auth';
import { createPersonaSchema, personaFiltersSchema } from '@/lib/validations/persona';

const personaService = new PersonaService();

export const POST = withAuth(async (req, { userId }) => {
  try {
    const body = await req.json();
    const validated = createPersonaSchema.parse(body);

    const persona = await personaService.createPersona(userId, validated);

    return NextResponse.json({ success: true, data: persona }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }
    const message = error instanceof Error ? error.message : 'Erro ao criar persona';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
});

export const GET = withAuth(async (req, { userId }) => {
  try {
    const { searchParams } = new URL(req.url);
    const params: Record<string, unknown> = {};

    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }

    const filters = personaFiltersSchema.parse(params);
    const result = await personaService.listPersonas(userId, filters);

    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Parâmetros inválidos', details: error.errors },
        { status: 400 }
      );
    }
    const message = error instanceof Error ? error.message : 'Erro ao listar personas';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
});
