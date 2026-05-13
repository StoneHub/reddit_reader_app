import { describe, expect, it } from "vitest";
import {
  normalizeCommentListing,
  normalizePostListing
} from "../src/reddit/normalizers.js";

describe("Reddit response normalizers", () => {
  it("normalizes listing posts into stable research records", () => {
    const listing = {
      data: {
        children: [
          {
            data: {
              id: "abc123",
              name: "t3_abc123",
              subreddit: "SaaS",
              title: "What is broken about onboarding?",
              selftext: "I keep seeing users get lost.",
              author: "sample_user",
              score: 42,
              num_comments: 17,
              created_utc: 1760000000,
              permalink: "/r/SaaS/comments/abc123/example/",
              url: "https://example.com/article",
              over_18: false
            }
          }
        ],
        after: "t3_next"
      }
    };

    expect(normalizePostListing(listing)).toEqual({
      after: "t3_next",
      posts: [
        {
          id: "abc123",
          fullname: "t3_abc123",
          subreddit: "SaaS",
          title: "What is broken about onboarding?",
          selftext: "I keep seeing users get lost.",
          author: "sample_user",
          score: 42,
          commentCount: 17,
          createdUtc: 1760000000,
          permalink: "https://www.reddit.com/r/SaaS/comments/abc123/example/",
          url: "https://example.com/article",
          isNsfw: false
        }
      ]
    });
  });

  it("normalizes nested comments and drops more-comment placeholders", () => {
    const comments = [
      {
        kind: "Listing",
        data: {
          children: [
            {
              kind: "t1",
              data: {
                id: "c1",
                name: "t1_c1",
                parent_id: "t3_post",
                link_id: "t3_post",
                author: "commenter",
                body: "This is painful because setup takes too long.",
                score: 9,
                created_utc: 1760000100,
                permalink: "/r/SaaS/comments/post/thread/c1/",
                replies: {
                  kind: "Listing",
                  data: {
                    children: [
                      {
                        kind: "t1",
                        data: {
                          id: "c2",
                          name: "t1_c2",
                          parent_id: "t1_c1",
                          link_id: "t3_post",
                          author: "reply_user",
                          body: "Same here.",
                          score: 3,
                          created_utc: 1760000200,
                          permalink: "/r/SaaS/comments/post/thread/c2/",
                          replies: ""
                        }
                      },
                      { kind: "more", data: { id: "ignored" } }
                    ]
                  }
                }
              }
            }
          ]
        }
      }
    ];

    expect(normalizeCommentListing(comments)).toEqual([
      {
        id: "c1",
        fullname: "t1_c1",
        parentId: "t3_post",
        postFullname: "t3_post",
        author: "commenter",
        body: "This is painful because setup takes too long.",
        score: 9,
        createdUtc: 1760000100,
        permalink: "https://www.reddit.com/r/SaaS/comments/post/thread/c1/",
        depth: 0
      },
      {
        id: "c2",
        fullname: "t1_c2",
        parentId: "t1_c1",
        postFullname: "t3_post",
        author: "reply_user",
        body: "Same here.",
        score: 3,
        createdUtc: 1760000200,
        permalink: "https://www.reddit.com/r/SaaS/comments/post/thread/c2/",
        depth: 1
      }
    ]);
  });
});
