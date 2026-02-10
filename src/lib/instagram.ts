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

interface InstagramTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
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

  const url = `https://graph.instagram.com/v18.0/${userId}/media?fields=${fields}&limit=${pageSize}&access_token=${accessToken}`;

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
 * Refresh a long-lived Instagram access token.
 * Tokens should be refreshed before they expire (every 60 days).
 * The plan auto-refreshes on the 1st and 15th of each month.
 */
export async function refreshInstagramToken(
  accessToken: string
): Promise<{ accessToken: string; expiresIn: number }> {
  const url = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${accessToken}`;

  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `Token refresh error: ${error.error?.message || response.statusText}`
    );
  }

  const data: InstagramTokenResponse = await response.json();

  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in,
  };
}
