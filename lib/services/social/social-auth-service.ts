import { prisma } from '@/lib/db'
import { getEncryptionService } from '@/lib/services/encryption/aes-encryption.service'
import type { SocialTokens, SocialProfile } from '@/lib/types/social'
import type { SocialAccount } from '@prisma/client'

// ============================================
// SOCIAL AUTH SERVICE (Sprint 7)
// ============================================

export class SocialAuthService {
  private static instance: SocialAuthService
  private encryption = getEncryptionService()

  private constructor() {}

  static getInstance(): SocialAuthService {
    if (!SocialAuthService.instance) {
      SocialAuthService.instance = new SocialAuthService()
    }
    return SocialAuthService.instance
  }

  // ============================================
  // OAUTH URL GENERATION
  // ============================================

  getAuthorizationUrl(platform: string, userId: string, redirectUri: string): string {
    const state = this.generateState(userId)

    switch (platform) {
      case 'instagram':
        return this.getInstagramAuthUrl(state, redirectUri)
      case 'tiktok':
        return this.getTikTokAuthUrl(state, redirectUri)
      case 'youtube':
        return this.getYouTubeAuthUrl(state, redirectUri)
      default:
        throw new Error(`Platform not supported: ${platform}`)
    }
  }

  private getInstagramAuthUrl(state: string, redirectUri: string): string {
    const appId = process.env.INSTAGRAM_APP_ID
    if (!appId) {
      throw new Error('INSTAGRAM_APP_ID not configured')
    }

    const params = new URLSearchParams({
      client_id: appId,
      redirect_uri: redirectUri,
      scope: 'instagram_basic,instagram_content_publish',
      response_type: 'code',
      state,
    })

    return `https://api.instagram.com/oauth/authorize?${params.toString()}`
  }

  private getTikTokAuthUrl(state: string, redirectUri: string): string {
    // Stub implementation - will show "Coming Soon" in UI
    const clientKey = process.env.TIKTOK_CLIENT_KEY
    if (!clientKey) {
      throw new Error('TIKTOK_CLIENT_KEY not configured')
    }

    const params = new URLSearchParams({
      client_key: clientKey,
      redirect_uri: redirectUri,
      scope: 'user.info.basic,video.publish',
      response_type: 'code',
      state,
    })

    return `https://www.tiktok.com/v2/auth/authorize?${params.toString()}`
  }

  private getYouTubeAuthUrl(state: string, redirectUri: string): string {
    // Uses existing Google OAuth with youtube.upload scope
    const clientId = process.env.GOOGLE_CLIENT_ID
    if (!clientId) {
      throw new Error('GOOGLE_CLIENT_ID not configured')
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'https://www.googleapis.com/auth/youtube.upload',
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent',
      state,
    })

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  }

  // ============================================
  // OAUTH CALLBACK HANDLING
  // ============================================

  async handleCallback(
    platform: string,
    code: string,
    redirectUri: string
  ): Promise<{ tokens: SocialTokens; profile: SocialProfile }> {
    switch (platform) {
      case 'instagram':
        return this.handleInstagramCallback(code, redirectUri)
      case 'tiktok':
        return this.handleTikTokCallback(code, redirectUri)
      case 'youtube':
        return this.handleYouTubeCallback(code, redirectUri)
      default:
        throw new Error(`Platform not supported: ${platform}`)
    }
  }

  private async handleInstagramCallback(
    code: string,
    redirectUri: string
  ): Promise<{ tokens: SocialTokens; profile: SocialProfile }> {
    const appId = process.env.INSTAGRAM_APP_ID
    const appSecret = process.env.INSTAGRAM_APP_SECRET

    if (!appId || !appSecret) {
      throw new Error('Instagram OAuth not configured')
    }

    // Step 1: Exchange code for short-lived token
    const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: appId,
        client_secret: appSecret,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code,
      }),
    })

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text()
      throw new Error(`Instagram token exchange failed: ${error}`)
    }

    const tokenData = await tokenResponse.json()
    const shortLivedToken = tokenData.access_token
    const userId = tokenData.user_id

    // Step 2: Exchange for long-lived token (60 days)
    const longLivedResponse = await fetch(
      `https://graph.instagram.com/access_token?` +
        new URLSearchParams({
          grant_type: 'ig_exchange_token',
          client_secret: appSecret,
          access_token: shortLivedToken,
        })
    )

    if (!longLivedResponse.ok) {
      const error = await longLivedResponse.text()
      throw new Error(`Instagram long-lived token failed: ${error}`)
    }

    const longLivedData = await longLivedResponse.json()
    const accessToken = longLivedData.access_token
    const expiresIn = longLivedData.expires_in // seconds

    // Step 3: Fetch user profile
    const profileResponse = await fetch(
      `https://graph.instagram.com/me?fields=id,username,account_type&access_token=${accessToken}`
    )

    if (!profileResponse.ok) {
      const error = await profileResponse.text()
      throw new Error(`Instagram profile fetch failed: ${error}`)
    }

    const profileData = await profileResponse.json()

    return {
      tokens: {
        accessToken,
        expiresAt: new Date(Date.now() + expiresIn * 1000),
        scopes: 'instagram_basic,instagram_content_publish',
      },
      profile: {
        platformUserId: userId,
        username: profileData.username,
        displayName: profileData.username,
      },
    }
  }

  private async handleTikTokCallback(
    code: string,
    redirectUri: string
  ): Promise<{ tokens: SocialTokens; profile: SocialProfile }> {
    const clientKey = process.env.TIKTOK_CLIENT_KEY
    const clientSecret = process.env.TIKTOK_CLIENT_SECRET

    if (!clientKey || !clientSecret) {
      throw new Error('TikTok OAuth not configured')
    }

    // Step 1: Exchange code for tokens
    const tokenResponse = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_key: clientKey,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    })

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text()
      throw new Error(`TikTok token exchange failed: ${error}`)
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.data.access_token
    const refreshToken = tokenData.data.refresh_token
    const expiresIn = tokenData.data.expires_in // 24 hours
    const openId = tokenData.data.open_id
    const scopes = tokenData.data.scope

    // Step 2: Fetch user profile
    const profileResponse = await fetch(
      'https://open.tiktokapis.com/v2/user/info/?' +
        new URLSearchParams({
          fields: 'open_id,union_id,avatar_url,display_name,username',
        }),
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!profileResponse.ok) {
      const error = await profileResponse.text()
      throw new Error(`TikTok profile fetch failed: ${error}`)
    }

    const profileData = await profileResponse.json()
    const userInfo = profileData.data.user

    return {
      tokens: {
        accessToken,
        refreshToken,
        expiresAt: new Date(Date.now() + expiresIn * 1000),
        scopes,
      },
      profile: {
        platformUserId: openId,
        username: userInfo.username || userInfo.display_name,
        displayName: userInfo.display_name,
        avatarUrl: userInfo.avatar_url,
      },
    }
  }

  private async handleYouTubeCallback(
    code: string,
    redirectUri: string
  ): Promise<{ tokens: SocialTokens; profile: SocialProfile }> {
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      throw new Error('Google OAuth not configured')
    }

    // Step 1: Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text()
      throw new Error(`YouTube token exchange failed: ${error}`)
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token
    const refreshToken = tokenData.refresh_token // May be undefined if user already authorized
    const expiresIn = tokenData.expires_in
    const scopes = tokenData.scope

    // Step 2: Fetch YouTube channel profile
    const profileResponse = await fetch(
      'https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!profileResponse.ok) {
      const error = await profileResponse.text()
      throw new Error(`YouTube channel fetch failed: ${error}`)
    }

    const profileData = await profileResponse.json()

    if (!profileData.items || profileData.items.length === 0) {
      throw new Error('No YouTube channel found for this account')
    }

    const channel = profileData.items[0]

    return {
      tokens: {
        accessToken,
        refreshToken,
        expiresAt: new Date(Date.now() + expiresIn * 1000),
        scopes,
      },
      profile: {
        platformUserId: channel.id,
        username: channel.snippet.customUrl || channel.snippet.title,
        displayName: channel.snippet.title,
        avatarUrl: channel.snippet.thumbnails?.default?.url,
      },
    }
  }

  // ============================================
  // ACCOUNT MANAGEMENT
  // ============================================

  async connectAccount(
    userId: string,
    platform: string,
    tokens: SocialTokens,
    profile: SocialProfile
  ): Promise<SocialAccount> {
    // Encrypt access token
    const accessTokenEncrypted = this.encryption.encrypt(tokens.accessToken)

    // Encrypt refresh token if exists
    let refreshTokenEncrypted = null
    let refreshTokenIv = null
    let refreshTokenAuthTag = null

    if (tokens.refreshToken) {
      const encrypted = this.encryption.encrypt(tokens.refreshToken)
      refreshTokenEncrypted = encrypted.encrypted
      refreshTokenIv = encrypted.iv
      refreshTokenAuthTag = encrypted.authTag
    }

    // Upsert account (update if exists, create if not)
    const account = await prisma.socialAccount.upsert({
      where: {
        userId_platform_platformUserId: {
          userId,
          platform,
          platformUserId: profile.platformUserId,
        },
      },
      update: {
        accessTokenEncrypted: accessTokenEncrypted.encrypted,
        accessTokenIv: accessTokenEncrypted.iv,
        accessTokenAuthTag: accessTokenEncrypted.authTag,
        refreshTokenEncrypted,
        refreshTokenIv,
        refreshTokenAuthTag,
        tokenExpiresAt: tokens.expiresAt,
        scopes: tokens.scopes,
        platformUsername: profile.username,
        displayName: profile.displayName,
        avatarUrl: profile.avatarUrl,
        isActive: true,
        lastSyncAt: new Date(),
      },
      create: {
        userId,
        platform,
        platformUserId: profile.platformUserId,
        platformUsername: profile.username,
        displayName: profile.displayName,
        avatarUrl: profile.avatarUrl,
        accessTokenEncrypted: accessTokenEncrypted.encrypted,
        accessTokenIv: accessTokenEncrypted.iv,
        accessTokenAuthTag: accessTokenEncrypted.authTag,
        refreshTokenEncrypted,
        refreshTokenIv,
        refreshTokenAuthTag,
        tokenExpiresAt: tokens.expiresAt,
        scopes: tokens.scopes,
        isActive: true,
        lastSyncAt: new Date(),
      },
    })

    return account
  }

  async disconnectAccount(userId: string, accountId: string): Promise<void> {
    // Verify account belongs to user
    const account = await prisma.socialAccount.findFirst({
      where: { id: accountId, userId },
    })

    if (!account) {
      throw new Error('Account not found or unauthorized')
    }

    // Delete account (cascade will delete scheduled posts)
    await prisma.socialAccount.delete({
      where: { id: accountId },
    })
  }

  async listAccounts(userId: string): Promise<SocialAccount[]> {
    return prisma.socialAccount.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
  }

  // ============================================
  // TOKEN REFRESH
  // ============================================

  async refreshTokenIfNeeded(account: SocialAccount): Promise<SocialAccount> {
    // Check if token is expired or will expire in next hour
    if (!account.tokenExpiresAt) {
      return account // No expiry set, assume valid
    }

    const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000)
    if (account.tokenExpiresAt > oneHourFromNow) {
      return account // Token still valid
    }

    // Token expired or expiring soon, refresh it
    switch (account.platform) {
      case 'instagram':
        return this.refreshInstagramToken(account)
      case 'tiktok':
        return this.refreshTikTokToken(account)
      case 'youtube':
        return this.refreshYouTubeToken(account)
      default:
        throw new Error(`Token refresh not supported for platform: ${account.platform}`)
    }
  }

  private async refreshInstagramToken(account: SocialAccount): Promise<SocialAccount> {
    // Instagram long-lived tokens can be refreshed before expiry
    const appSecret = process.env.INSTAGRAM_APP_SECRET
    if (!appSecret) {
      throw new Error('INSTAGRAM_APP_SECRET not configured')
    }

    // Decrypt current token
    const currentToken = this.encryption.decrypt({
      encrypted: account.accessTokenEncrypted!,
      iv: account.accessTokenIv!,
      authTag: account.accessTokenAuthTag!,
    })

    // Refresh token
    const response = await fetch(
      `https://graph.instagram.com/refresh_access_token?` +
        new URLSearchParams({
          grant_type: 'ig_refresh_token',
          access_token: currentToken,
        })
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Instagram token refresh failed: ${error}`)
    }

    const data = await response.json()
    const newToken = data.access_token
    const expiresIn = data.expires_in

    // Encrypt new token
    const encrypted = this.encryption.encrypt(newToken)

    // Update account
    const updated = await prisma.socialAccount.update({
      where: { id: account.id },
      data: {
        accessTokenEncrypted: encrypted.encrypted,
        accessTokenIv: encrypted.iv,
        accessTokenAuthTag: encrypted.authTag,
        tokenExpiresAt: new Date(Date.now() + expiresIn * 1000),
        lastSyncAt: new Date(),
      },
    })

    return updated
  }

  private async refreshTikTokToken(account: SocialAccount): Promise<SocialAccount> {
    const clientKey = process.env.TIKTOK_CLIENT_KEY
    const clientSecret = process.env.TIKTOK_CLIENT_SECRET

    if (!clientKey || !clientSecret) {
      throw new Error('TIKTOK_CLIENT_KEY or TIKTOK_CLIENT_SECRET not configured')
    }

    // Decrypt current refresh token
    if (!account.refreshTokenEncrypted || !account.refreshTokenIv || !account.refreshTokenAuthTag) {
      throw new Error('No refresh token available for TikTok account')
    }

    const refreshToken = this.encryption.decrypt({
      encrypted: account.refreshTokenEncrypted,
      iv: account.refreshTokenIv,
      authTag: account.refreshTokenAuthTag,
    })

    // Refresh token
    const response = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_key: clientKey,
        client_secret: clientSecret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`TikTok token refresh failed: ${error}`)
    }

    const data = await response.json()
    const newAccessToken = data.data.access_token
    const newRefreshToken = data.data.refresh_token
    const expiresIn = data.data.expires_in

    // Encrypt new tokens
    const accessTokenEncrypted = this.encryption.encrypt(newAccessToken)
    const refreshTokenEncrypted = this.encryption.encrypt(newRefreshToken)

    // Update account
    const updated = await prisma.socialAccount.update({
      where: { id: account.id },
      data: {
        accessTokenEncrypted: accessTokenEncrypted.encrypted,
        accessTokenIv: accessTokenEncrypted.iv,
        accessTokenAuthTag: accessTokenEncrypted.authTag,
        refreshTokenEncrypted: refreshTokenEncrypted.encrypted,
        refreshTokenIv: refreshTokenEncrypted.iv,
        refreshTokenAuthTag: refreshTokenEncrypted.authTag,
        tokenExpiresAt: new Date(Date.now() + expiresIn * 1000),
        lastSyncAt: new Date(),
      },
    })

    return updated
  }

  private async refreshYouTubeToken(account: SocialAccount): Promise<SocialAccount> {
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      throw new Error('GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not configured')
    }

    // Decrypt refresh token
    if (!account.refreshTokenEncrypted || !account.refreshTokenIv || !account.refreshTokenAuthTag) {
      throw new Error('No refresh token available for YouTube account')
    }

    const refreshToken = this.encryption.decrypt({
      encrypted: account.refreshTokenEncrypted,
      iv: account.refreshTokenIv,
      authTag: account.refreshTokenAuthTag,
    })

    // Refresh access token
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`YouTube token refresh failed: ${error}`)
    }

    const data = await response.json()
    const newAccessToken = data.access_token
    const expiresIn = data.expires_in

    // Encrypt new access token
    const accessTokenEncrypted = this.encryption.encrypt(newAccessToken)

    // Update account (refresh_token stays the same)
    const updated = await prisma.socialAccount.update({
      where: { id: account.id },
      data: {
        accessTokenEncrypted: accessTokenEncrypted.encrypted,
        accessTokenIv: accessTokenEncrypted.iv,
        accessTokenAuthTag: accessTokenEncrypted.authTag,
        tokenExpiresAt: new Date(Date.now() + expiresIn * 1000),
        lastSyncAt: new Date(),
      },
    })

    return updated
  }

  // ============================================
  // HELPERS
  // ============================================

  private generateState(userId: string): string {
    // Generate CSRF state token
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 15)
    return Buffer.from(`${userId}:${timestamp}:${random}`).toString('base64')
  }

  async verifyState(state: string, userId: string): Promise<boolean> {
    try {
      const decoded = Buffer.from(state, 'base64').toString('utf-8')
      const [stateUserId, timestamp] = decoded.split(':')

      // Verify user ID matches
      if (stateUserId !== userId) {
        return false
      }

      // Verify state not expired (10 minutes)
      const tenMinutesAgo = Date.now() - 10 * 60 * 1000
      if (parseInt(timestamp) < tenMinutesAgo) {
        return false
      }

      return true
    } catch {
      return false
    }
  }

  async getDecryptedToken(account: SocialAccount): Promise<string> {
    if (!account.accessTokenEncrypted || !account.accessTokenIv || !account.accessTokenAuthTag) {
      throw new Error('Account has no encrypted token')
    }

    return this.encryption.decrypt({
      encrypted: account.accessTokenEncrypted,
      iv: account.accessTokenIv,
      authTag: account.accessTokenAuthTag,
    })
  }
}

export const socialAuthService = SocialAuthService.getInstance()
