import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Log error details to console (will appear in Netlify Function logs)
    console.error('CLIENT ERROR:', {
      timestamp: body.timestamp || new Date().toISOString(),
      message: body.message,
      stack: body.stack,
      url: body.url,
      userAgent: body.userAgent,
      type: body.type || 'error',
    })
    
    // Additional context
    console.error('ERROR CONTEXT:', {
      referrer: request.headers.get('referer'),
      origin: request.headers.get('origin'),
      ip: request.headers.get('x-forwarded-for') || 'unknown',
    })
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Failed to process error log:', error)
    return new Response(JSON.stringify({ success: false }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
