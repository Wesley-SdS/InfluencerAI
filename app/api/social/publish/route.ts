import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/utils/auth'
import { socialPublishService } from '@/lib/services/social/social-publish-service'
import { publishSchema } from '@/lib/validations/social'

// POST /api/social/publish - Publish immediately
async function handler(req: NextRequest, context: { userId: string }) {
  try {
    const body = await req.json()

    // Validate input
    const validation = publishSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const data = validation.data

    // Publish now
    const result = await socialPublishService.publishNow({
      socialAccountId: data.socialAccountId,
      mediaUrl: data.mediaUrl,
      mediaType: data.mediaType,
      caption: data.caption,
      hashtags: data.hashtags,
    })

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Published successfully',
    })
  } catch (error: any) {
    console.error('Publish error:', error)

    // Handle specific errors
    if (error.message?.includes('not found')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 404 }
      )
    }

    if (error.message?.includes('disconnected')) {
      return NextResponse.json(
        { success: false, error: error.message, code: 'ACCOUNT_DISCONNECTED' },
        { status: 403 }
      )
    }

    if (error.statusCode === 429) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Please try again later.',
          code: 'RATE_LIMIT',
        },
        { status: 429 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to publish',
        code: 'PUBLISH_FAILED',
      },
      { status: 500 }
    )
  }
}

export const POST = withAuth(handler)
