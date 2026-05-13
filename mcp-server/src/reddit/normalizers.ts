import type {
  RedditComment,
  RedditPost,
  RedditPostListing,
  SubredditInfo
} from "./types.js";

const REDDIT_ORIGIN = "https://www.reddit.com";

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord {
  return value && typeof value === "object" ? (value as UnknownRecord) : {};
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function permalink(value: unknown): string {
  const path = asString(value);
  if (path.startsWith("https://") || path.startsWith("http://")) {
    return path;
  }
  return `${REDDIT_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

export function normalizePostListing(payload: unknown): RedditPostListing {
  const data = asRecord(asRecord(payload).data);
  const children = Array.isArray(data.children) ? data.children : [];

  return {
    after: typeof data.after === "string" ? data.after : null,
    posts: children.map((child) => normalizePost(asRecord(asRecord(child).data)))
  };
}

export function normalizePost(data: UnknownRecord): RedditPost {
  return {
    id: asString(data.id),
    fullname: asString(data.name),
    subreddit: asString(data.subreddit),
    title: asString(data.title),
    selftext: asString(data.selftext),
    author: asString(data.author, "[deleted]"),
    score: asNumber(data.score),
    commentCount: asNumber(data.num_comments),
    createdUtc: asNumber(data.created_utc),
    permalink: permalink(data.permalink),
    url: asString(data.url),
    isNsfw: asBoolean(data.over_18)
  };
}

export function normalizeCommentListing(payload: unknown): RedditComment[] {
  const listing = Array.isArray(payload) ? payload[1] ?? payload[0] : payload;
  return flattenComments(listing, 0);
}

function flattenComments(listing: unknown, depth: number): RedditComment[] {
  const data = asRecord(asRecord(listing).data);
  const children = Array.isArray(data.children) ? data.children : [];

  return children.flatMap((child) => {
    const childRecord = asRecord(child);
    if (childRecord.kind !== "t1") {
      return [];
    }

    const commentData = asRecord(childRecord.data);
    const comment: RedditComment = {
      id: asString(commentData.id),
      fullname: asString(commentData.name),
      parentId: asString(commentData.parent_id),
      postFullname: asString(commentData.link_id),
      author: asString(commentData.author, "[deleted]"),
      body: asString(commentData.body),
      score: asNumber(commentData.score),
      createdUtc: asNumber(commentData.created_utc),
      permalink: permalink(commentData.permalink),
      depth
    };

    const replies =
      typeof commentData.replies === "object"
        ? flattenComments(commentData.replies, depth + 1)
        : [];

    return [comment, ...replies];
  });
}

export function normalizeSubredditInfo(payload: unknown): SubredditInfo {
  const data = asRecord(asRecord(payload).data);
  return {
    id: asString(data.id),
    displayName: asString(data.display_name),
    title: asString(data.title),
    publicDescription: asString(data.public_description),
    subscribers: asNumber(data.subscribers),
    activeUserCount:
      typeof data.active_user_count === "number" ? data.active_user_count : null,
    over18: asBoolean(data.over18),
    url: permalink(data.url)
  };
}
