export interface CreatePersonaDTO {
  name: string
  bio?: string
  gender?: string
  ageRange?: string
  ethnicity?: string
  bodyType?: string
  hairColor?: string
  hairStyle?: string
  eyeColor?: string
  distinctiveFeatures?: string
  styleDescription?: string
  niche?: string
  targetPlatform?: string
  contentTone?: string
  language?: string
}

export interface UpdatePersonaDTO extends Partial<CreatePersonaDTO> {}

export interface PersonaFilters {
  niche?: string
  targetPlatform?: string
  isActive?: boolean
  isArchived?: boolean
  search?: string
  page?: number
  limit?: number
  orderBy?: 'createdAt' | 'name' | 'updatedAt'
  orderDir?: 'asc' | 'desc'
}

export interface PersonaAttributes {
  gender?: string
  ageRange?: string
  ethnicity?: string
  bodyType?: string
  hairColor?: string
  hairStyle?: string
  eyeColor?: string
  distinctiveFeatures?: string
  styleDescription?: string
}

export interface ImagePromptContext {
  scenario?: string
  action?: string
  style?: string
  additionalDetails?: string
}

export interface VideoPromptContext {
  scenario?: string
  action?: string
  productName?: string
  productDescription?: string
  cameraMovement?: string
  mood?: string
}

export interface PersonaAssetData {
  id: string
  personaId: string
  type: string
  url: string
  publicId: string | null
  prompt: string | null
  modelId: string | null
  metadata: Record<string, unknown> | null
  isFavorite: boolean
  createdAt: Date
}

export interface PersonaData {
  id: string
  userId: string
  name: string
  slug: string
  bio: string | null
  gender: string | null
  ageRange: string | null
  ethnicity: string | null
  bodyType: string | null
  hairColor: string | null
  hairStyle: string | null
  eyeColor: string | null
  distinctiveFeatures: string | null
  styleDescription: string | null
  niche: string | null
  targetPlatform: string | null
  contentTone: string | null
  language: string
  referenceImageUrl: string | null
  referenceImageId: string | null
  voiceProvider: string | null
  voiceId: string | null
  voiceName: string | null
  voicePreviewUrl: string | null
  voiceSettings: Record<string, unknown> | null
  basePrompt: string | null
  isActive: boolean
  isArchived: boolean
  assets: PersonaAssetData[]
  _count: { generations: number }
  createdAt: Date
  updatedAt: Date
}

export interface PaginatedPersonas {
  personas: PersonaData[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export const PERSONA_NICHES = [
  { value: 'fitness', label: 'Fitness & Saúde' },
  { value: 'beauty', label: 'Beleza & Maquiagem' },
  { value: 'tech', label: 'Tecnologia' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'fashion', label: 'Moda' },
  { value: 'food', label: 'Gastronomia' },
  { value: 'travel', label: 'Viagem' },
  { value: 'gaming', label: 'Games' },
  { value: 'education', label: 'Educação' },
  { value: 'business', label: 'Negócios' },
] as const

export const PERSONA_PLATFORMS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'all', label: 'Todas' },
] as const

export const PERSONA_TONES = [
  { value: 'professional', label: 'Profissional' },
  { value: 'casual', label: 'Casual' },
  { value: 'fun', label: 'Divertido' },
  { value: 'luxurious', label: 'Luxuoso' },
  { value: 'educational', label: 'Educativo' },
] as const

export const PERSONA_GENDERS = [
  { value: 'female', label: 'Feminino' },
  { value: 'male', label: 'Masculino' },
  { value: 'non-binary', label: 'Não-binário' },
  { value: 'other', label: 'Outro' },
] as const

export const PERSONA_AGE_RANGES = [
  { value: '18-25', label: '18-25 anos' },
  { value: '26-35', label: '26-35 anos' },
  { value: '36-45', label: '36-45 anos' },
  { value: '46+', label: '46+ anos' },
] as const

export const PERSONA_BODY_TYPES = [
  { value: 'slim', label: 'Magro' },
  { value: 'athletic', label: 'Atlético' },
  { value: 'average', label: 'Médio' },
  { value: 'curvy', label: 'Curvilíneo' },
  { value: 'plus-size', label: 'Plus Size' },
] as const
