import type {
  PipelinePersonaImageParams,
  PipelinePersonaVideoParams,
  PipelinePersonaVideoWithVoiceParams,
  PipelineResult,
} from '@/lib/types/pipeline';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class PipelineService {
  async generatePersonaImage(
    params: PipelinePersonaImageParams
  ): Promise<ApiResponse<PipelineResult>> {
    const response = await fetch('/api/pipeline/persona-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return response.json();
  }

  async generatePersonaVideo(
    params: PipelinePersonaVideoParams
  ): Promise<ApiResponse<PipelineResult>> {
    const response = await fetch('/api/pipeline/persona-video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return response.json();
  }

  async generatePersonaVideoWithVoice(
    params: PipelinePersonaVideoWithVoiceParams
  ): Promise<ApiResponse<PipelineResult>> {
    const response = await fetch('/api/pipeline/persona-video-voice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return response.json();
  }
}

export const pipelineService = new PipelineService();
