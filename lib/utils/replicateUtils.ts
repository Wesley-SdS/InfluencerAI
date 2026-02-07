import type { ReplicateResponse } from '@/lib/types/replicate';

/**
 * Utilitários para transformação de respostas da API Replicate
 * Princípio: Single Responsibility Principle (SRP)
 * Responsabilidade: transformar e extrair dados de respostas da API
 */

/**
 * Extrai URL do output da resposta Replicate
 * O output pode ser string ou array de strings
 */
export function extractOutputUrl(output: ReplicateResponse['output']): string | null {
  if (!output) return null
  
  if (Array.isArray(output)) {
    return output[0] || null
  }
  
  return output
}

/**
 * Verifica se a resposta da API foi bem-sucedida
 */
export function isSuccessfulResponse(response: { success: boolean; data?: unknown }): boolean {
  return response.success && !!response.data
}
