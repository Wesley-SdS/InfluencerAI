import { handleReplicateGeneration, imageGenerationConfig } from "@/lib/utils/replicateGenerationUtils"

/**
 * Rota de API para geração de imagens
 * Princípio: Single Responsibility Principle (SRP) refatorado
 * Responsabilidade: apenas roteamento, lógica extraída para utilitário genérico
 */
export async function POST(request: Request) {
  return handleReplicateGeneration(request, imageGenerationConfig)
}
