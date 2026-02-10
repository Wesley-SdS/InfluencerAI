import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/utils/auth'
import { VideoCompositionService } from '@/lib/services/composition/video-composition.service'
import { trimVideoSchema } from '@/lib/validations/composition'

// POST /api/composition/trim
// Trims video (no credit cost, utility endpoint)
async function handler(req: NextRequest, context: { userId: string }) {
  try {
    const body = await req.json()

    // Validate
    const validated = trimVideoSchema.parse(body)

    const videoCompositionService = VideoCompositionService.getInstance()

    // Check if FFmpeg is available
    if (!videoCompositionService.isFFmpegAvailable()) {
      return NextResponse.json(
        {
          error: 'FFmpeg not available on server. Video trimming requires FFmpeg.',
          code: 'FFMPEG_NOT_AVAILABLE',
        },
        { status: 503 }
      )
    }

    // Trim video
    const result = await videoCompositionService.trimVideo(validated)

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to trim video' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      composedUrl: result.url,
      publicId: result.publicId,
      duration: result.duration,
      width: result.width,
      height: result.height,
    })
  } catch (error: any) {
    console.error('[Trim Video Error]:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to trim video' },
      { status: 500 }
    )
  }
}

export const POST = withAuth(handler)
