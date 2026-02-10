import { NextRequest, NextResponse } from 'next/server';
import { TemplateService } from '@/lib/services/campaign/template.service';
import { withAuth } from '@/lib/utils/auth';

const templateService = new TemplateService();

export const GET = withAuth(async (req: NextRequest) => {
  try {
    const id = req.nextUrl.pathname.split('/').pop()!;
    const template = await templateService.getTemplate(id);

    return NextResponse.json({ success: true, data: template });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao buscar template';
    const status = message.includes('não encontrado') ? 404 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
});
