import type { PersonaAttributes, ImagePromptContext, VideoPromptContext } from '@/lib/types/persona';

export class PromptBuilderService {
  static buildBasePrompt(attrs: PersonaAttributes): string {
    const parts: string[] = [];

    // Subject
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

    // Join with commas for clean prompt structure
    const subject = parts[0];
    const details = parts.slice(1);

    if (details.length === 0) return subject;
    return `${subject}, ${details.join(', ')}`;
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
