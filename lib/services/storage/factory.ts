import type { IStorageService } from '../interfaces/storage.interface';
import { CloudinaryStorageService } from './cloudinary.service';

let cachedService: IStorageService | null = null;

/**
 * Factory para criar instâncias de Storage Service
 * Atualmente suporta apenas Cloudinary.
 * Para adicionar S3, instale @aws-sdk/client-s3 e adicione o case aqui.
 */
export function getStorageService(): IStorageService {
  if (cachedService) return cachedService;

  const provider = process.env.STORAGE_PROVIDER || 'cloudinary';

  if (provider === 'cloudinary') {
    cachedService = new CloudinaryStorageService();
    return cachedService;
  }

  throw new Error(
    `Storage provider '${provider}' não suportado. Instale as dependências necessárias.`
  );
}
