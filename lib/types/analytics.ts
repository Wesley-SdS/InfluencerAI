// ============================================
// ANALYTICS TYPES (Sprint 9)
// ============================================

export interface TrackEventParams {
  userId: string
  eventType: 'generation' | 'campaign_execution' | 'publish' | 'download' | 'lip_sync' | 'voice_generation' | 'composition'
  eventData?: Record<string, unknown>
  personaId?: string
  campaignId?: string
  platform?: string
  creditsUsed?: number
  durationMs?: number
}

export interface DashboardMetrics {
  totalGenerations: number
  generationsByType: Record<string, number>
  totalCampaigns: number
  campaignsByStatus: Record<string, number>
  totalPublished: number
  publishedByPlatform: Record<string, number>
  creditsUsed: number
  creditsRemaining: number
  avgGenerationTime: number
  topPersonas: { id: string; name: string; count: number }[]
  topTemplates: { id: string; name: string; count: number }[]
  dailyActivity: { date: string; generations: number; campaigns: number; publishes: number }[]
}

export interface EngagementMetrics {
  totalPosts: number
  totalLikes: number
  totalComments: number
  totalViews: number
  avgEngagementRate: number
  bestPerformingPost: { id: string; platformPostUrl?: string; likes: number; platform: string } | null
  engagementByPlatform: { platform: string; posts: number; avgEngagement: number }[]
  engagementOverTime: { date: string; likes: number; comments: number; views: number }[]
}

export interface CostMetrics {
  totalSpent: number
  spentByType: Record<string, number>
  averageCostPerCampaign: number
  costOverTime: { date: string; credits: number }[]
  projectedMonthlyUsage: number
}

export type AnalyticsPeriod = '7d' | '30d' | '90d' | 'all'

export interface EngagementData {
  likes?: number
  comments?: number
  shares?: number
  views?: number
  reach?: number
  impressions?: number
}
