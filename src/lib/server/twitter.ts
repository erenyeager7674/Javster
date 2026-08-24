/**
 * Twitter API helpers for NSFW content browsing
 * Uses https://api.twitterapi.io
 */

export interface TwitterUser {
	id: string;
	name: string;
	username: string;
	profileImageUrl: string;
	followersCount: number;
	followingCount: number;
	tweetsCount: number;
	verified: boolean;
	description?: string;
}

export interface TwitterTweet {
	id: string;
	text: string;
	authorId: string;
	createdAt: string;
	mediaUrls?: string[];
	likeCount: number;
	retweetCount: number;
	replyCount: number;
	viewCount: number;
	isNsfw?: boolean;
}

export interface TwitterSearchResult {
	tweets: TwitterTweet[];
	users: TwitterUser[];
	nextToken?: string;
	pages?: number;
	currentPage?: number;
	totalCount?: number;
}

export interface TwitterTweetsPage {
	tweets: TwitterTweet[];
	nextCursor: string | null;
	hasNextPage: boolean;
}

interface TwitterApiResponse {
	success?: boolean;
	results?: {
		tweets?: TwitterTweetData[];
		users?: TwitterUserData[];
		pages?: number;
		currentPage?: number;
		totalCount?: number;
	};
	data?: unknown;
	tweets?: unknown[];
	users?: unknown[];
	status?: string;
	msg?: string;
	id?: string;
	name?: string;
	username?: string;
	userName?: string;
	profile_image_url_https?: string;
	followers?: number;
	following?: number;
	followers_count?: number;
	friends_count?: number;
	statusesCount?: number;
	statuses_count?: number;
	isBlueVerified?: boolean;
	verified?: boolean;
	description?: string;
	next_cursor?: string;
	has_next_page?: boolean;
	meta?: {
		next_token?: string;
	};
}

interface TwitterUserData {
	id?: string;
	name?: string;
	username?: string;
	userName?: string;
	profilePicture?: string;
	profile_image_url_https?: string;
	followers?: number;
	following?: number;
	followers_count?: number;
	friends_count?: number;
	statusesCount?: number;
	statuses_count?: number;
	isBlueVerified?: boolean;
	verified?: boolean;
	description?: string;
}

interface TwitterTweetData {
	id?: string;
	tweet_id?: string;
	text?: string;
	tweet_text?: string;
	author_id?: string;
	user_id?: string;
	authorId?: string;
	created_at?: string;
	date?: string;
	createdAt?: string;
	media?: Array<{
		media_url_https?: string;
		url?: string;
	}>;
	media_url?: string[];
	mediaUrls?: string[];
	favorite_count?: number;
	like_count?: number;
	retweet_count?: number;
	reply_count?: number;
	view_count?: number;
	possibly_sensitive?: boolean;
	isNsfw?: boolean;
	// New structure from actual API response
	type?: string;
	url?: string;
	twitterUrl?: string;
	source?: string;
	retweetCount?: number;
	replyCount?: number;
	likeCount?: number;
	quoteCount?: number;
	viewCount?: number;
	bookmarkCount?: number;
	lang?: string;
	isReply?: boolean;
	conversationId?: string;
	author?: {
		type?: string;
		userName?: string;
		id?: string;
		name?: string;
		isVerified?: boolean;
		isBlueVerified?: boolean;
		profilePicture?: string;
		description?: string;
		location?: string;
		followers?: number;
		following?: number;
		statusesCount?: number;
	};
	extendedEntities?: {
		media?: Array<{
			media_url_https?: string;
			url?: string;
			type?: string;
			display_url?: string;
			expanded_url?: string;
		}>;
	};
}

const API_KEY = process.env.TWITTER_API_KEY || 'new1_170006744d234c9199aeb2cc5d121df2';
const BASE_URL = 'https://api.twitterapi.io';

// Shared rate limiter for concurrent requests
let lastApiCall = 0;
let pendingRequest: Promise<void> | null = null;
const RATE_LIMIT_DELAY = 5500; // 5.5 seconds to be safe

function removeNormalFromUrl(url: string): string {
	return url.replace('_normal', '');
}

async function fetchTwitterAPI(endpoint: string, params: Record<string, string> = {}) {
	const url = new URL(`${BASE_URL}${endpoint}`);
	Object.entries(params).forEach(([key, value]) => {
		url.searchParams.set(key, value);
	});

	// Rate limiting: wait for pending request and enforce delay
	if (pendingRequest) {
		await pendingRequest;
	}

	const now = Date.now();
	const timeSinceLastCall = now - lastApiCall;
	if (timeSinceLastCall < RATE_LIMIT_DELAY) {
		const waitTime = RATE_LIMIT_DELAY - timeSinceLastCall;
		pendingRequest = new Promise(resolve => setTimeout(resolve, waitTime));
		await pendingRequest;
	}

	const response = await fetch(url.toString(), {
		headers: {
			'x-api-key': API_KEY,
			'Content-Type': 'application/json'
		}
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Twitter API error: ${response.status} ${response.statusText} - ${errorText}`);
	}

	const data = await response.json();
	
	// Update timing after successful API call
	pendingRequest = null;
	lastApiCall = Date.now();
	
	return data as Promise<TwitterApiResponse>;
}

export async function getUserInfo(username: string): Promise<TwitterUser> {
	const data = await fetchTwitterAPI('/twitter/user/info', { userName: username });
	const userData = (data.data || data) as TwitterUserData;
	const rawImageUrl = String(userData.profilePicture || userData.profile_image_url_https || '');
	return {
		id: String(userData.id || ''),
		name: String(userData.name || ''),
		username: String(userData.userName || userData.username || ''),
		profileImageUrl: removeNormalFromUrl(rawImageUrl),
		followersCount: Number(userData.followers || userData.followers_count || 0),
		followingCount: Number(userData.following || userData.friends_count || 0),
		tweetsCount: Number(userData.statusesCount || userData.statuses_count || 0),
		verified: Boolean(userData.isBlueVerified || userData.verified || false),
		description: userData.description
	};
}

export async function getUserTweets(username: string, cursor?: string): Promise<TwitterTweetsPage> {
	// Try alternative endpoint if the main one doesn't work
	let data;

	try {
		const params: Record<string, string> = { userName: username };
		if (cursor) params.cursor = cursor;
		data = await fetchTwitterAPI('/twitter/user/last_tweets', params);
	} catch (error) {
		// Try alternative endpoint for user tweets
		const params: Record<string, string> = { userName: username };
		if (cursor) params.cursor = cursor;
		data = await fetchTwitterAPI('/twitter/user/tweets', params);
	}

	// Check for suspended/unavailable users
	const rawData = data.data as Record<string, unknown> | undefined;
	if (rawData?.unavailable) {
		throw new Error(`User ${username} is ${(rawData.unavailableReason as string) || 'unavailable'}`);
	}

	// Handle multiple possible response structures
	let tweets: TwitterTweetData[] = [];

	// Handle the new structure: { success: true, results: { tweets: [...], users: [...] } }
	if (data.success && data.results?.tweets) {
		tweets = data.results.tweets;
	}
	// The actual response structure from the API
	else if (Array.isArray(data)) {
		tweets = data;
	} else if (Array.isArray(data.data)) {
		tweets = data.data;
	} else if (Array.isArray(data.tweets)) {
		tweets = data.tweets as TwitterTweetData[];
	} else if (data.data && typeof data.data === 'object') {
		// Handle the structure where data is an object with tweet array
		const possibleArray = Object.values(data.data).find(val => Array.isArray(val));
		if (possibleArray) {
			tweets = possibleArray;
		}
	}

	const mappedTweets = tweets.map((tweet: TwitterTweetData) => {
		// Handle the new structure from the provided example (already has correct field names)
		if (tweet.text && tweet.authorId && tweet.createdAt) {
			return {
				id: String(tweet.id || ''),
				text: String(tweet.text || ''),
				authorId: String(tweet.authorId || ''),
				createdAt: String(tweet.createdAt || ''),
				mediaUrls: Array.isArray(tweet.mediaUrls)
					? tweet.mediaUrls.map((url) => removeNormalFromUrl(String(url)))
					: [],
				likeCount: Number(tweet.likeCount || 0),
				retweetCount: Number(tweet.retweetCount || 0),
				replyCount: Number(tweet.replyCount || 0),
				viewCount: Number(tweet.viewCount || 0),
				isNsfw: Boolean(tweet.isNsfw || false)
			};
		}

		// Handle new API structure (from the provided example)
		if (tweet.type === 'tweet' && tweet.author) {
			const mediaUrls = tweet.extendedEntities?.media
				? tweet.extendedEntities.media.map((m) => removeNormalFromUrl(String(m.media_url_https || m.url || ''))).filter(Boolean)
				: [];

			return {
				id: String(tweet.id || ''),
				text: String(tweet.text || ''),
				authorId: String(tweet.author.id || ''),
				createdAt: String(tweet.createdAt || tweet.created_at || ''),
				mediaUrls,
				likeCount: Number(tweet.likeCount || 0),
				retweetCount: Number(tweet.retweetCount || 0),
				replyCount: Number(tweet.replyCount || 0),
				viewCount: Number(tweet.viewCount || 0),
				isNsfw: false // API doesn't provide this in new structure
			};
		}

		// Handle old API structure (fallback)
		return {
			id: String(tweet.id || tweet.tweet_id || ''),
			text: String(tweet.text || tweet.tweet_text || ''),
			authorId: String(tweet.author_id || tweet.user_id || ''),
			createdAt: String(tweet.created_at || tweet.date || ''),
			mediaUrls: Array.isArray(tweet.media)
				? tweet.media.map((m) => removeNormalFromUrl(String(m.media_url_https || m.url || ''))).filter(Boolean)
				: Array.isArray(tweet.media_url)
					? tweet.media_url.map((url) => removeNormalFromUrl(String(url)))
					: [],
			likeCount: Number(tweet.favorite_count || tweet.like_count || 0),
			retweetCount: Number(tweet.retweet_count || 0),
			replyCount: Number(tweet.reply_count || 0),
			viewCount: Number(tweet.view_count || 0),
			isNsfw: Boolean(tweet.possibly_sensitive || false)
		};
	});

	return {
		tweets: mappedTweets,
		nextCursor: data.next_cursor || null,
		hasNextPage: Boolean(data.has_next_page ?? (data.next_cursor ? true : false))
	};
}

export async function searchTweets(query: string): Promise<TwitterSearchResult> {
	const data = await fetchTwitterAPI('/twitter/tweet/advanced_search', {
		query: query,
		queryType: 'Latest'
	});

	const tweets = (Array.isArray(data.data) ? data.data : Array.isArray(data.tweets) ? data.tweets : []) as TwitterTweetData[];

	const mappedTweets = tweets.map((tweet: TwitterTweetData) => ({
		id: String(tweet.id || tweet.tweet_id || ''),
		text: String(tweet.text || tweet.tweet_text || ''),
		authorId: String(tweet.author_id || tweet.user_id || ''),
		createdAt: String(tweet.created_at || tweet.date || ''),
		mediaUrls: Array.isArray(tweet.media)
			? tweet.media.map((m) => removeNormalFromUrl(String(m.media_url_https || m.url || ''))).filter(Boolean)
			: Array.isArray(tweet.media_url)
				? tweet.media_url.map((url) => removeNormalFromUrl(String(url)))
				: [],
		likeCount: Number(tweet.favorite_count || tweet.like_count || 0),
		retweetCount: Number(tweet.retweet_count || 0),
		replyCount: Number(tweet.reply_count || 0),
		viewCount: Number(tweet.view_count || 0),
		isNsfw: Boolean(tweet.possibly_sensitive || false)
	}));

	// Extract unique users from tweets
	const userIds = [...new Set(mappedTweets.map((t) => t.authorId))];
	const users = await Promise.all(
		userIds.map(async (userId: string) => {
			try {
				const userData = await fetchTwitterAPI('/twitter/user/batch_info_by_ids', { userIds: userId });
				const userInfo = (userData.data || userData) as TwitterUserData;
				const rawImageUrl = String(userInfo.profilePicture || userInfo.profile_image_url_https || '');
				return {
					id: String(userInfo.id || ''),
					name: String(userInfo.name || ''),
					username: String(userInfo.userName || userInfo.username || ''),
					profileImageUrl: removeNormalFromUrl(rawImageUrl),
					followersCount: Number(userInfo.followers || userInfo.followers_count || 0),
					followingCount: Number(userInfo.following || userInfo.friends_count || 0),
					tweetsCount: Number(userInfo.statusesCount || userInfo.statuses_count || 0),
					verified: Boolean(userInfo.isBlueVerified || userInfo.verified || false),
					description: userInfo.description
				};
			} catch {
				return null;
			}
		})
	);

	const filteredUsers = users.filter((user) => user !== null);
	return {
		tweets: mappedTweets,
		users: filteredUsers as TwitterUser[],
		nextToken: String(data.next_cursor || data.meta?.next_token || ''),
		pages: data.results?.pages || 1,
		currentPage: data.results?.currentPage || 1,
		totalCount: data.results?.totalCount || mappedTweets.length
	};
}

export async function searchNSFWContent(query: string = 'nsfw'): Promise<TwitterSearchResult> {
	// Always search for NSFW content by adding nsfw to query
	const nsfwQuery = query.includes('nsfw') ? query : `${query} nsfw porn adult`;
	return searchTweets(nsfwQuery);
}
