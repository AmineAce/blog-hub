// lib/contentful.ts
import { createClient } from 'contentful';

if (!process.env.CONTENTFUL_SPACE_ID) {
  throw new Error('CONTENTFUL_SPACE_ID is missing');
}
if (!process.env.CONTENTFUL_ACCESS_TOKEN) {
  throw new Error('CONTENTFUL_ACCESS_TOKEN is missing');
}

export const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
});

export async function getAllPosts() {
  const entries = await client.getEntries({
    content_type: 'post',
    order: ['-fields.publishedAt'],
  });

  return entries.items.map((entry: any) => ({
    title: entry.fields.title,
    slug: entry.fields.slug,
    excerpt: entry.fields.excerpt,
    publishedAt: entry.fields.publishedAt,
    tags: entry.fields.tags,
  }));
}
