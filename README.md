# Reddit Reader

Reddit Reader is an Android app for turning Reddit threads into a cleaner reading and listening experience.

## Phase 1: Reddit Ingestion

Phase 1 is the data layer: reliably fetch Reddit posts and comments so the app and AI tooling can analyze, summarize, and transform threads without manual copy/paste.

This repo now has two pieces:

- `app/` - Android client
- `mcp-server/` - read-only Model Context Protocol server for Reddit research and ingestion

The MCP server uses Reddit's official API with OAuth client credentials. It is intentionally read-only: no posting, voting, commenting, direct messages, moderation actions, or account automation.

## MCP Server

See [mcp-server/README.md](mcp-server/README.md) for setup and tool details.

Current tools:

- `search_posts`
- `get_subreddit_posts`
- `get_post`
- `get_post_comments`
- `get_subreddit_info`

## Android App

The Android app currently contains the early repository/API layer and UI shell. Its existing `RedditRepository.fetchThread` is still a placeholder; the MCP server is the first concrete phase 1 ingestion implementation.

## Development

Android:

```bash
./gradlew test
```

MCP server:

```bash
cd mcp-server
npm install
npm test
npm run typecheck
npm run build
```
