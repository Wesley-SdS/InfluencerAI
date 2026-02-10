export interface UploadParams {
  url?: string;          // URL temporária (Replicate) — pelo menos url ou buffer
  buffer?: Buffer;       // Dados binários (áudio do ElevenLabs)
  userId: string;        // ID do usuário
  type: 'image' | 'video' | 'audio';
  folder?: string;       // Pasta organizacional
}

export interface StorageResult {
  url: string;          // URL permanente
  publicId: string;     // ID para deletar/manipular
  fileSize: number;     // Bytes
  width?: number;
  height?: number;
  duration?: number;    // Vídeos (em segundos)
  thumbnailUrl?: string; // Vídeos
}

/**
 * Interface para serviços de storage (Cloudinary, S3, etc.)
 * Implementa o princípio de Dependency Inversion (SOLID)
 */
export interface IStorageService {
  /**
   * Faz upload de um arquivo a partir de uma URL
   */
  upload(params: UploadParams): Promise<StorageResult>;

  /**
   * Deleta um arquivo do storage
   */
  delete(publicId: string): Promise<void>;

  /**
   * Retorna a URL de um arquivo armazenado
   */
  getUrl(publicId: string, transformations?: object): string;

  /**
   * Gera thumbnail de um vídeo (opcional)
   */
  generateThumbnail?(publicId: string): Promise<string>;
}
