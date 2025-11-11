import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import { draftMode } from 'next/headers';

export async function GET() {
  // Disable draft mode
  (await draftMode()).disable();
  
  // Redirect to blog home
  redirect('/blog');
}
