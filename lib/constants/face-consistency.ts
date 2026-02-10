import type { FaceConsistencyStrategyConfig, FaceConsistencyStrategyName } from '@/lib/types/face-consistency';

export const FACE_CONSISTENCY_STRATEGIES: Record<FaceConsistencyStrategyName, FaceConsistencyStrategyConfig> = {
  'ip-adapter-faceid': {
    name: 'ip-adapter-faceid',
    label: 'IP-Adapter FaceID',
    modelId: 'lucataco/ip-adapter-faceid',
    description: 'Melhor para manter identidade facial com flexibilidade de estilo',
    inputMapping: {
      faceImage: 'face_image',
      prompt: 'prompt',
      strength: 'ip_adapter_scale',
    },
    defaultStrength: 0.6,
    minStrength: 0.0,
    maxStrength: 1.5,
    strengthStep: 0.05,
  },
  'instant-id': {
    name: 'instant-id',
    label: 'InstantID',
    modelId: 'zsxkib/instant-id',
    description: 'Alta fidelidade facial, ideal para retratos realistas',
    inputMapping: {
      faceImage: 'image',
      prompt: 'prompt',
      strength: 'controlnet_conditioning_scale',
    },
    defaultStrength: 0.8,
    minStrength: 0.0,
    maxStrength: 1.0,
    strengthStep: 0.05,
  },
  'photomaker': {
    name: 'photomaker',
    label: 'PhotoMaker',
    modelId: 'tencentarc/photomaker',
    description: 'Versátil para diferentes estilos e contextos. Inclua "img" no prompt.',
    inputMapping: {
      faceImage: 'input_image',
      prompt: 'prompt',
      strength: 'style_strength_ratio',
    },
    defaultStrength: 20,
    minStrength: 15,
    maxStrength: 50,
    strengthStep: 1,
  },
};

export const DEFAULT_STRATEGY: FaceConsistencyStrategyName = 'ip-adapter-faceid';

export const FACE_CONSISTENCY_STRATEGY_LIST = Object.values(FACE_CONSISTENCY_STRATEGIES);
