export type RedditFetch = typeof fetch;

export type RedditClientConfig = {
  clientId: string;
  clientSecret: string;
  userAgent: string;
  fetch?: RedditFetch;
};

export type ListingOptions = {
  subreddit?: string;
  query?: string;
  sort?: "relevance" | "hot" | "top" | "new" | "comments";
  time?: "hour" | "day" | "week" | "month" | "year" | "all";
  limit?: number;
  after?: string;
};

export type SubredditPostsOptions = {
  subreddit: string;
  sort?: "hot" | "new" | "top" | "rising";
  time?: "hour" | "day" | "week" | "month" | "year" | "all";
  limit?: number;
  after?: string;
};

export type PostCommentsOptions = {
  subreddit: string;
  postId: string;
  sort?: "confidence" | "top" | "new" | "controversial" | "old" | "qa";
  limit?: number;
  depth?: number;
};

export type RedditPost = {
  id: string;
  fullname: string;
  subreddit: string;
  title: string;
  selftext: string;
  author: string;
  score: number;
  commentCount: number;
  createdUtc: number;
  permalink: string;
  url: string;
  isNsfw: boolean;
};

export type RedditPostListing = {
  after: string | null;
  posts: RedditPost[];
};

export type RedditComment = {
  id: string;
  fullname: string;
  parentId: string;
  postFullname: string;
  author: string;
  body: string;
  score: number;
  createdUtc: number;
  permalink: string;
  depth: number;
};

export type SubredditInfo = {
  id: string;
  displayName: string;
  title: string;
  publicDescription: string;
  subscribers: number;
  activeUserCount: number | null;
  over18: boolean;
  url: string;
};
