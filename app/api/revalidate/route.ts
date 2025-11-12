import { NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(request: Request) {
  try {
    const { secret, path, tag } = await request.json()

    // Validate the webhook secret
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
    }

    // Revalidate specific paths
    if (path) {
      revalidatePath(path)
      console.log(`Revalidated path: ${path}`)
    }

    // Revalidate by tag
    if (tag) {
      revalidateTag(tag)
      console.log(`Revalidated tag: ${tag}`)
    }

    return NextResponse.json({ revalidated: true, path, tag })
  } catch (error) {
    console.error('Error revalidating:', error)
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 })
  }
}
