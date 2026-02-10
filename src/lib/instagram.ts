// Instagram Graph API helper functions

export interface InstagramMediaItem {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}

interface InstagramPagingCursor {
  before: string;
  after: string;
}

interface InstagramMediaResponse {
  data: InstagramMediaItem[];
  paging?: {
    cursors: InstagramPagingCursor;
    next?: string;
  };
}

/**
 * Fetch posts from the Instagram Graph API.
 * Handles pagination up to the specified limit.
 */
export async function fetchInstagramPosts(
  accessToken: string,
  userId: string,
  limit: number = 30
): Promise<InstagramMediaItem[]> {
  const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
  const pageSize = Math.min(limit, 100); // Instagram API max per page is 100

  // Use Facebook Graph API endpoint (works with Page tokens; graph.instagram.com requires user tokens)
  const url = `https://graph.facebook.com/v24.0/${userId}/media?fields=${fields}&limit=${pageSize}&access_token=${accessToken}`;

  const posts: InstagramMediaItem[] = [];
  let nextUrl: string | null = url;

  while (nextUrl && posts.length < limit) {
    const response = await fetch(nextUrl);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Instagram API error: ${error.error?.message || response.statusText}`
      );
    }

    const data: InstagramMediaResponse = await response.json();
    posts.push(...data.data);

    nextUrl = data.paging?.next || null;
  }

  return posts.slice(0, limit);
}

/**
 * Validate that the access token is still working.
 * Page tokens derived from long-lived user tokens don't expire,
 * so this just confirms the token is still valid.
 */
export async function refreshInstagramToken(
  accessToken: string
): Promise<{ accessToken: string; expiresIn: number }> {
  // Page tokens don't expire, so we just validate it still works
  const url = `https://graph.facebook.com/v24.0/me?access_token=${accessToken}`;

  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `Token validation error: ${error.error?.message || response.statusText}`
    );
  }

  // Token is valid — return it as-is
  return {
    accessToken,
    expiresIn: 0, // Page tokens don't expire
  };
}
