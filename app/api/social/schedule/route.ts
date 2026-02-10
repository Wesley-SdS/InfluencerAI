import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/utils/auth'
import { schedulerService } from '@/lib/services/social/scheduler-service'
import { scheduleSchema } from '@/lib/validations/social'

// POST /api/social/schedule - Schedule a post
async function handler(req: NextRequest, context: { userId: string }) {
  try {
    const body = await req.json()

    // Validate input
    const validation = scheduleSchema.safeParse(body)
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

    // Schedule post
    const post = await schedulerService.schedulePost(context.userId, {
      socialAccountId: data.socialAccountId,
      campaignId: data.campaignId,
      mediaUrl: data.mediaUrl,
      mediaType: data.mediaType,
      caption: data.caption,
      hashtags: data.hashtags,
      scheduledFor: data.scheduledFor,
    })

    return NextResponse.json({
      success: true,
      data: post,
      message: 'Post scheduled successfully',
    })
  } catch (error: any) {
    console.error('Schedule error:', error)

    if (error.message?.includes('not found')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 404 }
      )
    }

    if (error.message?.includes('disconnected')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 403 }
      )
    }

    if (error.message?.includes('future')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      )
    }

    if (error.message?.includes('not accessible')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to schedule post' },
      { status: 500 }
    )
  }
}

export const POST = withAuth(handler)
