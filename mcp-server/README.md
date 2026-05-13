# reddit-reader-mcp

A read-only Model Context Protocol server for Reddit Reader phase 1 ingestion.

This package gives AI clients a structured way to search Reddit, fetch posts, fetch comment threads, and keep source permalinks attached to research evidence. It uses Reddit's official API and OAuth client credentials.

## Tools

| Tool | Purpose |
| --- | --- |
| `search_posts` | Search posts globally or inside a subreddit |
| `get_subreddit_posts` | Fetch hot, new, top, or rising posts from a subreddit |
| `get_post` | Fetch one post by fullname, such as `t3_abc123` |
| `get_post_comments` | Fetch comments for a post |
| `get_subreddit_info` | Fetch subreddit metadata |

## Requirements

- Node.js 20+
- A Reddit API application with client credentials

Create a Reddit app from Reddit's app preferences, then set:

```bash
REDDIT_CLIENT_ID=...
REDDIT_CLIENT_SECRET=...
REDDIT_USER_AGENT="reddit-reader-mcp/0.1.0 by u_your_username"
```

Use a specific, descriptive user agent. Generic user agents are more likely to be blocked or rate limited.

## Install

```bash
npm install
npm run build
```

## Run Locally

```bash
npm run dev
```

For an MCP client that launches stdio servers, point it at the built package:

```json
{
  "mcpServers": {
    "reddit-reader": {
      "command": "node",
      "args": ["/absolute/path/to/reddit_reader_app/mcp-server/dist/index.js"],
      "env": {
        "REDDIT_CLIENT_ID": "your-client-id",
        "REDDIT_CLIENT_SECRET": "your-client-secret",
        "REDDIT_USER_AGENT": "reddit-reader-mcp/0.1.0 by u_your_username"
      }
    }
  }
}
```

## Research Workflow

1. Use `search_posts` or `get_subreddit_posts` to discover candidate threads.
2. Use `get_post_comments` on the highest-signal posts.
3. Ask the AI to classify sentiment, pain points, objections, feature requests, and source follow-ups.
4. Require every claim to cite the post or comment permalink returned by the tool.

Suggested output schema:

```json
{
  "topic": "string",
  "overall_sentiment": "positive | neutral | negative | mixed",
  "themes": [],
  "pain_points": [],
  "feature_requests": [],
  "objections": [],
  "notable_quotes": [
    {
      "quote": "short excerpt",
      "permalink": "https://www.reddit.com/...",
      "why_it_matters": "string"
    }
  ],
  "follow_up_sources": []
}
```

## Development

```bash
npm test
npm run typecheck
npm run build
```

## Security

This server is read-only by design. It should not grow write tools without a separate security review.

Do not commit `.env`, OAuth credentials, exported Reddit datasets, or private research notes.
