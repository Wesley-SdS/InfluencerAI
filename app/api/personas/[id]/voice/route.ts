import { NextResponse } from 'next/server';
import { z } from 'zod';
import { PersonaService } from '@/lib/services/persona-service';
import { withAuth } from '@/lib/utils/auth';
import { setPersonaVoiceSchema } from '@/lib/validations/voice';
import { DEFAULT_VOICE_SETTINGS } from '@/lib/types/voice';

const personaService = new PersonaService();

export const POST = withAuth(async (req, { userId }) => {
  try {
    const url = new URL(req.url);
    const parts = url.pathname.split('/');
    const personaId = parts[parts.indexOf('personas') + 1];

    const body = await req.json();
    const validated = setPersonaVoiceSchema.parse(body);

    const persona = await personaService.setVoice(userId, personaId, {
      voiceProvider: validated.voiceProvider,
      voiceId: validated.voiceId,
      voiceName: validated.voiceName,
      voicePreviewUrl: validated.voicePreviewUrl ?? null,
      voiceSettings: validated.voiceSettings ?? DEFAULT_VOICE_SETTINGS,
    });

    return NextResponse.json({ success: true, data: persona });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }
    const message = error instanceof Error ? error.message : 'Erro ao configurar voz';
    const status = message === 'Persona não encontrada' ? 404 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
});

export const DELETE = withAuth(async (req, { userId }) => {
  try {
    const url = new URL(req.url);
    const parts = url.pathname.split('/');
    const personaId = parts[parts.indexOf('personas') + 1];

    const persona = await personaService.removeVoice(userId, personaId);

    return NextResponse.json({ success: true, data: persona });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao remover voz';
    const status = message === 'Persona não encontrada' ? 404 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
});
