import { NextRequest, NextResponse } from 'next/server';
import { PersonaService } from '@/lib/services/persona-service';
import { withAuth } from '@/lib/utils/auth';

const personaService = new PersonaService();

export const PATCH = withAuth(async (req, { userId }) => {
  try {
    const url = new URL(req.url);
    const parts = url.pathname.split('/');
    const personaId = parts[parts.indexOf('personas') + 1];
    const assetId = parts[parts.indexOf('assets') + 1];

    const asset = await personaService.toggleAssetFavorite(userId, personaId, assetId);

    return NextResponse.json({ success: true, data: asset });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao favoritar asset';
    const status = message.includes('não encontrad') ? 404 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
});
