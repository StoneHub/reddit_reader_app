import { describe, expect, it, vi } from "vitest";
import { RedditClient } from "../src/reddit/client.js";

describe("RedditClient", () => {
  it("uses application-only OAuth and a descriptive user agent", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: "token-123", expires_in: 3600 })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { children: [], after: null } })
      });

    const client = new RedditClient({
      clientId: "client-id",
      clientSecret: "client-secret",
      userAgent: "reddit-research-mcp-test/0.1.0",
      fetch: fetchMock
    });

    await client.searchPosts({ query: "onboarding", subreddit: "SaaS" });

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "https://www.reddit.com/api/v1/access_token",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Basic Y2xpZW50LWlkOmNsaWVudC1zZWNyZXQ=",
          "User-Agent": "reddit-research-mcp-test/0.1.0"
        }),
        body: "grant_type=client_credentials"
      })
    );

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "https://oauth.reddit.com/r/SaaS/search?limit=25&q=onboarding&restrict_sr=true&sort=relevance&t=month",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer token-123",
          "User-Agent": "reddit-research-mcp-test/0.1.0"
        })
      })
    );
  });

  it("rejects write methods by not exposing mutating helpers", () => {
    const client = new RedditClient({
      clientId: "client-id",
      clientSecret: "client-secret",
      userAgent: "reddit-research-mcp-test/0.1.0",
      fetch: vi.fn()
    });

    expect("submitPost" in client).toBe(false);
    expect("vote" in client).toBe(false);
    expect("comment" in client).toBe(false);
  });
});
