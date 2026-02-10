export type LipSyncModel = 'sadtalker' | 'wav2lip' | 'liveportrait';

export interface LipSyncModelInfo {
  id: LipSyncModel;
  name: string;
  replicateModelId: string;
  description: string;
  pros: string[];
  cons: string[];
}

export interface LipSyncParams {
  personaId: string;
  imageUrl: string;
  audioUrl: string;
  model: LipSyncModel;
}

export interface LipSyncResult {
  videoUrl: string;
  publicId: string;
  model: LipSyncModel;
  durationMs: number;
}

export const LIP_SYNC_MODELS: LipSyncModelInfo[] = [
  {
    id: 'sadtalker',
    name: 'SadTalker',
    replicateModelId: 'lucataco/sadtalker',
    description: 'Gera movimentos faciais naturais a partir de imagem e audio',
    pros: ['Movimentos naturais', 'Boa qualidade geral'],
    cons: ['Mais lento'],
  },
  {
    id: 'wav2lip',
    name: 'Wav2Lip',
    replicateModelId: 'devxpy/cog-wav2lip',
    description: 'Sincronizacao labial precisa com alta fidelidade',
    pros: ['Sincronizacao precisa', 'Rapido'],
    cons: ['Menos movimentos corporais'],
  },
  {
    id: 'liveportrait',
    name: 'LivePortrait',
    replicateModelId: 'fofr/live-portrait',
    description: 'Anima retratos com expressoes faciais dinamicas',
    pros: ['Expressoes ricas', 'Visual cinematografico'],
    cons: ['Requer imagem de alta qualidade'],
  },
];

export const DEFAULT_LIP_SYNC_MODEL: LipSyncModel = 'sadtalker';
