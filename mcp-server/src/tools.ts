import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { RedditClient } from "./reddit/client.js";

const limitSchema = z.number().int().min(1).max(100).optional();

export function createServer(reddit: RedditClient): McpServer {
  const server = new McpServer({
    name: "reddit-research-mcp",
    version: "0.1.0"
  });

  server.tool(
    "search_posts",
    "Search Reddit posts globally or inside one subreddit. Read-only.",
    {
      query: z.string().min(1).max(512),
      subreddit: z.string().min(1).optional(),
      sort: z.enum(["relevance", "hot", "top", "new", "comments"]).optional(),
      time: z.enum(["hour", "day", "week", "month", "year", "all"]).optional(),
      limit: limitSchema,
      after: z.string().optional()
    },
    async (input) => jsonResult(await reddit.searchPosts(input))
  );

  server.tool(
    "get_subreddit_posts",
    "Fetch hot, new, top, or rising posts from a subreddit. Read-only.",
    {
      subreddit: z.string().min(1),
      sort: z.enum(["hot", "new", "top", "rising"]).optional(),
      time: z.enum(["hour", "day", "week", "month", "year", "all"]).optional(),
      limit: limitSchema,
      after: z.string().optional()
    },
    async (input) => jsonResult(await reddit.getSubredditPosts(input))
  );

  server.tool(
    "get_post",
    "Fetch one post by Reddit fullname, for example t3_abc123. Read-only.",
    {
      fullname: z.string().regex(/^t3_[A-Za-z0-9]+$/)
    },
    async ({ fullname }) => jsonResult(await reddit.getPostByFullname(fullname))
  );

  server.tool(
    "get_post_comments",
    "Fetch comments for one Reddit post. Read-only.",
    {
      subreddit: z.string().min(1),
      postId: z.string().min(1),
      sort: z
        .enum(["confidence", "top", "new", "controversial", "old", "qa"])
        .optional(),
      limit: limitSchema,
      depth: z.number().int().min(0).max(10).optional()
    },
    async (input) => jsonResult(await reddit.getPostComments(input))
  );

  server.tool(
    "get_subreddit_info",
    "Fetch subreddit metadata. Read-only.",
    {
      subreddit: z.string().min(1)
    },
    async ({ subreddit }) => jsonResult(await reddit.getSubredditInfo(subreddit))
  );

  return server;
}

function jsonResult(value: unknown) {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(value, null, 2)
      }
    ]
  };
}
