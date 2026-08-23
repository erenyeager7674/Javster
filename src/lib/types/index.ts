// ---------------------------------------------------------------------------
// apiJAV REST API types (server.apijav.com)
// ---------------------------------------------------------------------------

/** Raw Post object returned by GET /wp-json/myvideo/v1/posts */
export interface ApiJavPost {
	id: number;
	title: string;
	slug: string;
	date: string; // ISO 8601
	thumbnail: string;
	duration: string; // "HH:MM:SS"
	categories: string[];
	tags: string[];
	actors: string[];
	studio: string;
	code: string;
	views: number;
	likes: number;
	dislikes: number;
	is_hd: boolean;
	embed_url: string;
	iframe_html: string;
	player_api: string;
}

/** Raw Player object returned by GET /wp-json/myvideo/v1/player/{id} */
export interface ApiJavPlayer {
	post_id: number;
	embed_url: string;
	iframe_html: string;
	permanent: boolean;
}

/** Paginated list response metadata (from response headers) */
export interface ApiJavPagination {
	total: number;
	totalPages: number;
}

// ---------------------------------------------------------------------------
// App-level types
// ---------------------------------------------------------------------------

export interface Channel {
	id: string;
	name: string;
	handle: string;
	avatarUrl: string;
	bannerUrl?: string;
	subscriberCount: number;
	verified: boolean;
	description?: string;
	videoCount?: number;
}

export interface Video {
	id: string;
	title: string;
	description: string;
	thumbnailUrl: string;
	videoUrl?: string;
	/** Permanent embed URL from apiJAV (safe to store) */
	embedUrl?: string;
	/** Ready-to-output <iframe> tag from apiJAV */
	iframeHtml?: string;
	duration: number; // seconds
	viewCount: number;
	likeCount: number;
	dislikeCount?: number;
	publishedAt: string; // ISO date string
	channel: Channel;
	tags: string[];
	category: string;
	isLive?: boolean;
	progress?: number; // 0–1, for continue watching
	rating?: string; // e.g. "PG-13"
	year?: number;
	/** Raw product code, e.g. "ABP-123" */
	code?: string;
	isHd?: boolean;
}

export interface Category {
	id: string;
	name: string;
	slug: string;
	icon: string;
	count?: number;
}

export interface SearchResult {
	videos: Video[];
	channels: Channel[];
	totalCount: number;
	totalPages: number;
	query: string;
}

export interface CategoryRow {
	category: Category;
	videos: Video[];
}

export interface HomePageData {
	featured: Video;
	trending: Video[];
	recommended: Video[];
	continueWatching: Video[];
	newReleases: Video[];
	categoryRows: CategoryRow[];
	worldRows: CategoryRow[];
	serverTotal?: number;
}

export interface Actress {
	name: string;
	slug: string; // URL-encoded name for /actress/[slug]
	videoCount: number;
	avatarUrl: string; // generated from ui-avatars
	previewThumbs: string[]; // up to 3 thumbnails from her videos
}

export interface ActressPageData {
	actress: Actress;
	videos: Video[];
	total: number;
	totalPages: number;
	page: number;
}

export interface ActressListData {
	actresses: Actress[];
	query: string;
	fetchMs: number;
	totalScanned: number;
}

export interface BrowsePageData {
	slug: string;
	title: string;
	videos: Video[];
	total: number;
	totalPages: number;
	page: number;
	orderby: string;
	order: string;
}

export interface WatchPageData {
	video: Video;
	related: Video[];
}

export interface ChannelPageData {
	channel: Channel;
	videos: Video[];
	featuredVideo?: Video;
}

/** Format seconds to mm:ss or hh:mm:ss */
export function formatDuration(seconds: number): string {
	const h = Math.floor(seconds / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	const s = seconds % 60;
	if (h > 0) {
		return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
	}
	return `${m}:${String(s).padStart(2, '0')}`;
}

/** Format view count — 1.2M, 43K, etc. */
export function formatViews(count: number): string {
	if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M views`;
	if (count >= 1_000) return `${(count / 1_000).toFixed(0)}K views`;
	return `${count} views`;
}

/** Relative time — "3 days ago", "just now", etc. */
export function relativeTime(dateString: string): string {
	const now = new Date();
	const date = new Date(dateString);
	const diffMs = now.getTime() - date.getTime();
	const diffSec = Math.floor(diffMs / 1000);
	const diffMin = Math.floor(diffSec / 60);
	const diffHr = Math.floor(diffMin / 60);
	const diffDay = Math.floor(diffHr / 24);
	const diffMo = Math.floor(diffDay / 30);
	const diffYr = Math.floor(diffMo / 12);

	if (diffYr > 0) return `${diffYr} year${diffYr > 1 ? 's' : ''} ago`;
	if (diffMo > 0) return `${diffMo} month${diffMo > 1 ? 's' : ''} ago`;
	if (diffDay > 0) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
	if (diffHr > 0) return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;
	if (diffMin > 0) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
	return 'just now';
}

/** Format subscriber count */
export function formatSubscribers(count: number): string {
	if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M subscribers`;
	if (count >= 1_000) return `${(count / 1_000).toFixed(0)}K subscribers`;
	return `${count} subscribers`;
}
