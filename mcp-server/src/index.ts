#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig } from "./config.js";
import { RedditClient } from "./reddit/client.js";
import { createServer } from "./tools.js";

async function main(): Promise<void> {
  const config = loadConfig();
  const reddit = new RedditClient({
    clientId: config.redditClientId,
    clientSecret: config.redditClientSecret,
    userAgent: config.redditUserAgent
  });

  const server = createServer(reddit);
  await server.connect(new StdioServerTransport());
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`reddit-research-mcp failed to start: ${message}`);
  process.exit(1);
});
