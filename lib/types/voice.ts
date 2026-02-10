export type VoiceProvider = 'elevenlabs';

export interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
}

export const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  stability: 0.5,
  similarity_boost: 0.75,
  style: 0.0,
  use_speaker_boost: true,
};

export interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  category: string;
  description: string | null;
  preview_url: string | null;
  labels: Record<string, string>;
}

export interface TextToSpeechParams {
  voiceId: string;
  text: string;
  modelId?: string;
  voiceSettings?: VoiceSettings;
}

export interface VoiceGenerationResult {
  audioUrl: string;
  publicId: string;
  duration?: number;
  fileSize?: number;
}

export interface PersonaVoiceConfig {
  voiceProvider: VoiceProvider;
  voiceId: string;
  voiceName: string;
  voicePreviewUrl: string | null;
  voiceSettings: VoiceSettings;
}

export const VOICE_PROVIDERS = [
  { value: 'elevenlabs' as const, label: 'ElevenLabs', description: 'Vozes realistas com suporte a clonagem' },
] as const;
