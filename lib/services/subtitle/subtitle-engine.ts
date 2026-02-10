import {
  CAPTION_PRESETS,
  DEFAULT_CAPTION_STYLE,
  type CaptionPreset,
  type CaptionSegment,
  type CaptionStyle,
  type SegmentationMode,
} from '@/lib/types/caption';

export class SubtitleEngine {
  private static instance: SubtitleEngine;

  private constructor() {}

  static getInstance(): SubtitleEngine {
    if (!SubtitleEngine.instance) {
      SubtitleEngine.instance = new SubtitleEngine();
    }
    return SubtitleEngine.instance;
  }

  generateSegments(
    text: string,
    totalDuration: number,
    mode: SegmentationMode = 'timed'
  ): CaptionSegment[] {
    const cleanText = text.trim();
    if (!cleanText || totalDuration <= 0) return [];

    switch (mode) {
      case 'word':
        return this.segmentByWord(cleanText, totalDuration);
      case 'sentence':
        return this.segmentBySentence(cleanText, totalDuration);
      case 'timed':
      default:
        return this.segmentByTimed(cleanText, totalDuration);
    }
  }

  generateSRT(segments: CaptionSegment[]): string {
    return segments
      .map((seg, i) => {
        const start = this.formatSRTTime(seg.startTime);
        const end = this.formatSRTTime(seg.endTime);
        return `${i + 1}\n${start} --> ${end}\n${seg.text}\n`;
      })
      .join('\n');
  }

  generateASS(segments: CaptionSegment[], style: CaptionStyle): string {
    const header = [
      '[Script Info]',
      'Title: Generated Captions',
      'ScriptType: v4.00+',
      'PlayResX: 1920',
      'PlayResY: 1080',
      '',
      '[V4+ Styles]',
      'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding',
      `Style: Default,${style.fontFamily},${style.fontSize},${this.colorToASSColor(style.color)},${this.colorToASSColor(style.color)},${this.colorToASSColor(style.strokeColor)},${this.colorToASSColor(style.backgroundColor, style.backgroundOpacity)},${style.fontWeight >= 700 ? -1 : 0},0,0,0,100,100,${style.letterSpacing},0,1,${style.strokeWidth},0,${this.positionToAlignment(style.position)},20,20,40,1`,
      '',
      '[Events]',
      'Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text',
    ];

    const events = segments.map((seg) => {
      const start = this.formatASSTime(seg.startTime);
      const end = this.formatASSTime(seg.endTime);
      const fadeDuration = Math.round(style.animationDuration * 1000);
      const fadeTag = fadeDuration > 0 ? `{\\fad(${fadeDuration},${Math.round(fadeDuration / 2)})}` : '';
      return `Dialogue: 0,${start},${end},Default,,0,0,0,,${fadeTag}${seg.text}`;
    });

    return [...header, ...events].join('\n');
  }

  getPreset(presetId: string): CaptionPreset | undefined {
    return CAPTION_PRESETS.find((p) => p.id === presetId);
  }

  resolveStyle(
    presetId?: string,
    customStyle?: Partial<CaptionStyle>
  ): CaptionStyle {
    const preset = presetId ? this.getPreset(presetId) : undefined;
    const base = preset?.style ?? DEFAULT_CAPTION_STYLE;

    if (!customStyle) return { ...base };

    return {
      ...base,
      ...Object.fromEntries(
        Object.entries(customStyle).filter(([, v]) => v !== undefined)
      ),
    } as CaptionStyle;
  }

  // --- Private helpers ---

  private segmentByWord(text: string, totalDuration: number): CaptionSegment[] {
    const words = text.split(/\s+/).filter(Boolean);
    if (words.length === 0) return [];

    const durationPerWord = totalDuration / words.length;
    return words.map((word, i) => ({
      index: i,
      text: word,
      startTime: i * durationPerWord,
      endTime: (i + 1) * durationPerWord,
    }));
  }

  private segmentBySentence(text: string, totalDuration: number): CaptionSegment[] {
    const sentences = text
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (sentences.length === 0) return [];

    const totalChars = sentences.reduce((sum, s) => sum + s.length, 0);
    let currentTime = 0;

    return sentences.map((sentence, i) => {
      const proportion = sentence.length / totalChars;
      const duration = proportion * totalDuration;
      const segment: CaptionSegment = {
        index: i,
        text: sentence,
        startTime: currentTime,
        endTime: currentTime + duration,
      };
      currentTime += duration;
      return segment;
    });
  }

  private segmentByTimed(text: string, totalDuration: number): CaptionSegment[] {
    const words = text.split(/\s+/).filter(Boolean);
    if (words.length === 0) return [];

    const chunkSize = 3;
    const chunks = this.splitIntoChunks(words, chunkSize);
    const durationPerChunk = totalDuration / chunks.length;

    return chunks.map((chunk, i) => ({
      index: i,
      text: chunk.join(' '),
      startTime: i * durationPerChunk,
      endTime: (i + 1) * durationPerChunk,
    }));
  }

  private splitIntoChunks(words: string[], chunkSize: number): string[][] {
    const chunks: string[][] = [];
    for (let i = 0; i < words.length; i += chunkSize) {
      chunks.push(words.slice(i, i + chunkSize));
    }
    return chunks;
  }

  private formatSRTTime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const ms = Math.round((seconds % 1) * 1000);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
  }

  private formatASSTime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const cs = Math.round((seconds % 1) * 100);
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
  }

  private colorToASSColor(hexColor: string, opacity?: number): string {
    const hex = hexColor.replace('#', '');
    const r = hex.substring(0, 2);
    const g = hex.substring(2, 4);
    const b = hex.substring(4, 6);
    // ASS uses &HAABBGGRR format (alpha, blue, green, red)
    const alpha = opacity !== undefined
      ? String(Math.round((1 - opacity) * 255).toString(16)).padStart(2, '0').toUpperCase()
      : '00';
    return `&H${alpha}${b.toUpperCase()}${g.toUpperCase()}${r.toUpperCase()}&`;
  }

  private positionToAlignment(position: CaptionStyle['position']): number {
    // ASS alignment: 1-3 bottom, 4-6 middle, 7-9 top (numpad layout)
    switch (position) {
      case 'top': return 8;    // top center
      case 'center': return 5; // middle center
      case 'bottom': return 2; // bottom center
      default: return 2;
    }
  }
}
