package com.stonecode.redditreader.data.model

import kotlinx.serialization.Serializable

/**
 * Data model for a Reddit comment
 */
@Serializable
data class RedditComment(
    val id: String,
    val author: String,
    val body: String,
    val score: Int = 0,
    val depth: Int = 0,
    val createdUtc: Long = 0L
)
