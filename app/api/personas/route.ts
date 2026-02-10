import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PersonaService } from '@/lib/services/persona-service';
import { withAuth } from '@/lib/utils/auth';
import { createPersonaSchema, personaFiltersSchema } from '@/lib/validations/persona';

const personaService = new PersonaService();

export const POST = withAuth(async (req, { userId }) => {
  console.log('➕ [POST /api/personas] Iniciando criação de persona');
  console.log('📋 [POST /api/personas] userId:', userId);

  try {
    const body = await req.json();
    console.log('📋 [POST /api/personas] body recebido:', body);

    const validated = createPersonaSchema.parse(body);
    console.log('✅ [POST /api/personas] Dados validados:', validated);

    const persona = await personaService.createPersona(userId, validated);
    console.log('✅ [POST /api/personas] Persona criada:', {
      id: persona.id,
      name: persona.name,
      userId: persona.userId
    });

    return NextResponse.json({ success: true, data: persona }, { status: 201 });
  } catch (error: unknown) {
    console.error('❌ [POST /api/personas] Erro capturado:', error);

    if (error instanceof z.ZodError) {
      console.error('❌ [POST /api/personas] Erro de validação Zod:', error.errors);
      return NextResponse.json(
        { success: false, error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }
    const message = error instanceof Error ? error.message : 'Erro ao criar persona';
    console.error('❌ [POST /api/personas] Mensagem de erro:', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
});

export const GET = withAuth(async (req, { userId }) => {
  console.log('🔍 [GET /api/personas] Iniciando requisição');
  console.log('📋 [GET /api/personas] userId:', userId);

  try {
    const { searchParams } = new URL(req.url);
    const params: Record<string, unknown> = {};

    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }

    console.log('📋 [GET /api/personas] searchParams:', params);

    const filters = personaFiltersSchema.parse(params);
    console.log('✅ [GET /api/personas] Filtros validados:', filters);

    const result = await personaService.listPersonas(userId, filters);
    console.log('✅ [GET /api/personas] Resultado:', {
      total: result.personas.length,
      pagination: result.pagination
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    console.error('❌ [GET /api/personas] Erro capturado:', error);

    if (error instanceof z.ZodError) {
      console.error('❌ [GET /api/personas] Erro de validação Zod:', error.errors);
      return NextResponse.json(
        { success: false, error: 'Parâmetros inválidos', details: error.errors },
        { status: 400 }
      );
    }
    const message = error instanceof Error ? error.message : 'Erro ao listar personas';
    console.error('❌ [GET /api/personas] Mensagem de erro:', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
});
