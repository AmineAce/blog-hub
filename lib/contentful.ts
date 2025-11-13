// lib/contentful.ts
import { createClient } from 'contentful';

let client: any = null;
let previewClient: any = null;

function getClient(preview = false) {
  if (preview) {
    if (!previewClient) {
      const spaceId = process.env.CONTENTFUL_SPACE_ID;
      const previewToken = process.env.CONTENTFUL_PREVIEW_TOKEN;

      if (!spaceId || !previewToken) {
        throw new Error('Contentful preview environment variables are not configured. Please set CONTENTFUL_SPACE_ID and CONTENTFUL_PREVIEW_TOKEN in your .env.local file.');
      }

      previewClient = createClient({
        space: spaceId,
        accessToken: previewToken,
        host: 'preview.contentful.com',
        environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
      });
    }
    return previewClient;
  } else {
    if (!client) {
      const spaceId = process.env.CONTENTFUL_SPACE_ID;
      const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

      if (!spaceId || !accessToken) {
        throw new Error('Contentful environment variables are not configured. Please set CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN in your .env.local file.');
      }

      client = createClient({
        space: spaceId,
        accessToken: accessToken,
        environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
      });
    }
    return client;
  }
}

export { getClient as client };

export async function getAllPosts(preview = false) {
  const entries = await getClient(preview).getEntries({
    content_type: 'post',
    order: ['-fields.publishedAt'],
    include: 2, // Include linked assets (featured images)
  });

  const posts = entries.items.map((entry: any) => ({
    title: entry.fields.title,
    slug: entry.fields.slug,
    excerpt: entry.fields.excerpt,
    publishedAt: entry.fields.publishedAt,
    tags: entry.fields.tags,
    content: entry.fields.body, // The rich text content is in the 'body' field
    featuredImage: entry.fields.featuredImage?.fields?.file?.url
      ? `https:${entry.fields.featuredImage.fields.file.url}`
      : null,
  }));

  // Sort posts by publishedAt descending to ensure latest first
  return posts.sort((a: any, b: any) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function getPostBySlug(slug: string, preview = false) {
  const entries = await getClient(preview).getEntries({
    content_type: 'post',
    'fields.slug': slug,
    limit: 1,
    include: 2, // Include linked assets
  });

  if (entries.items.length === 0) {
    return null;
  }

  const entry = entries.items[0];
  return {
    title: entry.fields.title,
    slug: entry.fields.slug,
    excerpt: entry.fields.excerpt,
    publishedAt: entry.fields.publishedAt,
    tags: entry.fields.tags,
    content: entry.fields.body, // Rich text content is in 'body' field
    featuredImage: entry.fields.featuredImage?.fields?.file?.url
      ? `https:${entry.fields.featuredImage.fields.file.url}`
      : null,
  };
}

export async function getPostSlugs(preview = false) {
  const entries = await getClient(preview).getEntries({
    content_type: 'post',
    select: ['fields.slug'],
  });

  return entries.items.map((entry: any) => entry.fields.slug);
}
