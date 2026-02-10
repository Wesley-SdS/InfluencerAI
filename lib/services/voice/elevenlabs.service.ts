import type { ElevenLabsVoice, TextToSpeechParams } from '@/lib/types/voice';

const ELEVENLABS_BASE_URL = 'https://api.elevenlabs.io/v1';
const DEFAULT_MODEL_ID = 'eleven_multilingual_v2';

export class ElevenLabsService {
  constructor(private apiKey: string) {}

  private getHeaders(): HeadersInit {
    return {
      'xi-api-key': this.apiKey,
      'Content-Type': 'application/json',
    };
  }

  async listVoices(): Promise<ElevenLabsVoice[]> {
    const response = await fetch(`${ELEVENLABS_BASE_URL}/voices`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Falha ao listar vozes: ${response.status} - ${text}`);
    }

    const data = await response.json();
    return data.voices;
  }

  async getVoice(voiceId: string): Promise<ElevenLabsVoice> {
    const response = await fetch(`${ELEVENLABS_BASE_URL}/voices/${voiceId}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Falha ao buscar voz: ${response.status}`);
    }

    return response.json();
  }

  async textToSpeech(params: TextToSpeechParams): Promise<ArrayBuffer> {
    const { voiceId, text, modelId = DEFAULT_MODEL_ID, voiceSettings } = params;

    const body: Record<string, unknown> = {
      text,
      model_id: modelId,
    };

    if (voiceSettings) {
      body.voice_settings = {
        stability: voiceSettings.stability,
        similarity_boost: voiceSettings.similarity_boost,
        style: voiceSettings.style,
        use_speaker_boost: voiceSettings.use_speaker_boost,
      };
    }

    const response = await fetch(
      `${ELEVENLABS_BASE_URL}/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg',
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Falha ao gerar áudio: ${response.status} - ${error}`);
    }

    return response.arrayBuffer();
  }

  async cloneVoice(
    name: string,
    description: string,
    files: Buffer[],
    fileNames: string[]
  ): Promise<ElevenLabsVoice> {
    const formData = new FormData();
    formData.append('name', name);
    if (description) formData.append('description', description);

    files.forEach((file, index) => {
      const blob = new Blob([new Uint8Array(file)], { type: 'audio/mpeg' });
      formData.append('files', blob, fileNames[index] || `sample_${index}.mp3`);
    });

    const response = await fetch(`${ELEVENLABS_BASE_URL}/voices/add`, {
      method: 'POST',
      headers: { 'xi-api-key': this.apiKey },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Falha ao clonar voz: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async deleteVoice(voiceId: string): Promise<void> {
    const response = await fetch(`${ELEVENLABS_BASE_URL}/voices/${voiceId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Falha ao deletar voz: ${response.status}`);
    }
  }
}
