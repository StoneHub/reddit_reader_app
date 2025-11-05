package com.stonecode.redditreader.data.repository

import com.stonecode.redditreader.data.api.RedditApiService
import com.stonecode.redditreader.data.model.RedditComment
import com.stonecode.redditreader.data.model.RedditPost
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Repository for fetching Reddit data
 */
@Singleton
class RedditRepository @Inject constructor(
    private val apiService: RedditApiService
) {

    suspend fun fetchThread(url: String): Result<Pair<RedditPost, List<RedditComment>>> {
        return try {
            // TODO: Parse Reddit URL and extract post
            // TODO: Call API and parse response
            Result.failure(NotImplementedError("fetchThread not yet implemented"))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
