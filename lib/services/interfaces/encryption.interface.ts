export interface EncryptedData {
  encrypted: string;  // Dados criptografados (hex)
  iv: string;         // Initialization Vector (hex)
  authTag: string;    // Authentication Tag (hex)
}

/**
 * Interface para serviços de criptografia
 * Implementa o princípio de Dependency Inversion (SOLID)
 */
export interface IEncryptionService {
  /**
   * Criptografa um texto plano
   */
  encrypt(plaintext: string): EncryptedData;

  /**
   * Descriptografa dados criptografados
   */
  decrypt(data: EncryptedData): string;
}
