import { GenerationRepository } from '@/lib/repositories/generation.repository';
import { getStorageService } from '../storage/factory';

/**
 * Serviço para gerenciamento de Gerações
 * Service Layer - Camada de lógica de negócio
 *
 * Princípios aplicados:
 * - Single Responsibility: Apenas lógica de negócio para Gerações
 * - Dependency Inversion: Usa abstrações (repository, storage service)
 * - Open/Closed: Aberto para extensão (novos tipos de geração)
 */
export class GenerationService {
  private repository = new GenerationRepository();

  /**
   * Cria uma nova geração
   * 1. Faz upload da URL temporária para storage permanente
   * 2. Salva metadata no banco de dados
   */
  async createGeneration(params: {
    userId: string;
    type: 'image' | 'video';
    modelId: string;
    prompt: string;
    settings?: object;
    replicateUrl: string; // URL temporária do Replicate
    personaId?: string;
  }) {
    const { userId, type, modelId, prompt, settings, replicateUrl, personaId } = params;

    const storage = getStorageService();

    // 1. Upload para storage permanente (Cloudinary ou S3)
    const uploadResult = await storage.upload({
      url: replicateUrl,
      userId,
      type
    });

    // 2. Salvar no banco de dados
    return this.repository.create({
      userId,
      type,
      modelId,
      prompt,
      settings,
      outputUrl: uploadResult.url,
      publicId: uploadResult.publicId,
      thumbnailUrl: uploadResult.thumbnailUrl,
      fileSize: uploadResult.fileSize,
      width: uploadResult.width,
      height: uploadResult.height,
      duration: uploadResult.duration,
      personaId
    });
  }

  /**
   * Retorna histórico de gerações do usuário com paginação
   */
  async getHistory(userId: string, options?: {
    type?: 'image' | 'video';
    page?: number;
    limit?: number;
  }) {
    const { type, page = 1, limit = 20 } = options || {};
    const offset = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.repository.findByUser(userId, { type, limit, offset }),
      this.repository.count(userId, type)
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Deleta uma geração
   * Remove do storage E do banco de dados
   */
  async deleteGeneration(id: string, userId: string) {
    // 1. Buscar geração
    const generation = await this.repository.findById(id, userId);

    if (!generation) {
      throw new Error('Geração não encontrada');
    }

    const storage = getStorageService();

    // 2. Deletar do storage (Cloudinary/S3)
    await storage.delete(generation.publicId);

    // 3. Deletar do banco de dados
    return this.repository.delete(id, userId);
  }

  /**
   * Busca uma geração específica
   */
  async getGeneration(id: string, userId: string) {
    return this.repository.findById(id, userId);
  }

  /**
   * Retorna estatísticas do usuário
   */
  async getStats(userId: string) {
    const [totalImages, totalVideos] = await Promise.all([
      this.repository.count(userId, 'image'),
      this.repository.count(userId, 'video')
    ]);

    return {
      totalImages,
      totalVideos,
      totalGenerations: totalImages + totalVideos
    };
  }
}
