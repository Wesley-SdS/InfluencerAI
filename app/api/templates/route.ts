import { NextResponse } from 'next/server';
import { TemplateService } from '@/lib/services/campaign/template.service';
import { withAuth } from '@/lib/utils/auth';

const templateService = new TemplateService();

export const GET = withAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;

    const templates = await templateService.listTemplates({ category, search });

    return NextResponse.json({ success: true, data: templates });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao listar templates';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
});
