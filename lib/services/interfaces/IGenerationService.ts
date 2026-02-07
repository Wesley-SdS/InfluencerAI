import type { APIResponse, GenerateImageRequest, GenerateVideoRequest, ReplicateResponse } from '@/lib/types/replicate'

/**
 * Interface para serviços de geração (imagem/vídeo)
 * Princípio: Dependency Inversion Principle (DIP)
 */
export interface IGenerationService<TRequest> {
  generate(request: TRequest & { apiKey: string }): Promise<APIResponse<ReplicateResponse>>
}

/**
 * Interface específica para geração de imagens
 */
export interface IImageGenerationService extends IGenerationService<GenerateImageRequest> {}

/**
 * Interface específica para geração de vídeos
 */
export interface IVideoGenerationService extends IGenerationService<GenerateVideoRequest> {}
