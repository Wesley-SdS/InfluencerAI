// ============================================
// VIDEO COMPOSITION TYPES (Sprint 9)
// ============================================

export interface ConcatVideoParams {
  videoUrls: string[]                  // Min 2 URLs
  transitionType?: 'none' | 'crossfade' | 'fade_black'
  transitionDuration?: number          // Seconds (default: 0.5)
}

export interface MergeAudioParams {
  videoUrl: string
  audioUrl: string
  audioVolume?: number                 // 0.0-1.0
  keepOriginalAudio?: boolean
  fadeAudioIn?: number
  fadeAudioOut?: number
}

export interface TrimVideoParams {
  videoUrl: string
  startTime: number                    // Seconds
  endTime: number
}

export interface CompositionResult {
  url: string
  publicId: string
  duration?: number
  width?: number
  height?: number
}
