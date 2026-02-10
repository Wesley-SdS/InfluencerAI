import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/config";
import { NextRequest, NextResponse } from "next/server";

/**
 * Utilitários de autenticação
 */

/**
 * Retorna a sessão atual do servidor
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Retorna o usuário atual autenticado
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

/**
 * Verifica se há usuário autenticado, caso contrário lança erro
 */
export async function requireAuth() {
  console.log('🔐 [requireAuth] Verificando autenticação...');
  const user = await getCurrentUser();

  if (!user) {
    console.error('❌ [requireAuth] Usuário não autenticado');
    throw new Error('Não autenticado');
  }

  console.log('✅ [requireAuth] Usuário autenticado:', { id: user.id, email: user.email });
  return user;
}

/**
 * Higher-Order Function para proteger API routes
 * Wrapper que adiciona verificação de autenticação
 *
 * Exemplo de uso:
 * export const GET = withAuth(async (req, { userId }) => {
 *   // userId está disponível aqui
 * });
 */
export function withAuth(
  handler: (req: NextRequest, context: { userId: string }) => Promise<NextResponse>
) {
  return async (req: NextRequest, routeParams?: any) => {
    console.log('🔒 [withAuth] Iniciando wrapper de autenticação');
    console.log('🔒 [withAuth] URL:', req.url);

    try {
      const user = await requireAuth();
      console.log('✅ [withAuth] Autenticação OK, executando handler...');

      // Passa userId no context para o handler
      const response = await handler(req, { userId: user.id });
      console.log('✅ [withAuth] Handler executado com sucesso');
      return response;
    } catch (error) {
      console.error('❌ [withAuth] Erro de autenticação:', error);
      return NextResponse.json(
        { success: false, error: 'Não autenticado' },
        { status: 401 }
      );
    }
  };
}
