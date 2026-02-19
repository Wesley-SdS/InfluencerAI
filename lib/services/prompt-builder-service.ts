import type { PersonaAttributes, ImagePromptContext, VideoPromptContext } from '@/lib/types/persona';

export class PromptBuilderService {
  static buildBasePrompt(attrs: PersonaAttributes): string {
    const parts: string[] = [];

    // Subject identity
    const age = attrs.ageRange ? attrs.ageRange.replace('-', ' to ').replace('+', ' and older') : '';
    const genderMap: Record<string, string> = {
      female: 'woman',
      male: 'man',
      'non-binary': 'person',
      other: 'person',
    };
    const gender = attrs.gender ? genderMap[attrs.gender] || 'person' : 'person';

    if (attrs.ethnicity && age) {
      parts.push(`A ${age} year old ${attrs.ethnicity} ${gender}`);
    } else if (age) {
      parts.push(`A ${age} year old ${gender}`);
    } else {
      parts.push(`A ${gender}`);
    }

    // Name as identity anchor
    if (attrs.name) {
      parts.push(`named ${attrs.name}`);
    }

    // Body
    if (attrs.bodyType) {
      parts.push(`with ${attrs.bodyType} build`);
    }

    // Hair
    if (attrs.hairStyle && attrs.hairColor) {
      parts.push(`${attrs.hairStyle} ${attrs.hairColor} hair`);
    } else if (attrs.hairColor) {
      parts.push(`${attrs.hairColor} hair`);
    } else if (attrs.hairStyle) {
      parts.push(`${attrs.hairStyle} hair`);
    }

    // Eyes
    if (attrs.eyeColor) {
      parts.push(`${attrs.eyeColor} eyes`);
    }

    // Distinctive features
    if (attrs.distinctiveFeatures) {
      parts.push(attrs.distinctiveFeatures);
    }

    // Style
    if (attrs.styleDescription) {
      parts.push(attrs.styleDescription);
    }

    // Niche & tone context for better scene framing
    const nicheMap: Record<string, string> = {
      fitness: 'fitness and health influencer',
      beauty: 'beauty and makeup influencer',
      tech: 'technology content creator',
      lifestyle: 'lifestyle influencer',
      fashion: 'fashion influencer',
      food: 'food and gastronomy content creator',
      travel: 'travel content creator',
      gaming: 'gaming content creator',
      education: 'educational content creator',
      business: 'business and entrepreneurship influencer',
    };
    const toneMap: Record<string, string> = {
      professional: 'professional and polished appearance',
      casual: 'casual and approachable look',
      fun: 'fun and energetic vibe',
      luxurious: 'luxurious and sophisticated aesthetic',
      educational: 'knowledgeable and authoritative presence',
    };

    if (attrs.niche) {
      const nicheDesc = nicheMap[attrs.niche] || `${attrs.niche} content creator`;
      parts.push(nicheDesc);
    }

    if (attrs.contentTone) {
      const toneDesc = toneMap[attrs.contentTone] || `${attrs.contentTone} style`;
      parts.push(toneDesc);
    }

    // Bio-derived personality cues (extract key visual/personality traits)
    if (attrs.bio) {
      const bioSummary = this.extractBioVisualCues(attrs.bio);
      if (bioSummary) {
        parts.push(bioSummary);
      }
    }

    // Join with commas for clean prompt structure
    const subject = parts[0];
    const details = parts.slice(1);

    if (details.length === 0) return subject;
    return `${subject}, ${details.join(', ')}`;
  }

  /**
   * Extracts visual and personality cues from bio text to enrich the prompt.
   * Keeps it concise - only the most relevant descriptors.
   */
  private static extractBioVisualCues(bio: string): string {
    const cues: string[] = [];
    const bioLower = bio.toLowerCase();

    // Confidence / leadership
    if (bioLower.includes('líder') || bioLower.includes('lideran') || bioLower.includes('tech lead')) {
      cues.push('confident leader demeanor');
    }

    // Technical / intellectual
    if (bioLower.includes('desenvolvedor') || bioLower.includes('programo') || bioLower.includes('engenheiro') || bioLower.includes('developer')) {
      cues.push('intellectual and focused expression');
    }

    // Creative / artistic
    if (bioLower.includes('criativ') || bioLower.includes('artista') || bioLower.includes('design')) {
      cues.push('creative and expressive personality');
    }

    // Fitness / athletic
    if (bioLower.includes('fitness') || bioLower.includes('treino') || bioLower.includes('atleta') || bioLower.includes('academia')) {
      cues.push('athletic and energetic presence');
    }

    // Entrepreneurial
    if (bioLower.includes('empreendedor') || bioLower.includes('negócio') || bioLower.includes('empresa') || bioLower.includes('startup')) {
      cues.push('entrepreneurial and driven attitude');
    }

    // Parent / family
    if (bioLower.includes('pai ') || bioLower.includes('mãe ') || bioLower.includes('filho') || bioLower.includes('família')) {
      cues.push('warm and approachable family person');
    }

    return cues.slice(0, 3).join(', ');
  }

  static buildImagePrompt(basePrompt: string, context: ImagePromptContext): string {
    const parts = [basePrompt];

    if (context.scenario) parts.push(context.scenario);
    if (context.action) parts.push(context.action);
    if (context.style) parts.push(context.style);
    if (context.additionalDetails) parts.push(context.additionalDetails);

    return parts.join(', ');
  }

  static buildVideoPrompt(basePrompt: string, context: VideoPromptContext): string {
    const parts = [basePrompt];

    if (context.scenario) parts.push(context.scenario);
    if (context.action) parts.push(context.action);
    if (context.productName) parts.push(`showcasing ${context.productName}`);
    if (context.productDescription) parts.push(context.productDescription);
    if (context.cameraMovement) parts.push(context.cameraMovement);
    if (context.mood) parts.push(`${context.mood} mood`);

    return parts.join(', ');
  }
}
