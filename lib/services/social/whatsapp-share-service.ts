// ============================================
// WHATSAPP SHARE SERVICE (Sprint 9)
// ============================================
// WhatsApp does not have a programmatic publishing API.
// This service provides:
// 1. Share links (wa.me) to open WhatsApp with pre-filled text
// 2. Media optimization for WhatsApp Status (max 16MB, videos ≤30s)

import type { WhatsAppShareParams, WhatsAppMedia } from '@/lib/types/social'

export class WhatsAppShareService {
  private static instance: WhatsAppShareService

  private constructor() {}

  static getInstance(): WhatsAppShareService {
    if (!WhatsAppShareService.instance) {
      WhatsAppShareService.instance = new WhatsAppShareService()
    }
    return WhatsAppShareService.instance
  }

  /**
   * Generates WhatsApp share link
   * Opens WhatsApp with pre-filled text and media URL
   */
  generateShareLink(params: WhatsAppShareParams): string {
    const parts: string[] = []

    if (params.text) {
      parts.push(params.text)
    }

    if (params.mediaUrl) {
      parts.push(params.mediaUrl)
    }

    const message = parts.join('\n\n')
    const encodedMessage = encodeURIComponent(message)

    if (params.phoneNumber) {
      // Send to specific contact
      return `https://wa.me/${params.phoneNumber}?text=${encodedMessage}`
    } else {
      // Open WhatsApp share dialog
      return `https://wa.me/?text=${encodedMessage}`
    }
  }

  /**
   * Prepares media for WhatsApp Status
   * WhatsApp Status limits: images ≤16MB, videos ≤16MB and ≤30s
   */
  async prepareForWhatsAppStatus(
    mediaUrl: string,
    mediaType: 'image' | 'video'
  ): Promise<WhatsAppMedia> {
    // Fetch media info
    const response = await fetch(mediaUrl, { method: 'HEAD' })

    if (!response.ok) {
      throw new Error('Media URL not accessible')
    }

    const contentLength = parseInt(response.headers.get('Content-Length') || '0')
    const fileSizeM = contentLength / (1024 * 1024)

    const result: WhatsAppMedia = {
      optimizedUrl: mediaUrl,
      originalUrl: mediaUrl,
      fileSize: contentLength,
      format: mediaType === 'image' ? 'JPEG' : 'MP4',
      needsTrim: false,
      instructions: this.getStatusInstructions(),
    }

    // Check if needs optimization
    if (mediaType === 'video') {
      // For video, we would need to check duration
      // For now, assume videos from the platform are < 30s
      // In production, would use ffprobe to check actual duration

      if (fileSizeM > 16) {
        result.needsTrim = true
        result.instructions.unshift(
          '⚠️ ATENÇÃO: Vídeo maior que 16MB. Comprima antes de publicar no WhatsApp Status.'
        )
      }
    } else {
      // Image
      if (fileSizeM > 16) {
        result.needsTrim = true
        result.instructions.unshift(
          '⚠️ ATENÇÃO: Imagem maior que 16MB. Comprima antes de publicar no WhatsApp Status.'
        )
      }
    }

    return result
  }

  /**
   * Returns instructions for posting to WhatsApp Status
   */
  getStatusInstructions(): string[] {
    return [
      '1. Baixe o vídeo/imagem usando o botão de download',
      '2. Abra o WhatsApp',
      '3. Vá em Status > Meu Status',
      '4. Toque no ícone de câmera/galeria',
      '5. Selecione o arquivo baixado',
      '6. Adicione texto/stickers se desejar',
      '7. Toque em Enviar',
    ]
  }
}

export const whatsAppShareService = WhatsAppShareService.getInstance()
