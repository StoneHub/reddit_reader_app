package com.stonecode.redditreader.data.model

import kotlinx.serialization.Serializable

/**
 * Data model for a Reddit post
 */
@Serializable
data class RedditPost(
    val id: String,
    val title: String,
    val subreddit: String,
    val author: String,
    val selfText: String? = null,
    val url: String? = null,
    val score: Int = 0,
    val numComments: Int = 0,
    val createdUtc: Long = 0L
)
