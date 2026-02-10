import { ElevenLabsService } from './elevenlabs.service';
import { getStorageService } from '../storage/factory';
import { PersonaService } from '../persona-service';
import type { ElevenLabsVoice, TextToSpeechParams, VoiceGenerationResult, PersonaVoiceConfig } from '@/lib/types/voice';

export class VoiceService {
  private static instance: VoiceService;
  private personaService = new PersonaService();

  private constructor() {}

  static getInstance(): VoiceService {
    if (!VoiceService.instance) {
      VoiceService.instance = new VoiceService();
    }
    return VoiceService.instance;
  }

  private createClient(apiKey: string): ElevenLabsService {
    return new ElevenLabsService(apiKey);
  }

  async listVoices(apiKey: string): Promise<ElevenLabsVoice[]> {
    return this.createClient(apiKey).listVoices();
  }

  async getVoice(apiKey: string, voiceId: string): Promise<ElevenLabsVoice> {
    return this.createClient(apiKey).getVoice(voiceId);
  }

  async generateSpeech(
    apiKey: string,
    userId: string,
    params: TextToSpeechParams
  ): Promise<VoiceGenerationResult> {
    const client = this.createClient(apiKey);
    const audioBuffer = await client.textToSpeech(params);

    const storage = getStorageService();
    const uploadResult = await storage.upload({
      buffer: Buffer.from(audioBuffer),
      userId,
      type: 'audio',
      folder: 'influencer-ai/audio',
    });

    return {
      audioUrl: uploadResult.url,
      publicId: uploadResult.publicId,
      duration: uploadResult.duration,
      fileSize: uploadResult.fileSize,
    };
  }

  async setPersonaVoice(
    userId: string,
    personaId: string,
    config: PersonaVoiceConfig
  ) {
    return this.personaService.setVoice(userId, personaId, config);
  }

  async removePersonaVoice(userId: string, personaId: string) {
    return this.personaService.removeVoice(userId, personaId);
  }

  async cloneVoice(
    apiKey: string,
    name: string,
    description: string,
    files: Buffer[],
    fileNames: string[]
  ): Promise<ElevenLabsVoice> {
    return this.createClient(apiKey).cloneVoice(name, description, files, fileNames);
  }

  async deleteVoice(apiKey: string, voiceId: string): Promise<void> {
    return this.createClient(apiKey).deleteVoice(voiceId);
  }
}
