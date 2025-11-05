package com.stonecode.redditreader.data.api

import retrofit2.http.GET
import retrofit2.http.Path

/**
 * Reddit API service interface
 * Uses Reddit's public JSON API (no auth required for read-only)
 */
interface RedditApiService {

    @GET("r/{subreddit}/comments/{postId}.json")
    suspend fun getPost(
        @Path("subreddit") subreddit: String,
        @Path("postId") postId: String
    ): String  // Return raw JSON string for now, will parse later

    companion object {
        const val BASE_URL = "https://www.reddit.com/"
    }
}
