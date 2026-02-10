import type { ElevenLabsVoice, VoiceGenerationResult, VoiceSettings } from '@/lib/types/voice';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class VoiceApiService {
  async listVoices(): Promise<ApiResponse<{ voices: ElevenLabsVoice[] }>> {
    const response = await fetch('/api/voice/voices');
    return response.json();
  }

  async generateSpeech(params: {
    personaId: string;
    text: string;
    voiceSettings?: Partial<VoiceSettings>;
  }): Promise<ApiResponse<VoiceGenerationResult>> {
    const response = await fetch('/api/voice/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return response.json();
  }

  async assignVoice(personaId: string, params: {
    voiceProvider: 'elevenlabs';
    voiceId: string;
    voiceName: string;
    voicePreviewUrl?: string | null;
    voiceSettings?: VoiceSettings;
  }): Promise<ApiResponse<unknown>> {
    const response = await fetch(`/api/personas/${personaId}/voice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return response.json();
  }

  async removeVoice(personaId: string): Promise<ApiResponse<unknown>> {
    const response = await fetch(`/api/personas/${personaId}/voice`, {
      method: 'DELETE',
    });
    return response.json();
  }

  async cloneVoice(formData: FormData): Promise<ApiResponse<{ voice: ElevenLabsVoice }>> {
    const response = await fetch('/api/voice/clone', {
      method: 'POST',
      body: formData,
    });
    return response.json();
  }
}

export const voiceApiService = new VoiceApiService();
