import { NextResponse } from 'next/server';
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');

  // DEBUG: Log what we're getting
  console.log('Secret received:', secret);
  console.log('Env secret:', process.env.CONTENTFUL_PREVIEW_SECRET);
  console.log('Slug:', slug);

  if (secret !== process.env.CONTENTFUL_PREVIEW_SECRET) {
    return new NextResponse('Invalid token', { status: 401 });
  }

  if (!slug) {
    return new NextResponse('Missing slug', { status: 400 });
  }

  // Enable draft mode and redirect
  (await draftMode()).enable();
  redirect(`/posts/${slug}`);
}
