/**
 * Utilitário para gerenciamento de localStorage
 * Princípio: Single Responsibility Principle (SRP)
 * Responsabilidade: persistência e recuperação de dados no localStorage
 */

export class LocalStorageService {
  /**
   * Salva um valor no localStorage
   */
  static set(key: string, value: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value)
    }
  }

  /**
   * Recupera um valor do localStorage
   */
  static get(key: string): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key)
    }
    return null
  }

  /**
   * Remove um valor do localStorage
   */
  static remove(key: string): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key)
    }
  }

  /**
   * Verifica se está no ambiente cliente
   */
  static isClient(): boolean {
    return typeof window !== 'undefined'
  }
}
