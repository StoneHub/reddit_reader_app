import {
  normalizeCommentListing,
  normalizePost,
  normalizePostListing,
  normalizeSubredditInfo
} from "./normalizers.js";
import type {
  ListingOptions,
  PostCommentsOptions,
  RedditClientConfig,
  RedditComment,
  RedditFetch,
  RedditPost,
  RedditPostListing,
  SubredditInfo,
  SubredditPostsOptions
} from "./types.js";

type AccessToken = {
  value: string;
  expiresAt: number;
};

export class RedditClient {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly userAgent: string;
  private readonly fetchImpl: RedditFetch;
  private token: AccessToken | null = null;

  constructor(config: RedditClientConfig) {
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.userAgent = config.userAgent;
    this.fetchImpl = config.fetch ?? fetch;
  }

  async searchPosts(options: ListingOptions): Promise<RedditPostListing> {
    const subreddit = options.subreddit
      ? `/r/${encodeURIComponent(options.subreddit)}`
      : "";
    const params = new URLSearchParams({
      limit: String(clampLimit(options.limit)),
      q: options.query ?? "",
      restrict_sr: options.subreddit ? "true" : "false",
      sort: options.sort ?? "relevance",
      t: options.time ?? "month"
    });

    if (options.after) {
      params.set("after", options.after);
    }

    const payload = await this.get(`${subreddit}/search?${params.toString()}`);
    return normalizePostListing(payload);
  }

  async getSubredditPosts(
    options: SubredditPostsOptions
  ): Promise<RedditPostListing> {
    const sort = options.sort ?? "hot";
    const params = new URLSearchParams({
      limit: String(clampLimit(options.limit))
    });

    if (sort === "top") {
      params.set("t", options.time ?? "month");
    }
    if (options.after) {
      params.set("after", options.after);
    }

    const payload = await this.get(
      `/r/${encodeURIComponent(options.subreddit)}/${sort}?${params.toString()}`
    );
    return normalizePostListing(payload);
  }

  async getPostByFullname(fullname: string): Promise<RedditPost | null> {
    const params = new URLSearchParams({ id: fullname });
    const payload = await this.get(`/api/info?${params.toString()}`);
    const listing = normalizePostListing(payload);
    return listing.posts[0] ?? null;
  }

  async getPostComments(options: PostCommentsOptions): Promise<RedditComment[]> {
    const params = new URLSearchParams({
      limit: String(clampLimit(options.limit)),
      sort: options.sort ?? "confidence",
      depth: String(options.depth ?? 4),
      raw_json: "1"
    });

    const payload = await this.get(
      `/r/${encodeURIComponent(options.subreddit)}/comments/${encodeURIComponent(
        options.postId
      )}.json?${params.toString()}`
    );
    return normalizeCommentListing(payload);
  }

  async getSubredditInfo(subreddit: string): Promise<SubredditInfo> {
    const payload = await this.get(
      `/r/${encodeURIComponent(subreddit)}/about.json`
    );
    return normalizeSubredditInfo(payload);
  }

  private async get(path: string): Promise<unknown> {
    const token = await this.getAccessToken();
    const response = await this.fetchImpl(`https://oauth.reddit.com${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": this.userAgent
      }
    });

    if (!response.ok) {
      throw new Error(`Reddit API request failed: ${response.status}`);
    }

    return response.json();
  }

  private async getAccessToken(): Promise<string> {
    const now = Date.now();
    if (this.token && this.token.expiresAt > now + 60_000) {
      return this.token.value;
    }

    const credentials = Buffer.from(
      `${this.clientId}:${this.clientSecret}`
    ).toString("base64");

    const response = await this.fetchImpl(
      "https://www.reddit.com/api/v1/access_token",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": this.userAgent
        },
        body: "grant_type=client_credentials"
      }
    );

    if (!response.ok) {
      throw new Error(`Reddit OAuth failed: ${response.status}`);
    }

    const payload = (await response.json()) as {
      access_token?: string;
      expires_in?: number;
    };

    if (!payload.access_token) {
      throw new Error("Reddit OAuth response did not include an access token.");
    }

    this.token = {
      value: payload.access_token,
      expiresAt: now + (payload.expires_in ?? 3600) * 1000
    };

    return this.token.value;
  }
}

function clampLimit(limit: number | undefined): number {
  if (!limit) {
    return 25;
  }
  return Math.min(Math.max(Math.trunc(limit), 1), 100);
}
