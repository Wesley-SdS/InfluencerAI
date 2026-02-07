/**
 * Utilitários para download de arquivos
 * Princípio: Single Responsibility Principle (SRP)
 * Responsabilidade: gerenciar downloads de arquivos
 */

/**
 * Faz download de um arquivo a partir de uma URL
 */
export async function downloadFile(url: string, filename: string): Promise<void> {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    const blobUrl = window.URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Libera a URL criada
    window.URL.revokeObjectURL(blobUrl)
  } catch (error) {
    console.error('Erro ao fazer download:', error)
    throw new Error('Falha ao fazer download do arquivo')
  }
}

/**
 * Gera um nome de arquivo baseado no tipo e timestamp
 */
export function generateFilename(type: 'image' | 'video', extension: string = 'png'): string {
  const timestamp = new Date().getTime()
  return `${type}-${timestamp}.${extension}`
}
