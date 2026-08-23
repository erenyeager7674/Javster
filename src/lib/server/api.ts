/**
 * apiJAV API helpers — all server-only (no client bundle impact).
 * Calls https://server.apijav.com/wp-json/myvideo/v1
 * All GET endpoints are fully public — no API key required.
 */

import type {
	Video,
	Channel,
	Category,
	CategoryRow,
	BrowsePageData,
	Actress,
	ActressPageData,
	ActressListData,
	HomePageData,
	WatchPageData,
	ChannelPageData,
	SearchResult,
	ApiJavPost,
	ApiJavPlayer
} from '$lib/types/index.js';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BASE = 'https://server.apijav.com/wp-json/myvideo/v1';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Convert a duration string "HH:MM:SS" to total seconds. */
function parseDuration(str: string): number {
	if (!str || str === '00:00:00') return 0;
	const parts = str.split(':').map(Number);
	if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
	if (parts.length === 2) return parts[0] * 60 + parts[1];
	return Number(parts[0]) || 0;
}

/** Build a Channel object from a studio name / actor name. */
function channelFromPost(post: ApiJavPost): Channel {
	const name = post.studio || post.actors[0] || 'Unknown';
	const slug = name
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/[^a-z0-9-]/g, '');
	return {
		id: `studio-${slug}`,
		name,
		handle: `@${slug}`,
		avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=80&background=random`,
		subscriberCount: 0,
		verified: false,
		description: `Videos from ${name}`,
		videoCount: 0
	};
}

/** Map a raw ApiJavPost to the app Video type. */
function postToVideo(post: ApiJavPost): Video {
	return {
		id: String(post.id),
		title: post.title,
		description: [
			post.actors.length ? `Starring: ${post.actors.join(', ')}` : '',
			post.studio ? `Studio: ${post.studio}` : '',
			post.categories.join(' · ')
		]
			.filter(Boolean)
			.join('\n'),
		thumbnailUrl: post.thumbnail,
		embedUrl: post.embed_url,
		iframeHtml: post.iframe_html,
		duration: parseDuration(post.duration),
		viewCount: post.views,
		likeCount: post.likes,
		dislikeCount: post.dislikes,
		publishedAt: post.date,
		channel: channelFromPost(post),
		tags: post.tags,
		category: post.categories[0] ?? 'Uncategorized',
		isHd: post.is_hd,
		code: post.code || undefined,
		rating: undefined,
		year: new Date(post.date).getFullYear()
	};
}

/** Fetch posts from the apiJAV server with full query support. */
async function fetchPosts(
	params: Record<string, string | number> = {}
): Promise<{ videos: Video[]; total: number; totalPages: number; ms: number }> {
	const url = new URL(`${BASE}/posts`);
	for (const [k, v] of Object.entries(params)) {
		if (v !== undefined && v !== '') url.searchParams.set(k, String(v));
	}

	const t0 = performance.now();
	const res = await fetch(url.toString(), {
		headers: { Accept: 'application/json' }
	});
	const ms = Math.round(performance.now() - t0);

	if (!res.ok) throw new Error(`apiJAV error ${res.status}: ${url}`);

	const total = parseInt(res.headers.get('X-WP-Total') ?? '0', 10);
	const totalPages = parseInt(res.headers.get('X-WP-TotalPages') ?? '1', 10);
	const posts: ApiJavPost[] = await res.json();

	return { videos: posts.map(postToVideo), total, totalPages, ms };
}

// ---------------------------------------------------------------------------
// Placeholder channel list (used for sidebar nav — no channel API on server)
// ---------------------------------------------------------------------------

const CHANNELS: Channel[] = [
	{
		id: 'ch-1',
		name: 'Aperture Cinema',
		handle: '@aperturecinema',
		avatarUrl: 'https://picsum.photos/seed/ch1/80/80',
		bannerUrl: 'https://picsum.photos/seed/ch1banner/1280/320',
		subscriberCount: 2_340_000,
		verified: true,
		description: 'Curated independent films, documentaries, and cinematic shorts.',
		videoCount: 248
	},
	{
		id: 'ch-2',
		name: 'Neon Docs',
		handle: '@neondocs',
		avatarUrl: 'https://picsum.photos/seed/ch2/80/80',
		bannerUrl: 'https://picsum.photos/seed/ch2banner/1280/320',
		subscriberCount: 890_000,
		verified: true,
		description: 'Award-winning documentaries on science, culture, and society.',
		videoCount: 134
	},
	{
		id: 'ch-3',
		name: 'Studio Parallax',
		handle: '@studioparallax',
		avatarUrl: 'https://picsum.photos/seed/ch3/80/80',
		bannerUrl: 'https://picsum.photos/seed/ch3banner/1280/320',
		subscriberCount: 5_120_000,
		verified: true,
		description: 'Short films, motion graphics, and visual storytelling.',
		videoCount: 512
	},
	{
		id: 'ch-4',
		name: 'Deep Frame',
		handle: '@deepframe',
		avatarUrl: 'https://picsum.photos/seed/ch4/80/80',
		subscriberCount: 445_000,
		verified: false,
		description: 'Deep dives into film theory and cinematography craft.',
		videoCount: 89
	},
	{
		id: 'ch-5',
		name: 'Reel Horizon',
		handle: '@reelhorizon',
		avatarUrl: 'https://picsum.photos/seed/ch5/80/80',
		subscriberCount: 1_780_000,
		verified: true,
		description: 'Blockbusters, trailers, and behind-the-scenes exclusives.',
		videoCount: 387
	}
];

// (placeholder makeVideo / VIDEOS removed — all data now comes from the live API)

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

export async function getFeaturedVideo(): Promise<Video> {
	const { videos } = await fetchPosts({ per_page: 1, orderby: 'views', order: 'DESC' });
	return videos[0];
}

export async function getTrendingVideos(limit = 12): Promise<Video[]> {
	const { videos } = await fetchPosts({ per_page: limit, orderby: 'views', order: 'DESC' });
	return videos;
}

export async function getRecommendedVideos(limit = 12): Promise<Video[]> {
	const { videos } = await fetchPosts({
		per_page: limit,
		page: 2,
		orderby: 'views',
		order: 'DESC'
	});
	return videos;
}

export async function getContinueWatching(): Promise<Video[]> {
	// No server-side watch history — return empty array
	return [];
}

export async function getNewReleases(limit = 12): Promise<Video[]> {
	const { videos } = await fetchPosts({ per_page: limit, orderby: 'date', order: 'DESC' });
	return videos;
}

export async function getCategories(): Promise<Category[]> {
	return [
		// --- Navigation ---
		{ id: 'cat-home', name: 'Home', slug: '/', icon: 'home' },
		{ id: 'cat-trending', name: 'Trending', slug: '/browse/trending', icon: 'trending-up' },
		{ id: 'cat-new', name: 'New Releases', slug: '/browse/new', icon: 'sparkles' },
		// --- Top content types ---
		{ id: 'cat-uncensored', name: 'Uncensored', slug: '/browse/Uncensored', icon: 'film' },
		{
			id: 'cat-uncensored-leak',
			name: 'Uncensored Leak',
			slug: '/browse/Uncensored+leak',
			icon: 'film'
		},
		{ id: 'cat-censored', name: 'Censored', slug: '/browse/Censored', icon: 'film' },
		{ id: 'cat-amateur', name: 'Amateur', slug: '/browse/Amateur', icon: 'user' },
		{ id: 'cat-exclusive', name: 'Exclusive', slug: '/browse/Exclusive', icon: 'star' },
		{ id: 'cat-famous', name: 'Famous', slug: '/browse/Famous', icon: 'star' },
		// --- Body types ---
		{ id: 'cat-big-breasts', name: 'Big Breasts', slug: '/browse/Big+Breasts', icon: 'heart' },
		{
			id: 'cat-beautiful-breasts',
			name: 'Beautiful Breasts',
			slug: '/browse/Beautiful+Breasts',
			icon: 'heart'
		},
		{
			id: 'cat-small-breasts',
			name: 'Small Breasts',
			slug: '/browse/Small+Breasts',
			icon: 'heart'
		},
		{
			id: 'cat-beautiful-legs',
			name: 'Beautiful Legs',
			slug: '/browse/Beautiful+Legs',
			icon: 'zap'
		},
		{ id: 'cat-slender', name: 'Slender', slug: '/browse/Slender', icon: 'zap' },
		{ id: 'cat-plump', name: 'Plump', slug: '/browse/Plump', icon: 'zap' },
		{
			id: 'cat-beautiful-butt',
			name: 'Beautiful Butt',
			slug: '/browse/Beautiful+Butt',
			icon: 'zap'
		},
		// --- Acts ---
		{ id: 'cat-creampie', name: 'Creampie', slug: '/browse/Creampie', icon: 'droplet' },
		{ id: 'cat-oral', name: 'Oral Sex', slug: '/browse/Oral+Sex', icon: 'droplet' },
		{ id: 'cat-blowjob', name: 'Blowjob', slug: '/browse/Blowjob', icon: 'droplet' },
		{ id: 'cat-handjob', name: 'Handjob', slug: '/browse/Handjob', icon: 'droplet' },
		{ id: 'cat-squirting', name: 'Squirting', slug: '/browse/Squirting', icon: 'droplet' },
		{ id: 'cat-orgasm', name: 'Extreme Orgasm', slug: '/browse/Extreme+Orgasm', icon: 'zap' },
		{ id: 'cat-threesome', name: 'Threesome', slug: '/browse/Threesome', icon: 'users' },
		{ id: 'cat-gangbang', name: 'Gangbang', slug: '/browse/Gangbang', icon: 'users' },
		{ id: 'cat-lesbian', name: 'Lesbian', slug: '/browse/Lesbian', icon: 'users' },
		{ id: 'cat-anal', name: 'Anal', slug: '/browse/Anal', icon: 'droplet' },
		{ id: 'cat-toys', name: 'Toys', slug: '/browse/Toys', icon: 'box' },
		{ id: 'cat-bdsm', name: 'BDSM', slug: '/browse/BDSM', icon: 'lock' },
		{ id: 'cat-bondage', name: 'Bondage', slug: '/browse/Bondage', icon: 'lock' },
		// --- Scenarios ---
		{ id: 'cat-incest', name: 'Incest', slug: '/browse/Incest', icon: 'home' },
		{ id: 'cat-stepfamily', name: 'Step Family', slug: '/browse/Step+Family', icon: 'home' },
		{ id: 'cat-teacher', name: 'Teacher', slug: '/browse/Teacher', icon: 'book-open' },
		{ id: 'cat-office', name: 'Office Lady', slug: '/browse/Office+Lady', icon: 'briefcase' },
		{ id: 'cat-nurse', name: 'Nurse', slug: '/browse/Nurse', icon: 'plus-circle' },
		{ id: 'cat-maid', name: 'Maid', slug: '/browse/Maid', icon: 'home' },
		{ id: 'cat-cosplay', name: 'Cosplay', slug: '/browse/Cosplay', icon: 'sparkles' },
		{ id: 'cat-swimsuit', name: 'Swimsuit', slug: '/browse/Swimsuit', icon: 'sun' },
		{ id: 'cat-school', name: 'School Girl', slug: '/browse/School+Girl', icon: 'book-open' },
		{ id: 'cat-idol', name: 'Idol', slug: '/browse/Idol', icon: 'star' },
		// --- Style ---
		{ id: 'cat-pov', name: 'POV', slug: '/browse/POV', icon: 'eye' },
		{ id: 'cat-hd', name: 'HD', slug: '/browse/Hd', icon: 'monitor' },
		{ id: 'cat-vr', name: 'VR', slug: '/browse/VR', icon: 'box' },
		{ id: 'cat-4k', name: '4K', slug: '/browse/4K', icon: 'monitor' },
		// --- Origin ---
		{ id: 'cat-japanese', name: 'Japanese', slug: '/browse/Japanese', icon: 'globe' },
		{ id: 'cat-chinese', name: 'Chinese', slug: '/browse/Chinese', icon: 'globe' },
		{ id: 'cat-korean', name: 'Korean', slug: '/browse/Korean', icon: 'globe' },
		{ id: 'cat-western', name: 'Western', slug: '/browse/Western', icon: 'globe' },
		// --- Platforms ---
		{ id: 'cat-missav', name: 'Missav', slug: '/browse/Missav', icon: 'play' },
		{ id: 'cat-123av', name: '123av', slug: '/browse/123av', icon: 'play' },
		{ id: 'cat-individual', name: 'Individual', slug: '/browse/Individual', icon: 'user' },
		{ id: 'cat-hot-girl', name: 'Hot Girl', slug: '/browse/Hot+Girl', icon: 'flame' },
		{ id: 'cat-pick-up', name: 'Pick-Up', slug: '/browse/Pick-Up', icon: 'map-pin' },
		{ id: 'cat-ordinary', name: 'Ordinary Person', slug: '/browse/Ordinary+Person', icon: 'user' }
	];
}

/** Fetch a preview row (12 videos) for each of the given category names in parallel. */
export async function getCategoryRows(
	categoryNames: string[],
	perRow = 12
): Promise<CategoryRow[]> {
	const results = await Promise.all(
		categoryNames.map(async (name) => {
			const { videos } = await fetchPosts({
				per_page: perRow,
				category: name,
				orderby: 'views',
				order: 'DESC'
			});
			return {
				category: {
					id: `row-${name}`,
					name,
					slug: `/browse/${encodeURIComponent(name)}`,
					icon: 'film'
				},
				videos
			};
		})
	);
	// only return rows that actually have content
	return results.filter((r) => r.videos.length > 0);
}

export async function getBrowsePageData(
	slug: string,
	opts: { page?: number; orderby?: string; order?: string; perPage?: number } = {}
): Promise<BrowsePageData> {
	const { page = 1, orderby = 'views', order = 'DESC', perPage = 24 } = opts;

	// Map special slugs to API params
	let params: Record<string, string | number> = { per_page: perPage, page, orderby, order };

	if (slug === 'trending') {
		params = { ...params, orderby: 'views', order: 'DESC' };
	} else if (slug === 'new') {
		params = { ...params, orderby: 'date', order: 'DESC' };
	} else {
		// Treat as a category name (decode URL encoding)
		params.category = decodeURIComponent(slug.replace(/\+/g, ' '));
	}

	const { videos, total, totalPages } = await fetchPosts(params);

	const titleMap: Record<string, string> = {
		trending: 'Trending',
		new: 'New Releases'
	};
	const title = titleMap[slug] ?? decodeURIComponent(slug.replace(/\+/g, ' '));

	return { slug, title, videos, total, totalPages, page, orderby, order };
}

export async function getVideoById(id: string): Promise<Video | null> {
	const res = await fetch(`${BASE}/posts/${id}`, {
		headers: { Accept: 'application/json' }
	});
	if (res.status === 404) return null;
	if (!res.ok) throw new Error(`apiJAV error ${res.status}`);
	const post: ApiJavPost = await res.json();
	return postToVideo(post);
}

export async function getPlayerById(id: string): Promise<ApiJavPlayer | null> {
	const res = await fetch(`${BASE}/player/${id}`, {
		headers: { Accept: 'application/json' }
	});
	if (res.status === 404) return null;
	if (!res.ok) throw new Error(`apiJAV player error ${res.status}`);
	return res.json();
}

export async function getRelatedVideos(id: string, limit = 16): Promise<Video[]> {
	// Fetch videos from the same category as the current video for better relevance
	const currentVideo = await getVideoById(id);
	if (!currentVideo) {
		// Fallback to trending if current video not found
		const { videos } = await fetchPosts({ per_page: limit + 1, orderby: 'views', order: 'DESC' });
		return videos.filter((v) => v.id !== id).slice(0, limit);
	}

	// Try to get videos from the same category
	const { videos } = await fetchPosts({
		per_page: limit + 5,
		category: currentVideo.category,
		orderby: 'views',
		order: 'DESC'
	});

	// Filter out current video and limit results
	const related = videos.filter((v) => v.id !== id).slice(0, limit);

	// If not enough videos from same category, supplement with trending
	if (related.length < limit) {
		const { videos: trending } = await fetchPosts({
			per_page: limit - related.length + 1,
			orderby: 'views',
			order: 'DESC'
		});
		const additional = trending.filter((v) => v.id !== id && !related.some((r) => r.id === v.id));
		return [...related, ...additional].slice(0, limit);
	}

	return related;
}

export async function getChannelById(id: string): Promise<Channel | null> {
	// Channels are derived from studios; fall back to sidebar list for nav channels
	return CHANNELS.find((c) => c.id === id) ?? null;
}

export async function getChannelVideos(channelId: string, limit = 24): Promise<Video[]> {
	// channelId may be "studio-<slug>" — extract the studio name
	const channel = CHANNELS.find((c) => c.id === channelId);
	const studioName = channel?.name ?? channelId.replace('studio-', '').replace(/-/g, ' ');
	const { videos } = await fetchPosts({ per_page: limit, studio: studioName });
	return videos;
}

export async function searchVideos(
	query: string,
	opts: {
		limit?: number;
		page?: number;
		category?: string;
		actor?: string;
		studio?: string;
		orderby?: string;
		order?: string;
	} = {}
): Promise<SearchResult> {
	const { limit = 20, page = 1, category, actor, studio, orderby = 'date', order = 'DESC' } = opts;

	const params: Record<string, string | number> = {
		per_page: limit,
		page,
		orderby,
		order
	};
	if (query) params.search = query;
	if (category) params.category = category;
	if (actor) params.actor = actor;
	if (studio) params.studio = studio;

	// Handle special orderby values
	if (orderby === 'views') {
		params.orderby = 'views';
	} else if (orderby === 'relevance') {
		params.orderby = 'relevance';
	}

	const { videos, total, totalPages } = await fetchPosts(params);

	return {
		videos,
		channels: CHANNELS.filter(
			(c) =>
				c.name.toLowerCase().includes(query.toLowerCase()) ||
				c.handle.toLowerCase().includes(query.toLowerCase())
		).slice(0, 3),
		totalCount: total,
		totalPages,
		query
	};
}

export async function getHomePageData(): Promise<HomePageData> {
	// Home category rows — popular categories
	const HOME_CATEGORIES = [
		'Uncensored',
		'Uncensored leak',
		'Big Breasts',
		'Creampie',
		'Amateur',
		'Oral Sex',
		'Cosplay',
		'Lesbian',
		'Threesome',
		'POV',
		'BDSM',
		'School Girl'
	];

	// World origin rows shown separately on home
	const WORLD_CATEGORIES = ['Japanese', 'Chinese', 'Korean', 'Western'];

	const [trendingRaw, newReleasesRaw, categoryRows, worldRows] = await Promise.all([
		fetchPosts({ per_page: 25, orderby: 'views', order: 'DESC' }),
		fetchPosts({ per_page: 12, orderby: 'date', order: 'DESC' }),
		getCategoryRows(HOME_CATEGORIES, 12),
		getCategoryRows(WORLD_CATEGORIES, 12)
	]);

	const trending = trendingRaw.videos;
	const featured = trending[0];
	const recommended = trending.slice(1, 13);
	const newReleases = newReleasesRaw.videos;

	return {
		featured,
		trending: trending.slice(0, 12),
		recommended,
		continueWatching: [],
		newReleases,
		categoryRows,
		worldRows,
		serverTotal: trendingRaw.total
	};
}

export async function getWatchPageData(id: string): Promise<WatchPageData> {
	const [video, related] = await Promise.all([getVideoById(id), getRelatedVideos(id, 16)]);
	return { video: video!, related };
}

export async function getChannelPageData(id: string): Promise<ChannelPageData> {
	const [channel, videos] = await Promise.all([getChannelById(id), getChannelVideos(id, 24)]);
	const resolvedChannel = channel ?? {
		id,
		name: id,
		handle: `@${id}`,
		avatarUrl: '',
		subscriberCount: 0,
		verified: false,
		description: '',
		videoCount: videos.length
	};
	return { channel: resolvedChannel, videos, featuredVideo: videos[0] };
}

// ---------------------------------------------------------------------------
// Actress functions
// ---------------------------------------------------------------------------

/**
 * Fetch raw posts (no mapping) for actress scanning — returns posts + headers only.
 * Uses per_page=100 (server max) to minimise round trips.
 */
async function fetchRawPage(
	params: Record<string, string | number>
): Promise<{ posts: ApiJavPost[]; total: number; totalPages: number }> {
	const url = new URL(`${BASE}/posts`);
	for (const [k, v] of Object.entries(params)) {
		if (v !== undefined && v !== '') url.searchParams.set(k, String(v));
	}
	const res = await fetch(url.toString(), { headers: { Accept: 'application/json' } });
	if (!res.ok) return { posts: [], total: 0, totalPages: 0 };
	const total = parseInt(res.headers.get('X-WP-Total') ?? '0', 10);
	const totalPages = parseInt(res.headers.get('X-WP-TotalPages') ?? '1', 10);
	const posts: ApiJavPost[] = await res.json();
	return { posts, total, totalPages };
}

/**
 * Get the true video count for a single actress by fetching 1 post
 * and reading X-WP-Total from the response headers.
 */
async function fetchActressVideoCount(name: string): Promise<number> {
	const url = new URL(`${BASE}/posts`);
	url.searchParams.set('per_page', '1');
	url.searchParams.set('actor', name);
	const res = await fetch(url.toString(), { headers: { Accept: 'application/json' } });
	if (!res.ok) return 0;
	return parseInt(res.headers.get('X-WP-Total') ?? '0', 10);
}

/**
 * Search actresses by name. Fetches multiple pages of posts to build a wide
 * actress index, then resolves true video counts for the top results.
 *
 * Strategy:
 * 1. Fetch page 1 (100 posts) to get totalPages.
 * 2. Fetch up to SCAN_PAGES more pages in parallel.
 * 3. Extract all unique actor names from all collected posts.
 * 4. For actresses matching the query, batch-fetch their true video count
 *    (per_page=1, read X-WP-Total header) — up to BATCH_SIZE in parallel.
 * 5. Return sorted by true video count desc.
 */
export async function searchActresses(query: string, limit = 200): Promise<ActressListData> {
	const t0 = performance.now();

	const SCAN_PAGES = 10; // fetch up to 10 × 100 = 1 000 posts for name discovery
	const BATCH_SIZE = 40; // parallel count-fetches at a time

	// ── Step 1: first page ──────────────────────────────────────────────────
	const baseParams: Record<string, string | number> = {
		per_page: 100,
		orderby: 'views',
		order: 'DESC'
	};
	if (query.trim()) baseParams.actor = query.trim();

	const firstPage = await fetchRawPage({ ...baseParams, page: 1 });
	if (firstPage.posts.length === 0) {
		return { actresses: [], query, fetchMs: Math.round(performance.now() - t0), totalScanned: 0 };
	}

	// ── Step 2: fetch remaining pages in parallel ───────────────────────────
	const pagesToFetch = Math.min(firstPage.totalPages, SCAN_PAGES);
	const pagePromises = Array.from({ length: pagesToFetch - 1 }, (_, i) =>
		fetchRawPage({ ...baseParams, page: i + 2 })
	);
	const restPages = await Promise.all(pagePromises);

	// ── Step 3: build actor → thumbnails map ────────────────────────────────
	const allPosts = [firstPage, ...restPages].flatMap((p) => p.posts);
	const actorMap = new Map<string, string[]>(); // name → thumbnail list

	for (const post of allPosts) {
		for (const actor of post.actors) {
			const name = actor.trim();
			if (!name) continue;
			if (!actorMap.has(name)) actorMap.set(name, []);
			const thumbs = actorMap.get(name)!;
			if (thumbs.length < 3 && post.thumbnail) thumbs.push(post.thumbnail);
		}
	}

	// Filter by query if specified (when query is set, API already filters — but
	// actor names inside posts may include co-stars, so re-filter client-side)
	let candidates = [...actorMap.keys()];
	if (query.trim()) {
		const q = query.trim().toLowerCase();
		candidates = candidates.filter((n) => n.toLowerCase().includes(q));
	}

	// ── Step 4: batch-fetch true video counts ───────────────────────────────
	// Limit how many we resolve counts for to keep load reasonable
	const TOP_CANDIDATES = Math.min(candidates.length, limit * 2);
	const candidateSlice = candidates.slice(0, TOP_CANDIDATES);

	const countResults: number[] = [];
	for (let i = 0; i < candidateSlice.length; i += BATCH_SIZE) {
		const batch = candidateSlice.slice(i, i + BATCH_SIZE);
		const counts = await Promise.all(batch.map(fetchActressVideoCount));
		countResults.push(...counts);
	}

	// ── Step 5: build Actress objects, sort, cap ─────────────────────────────
	const actresses: Actress[] = candidateSlice
		.map(
			(name, idx) =>
				({
					name,
					slug: encodeURIComponent(name),
					videoCount: countResults[idx] ?? actorMap.get(name)!.length,
					avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=200&background=7c3aed&color=fff&bold=true&format=svg`,
					previewThumbs: actorMap.get(name) ?? []
				}) satisfies Actress
		)
		.filter((a) => a.videoCount > 0)
		.sort((a, b) => b.videoCount - a.videoCount)
		.slice(0, limit);

	const fetchMs = Math.round(performance.now() - t0);
	return { actresses, query, fetchMs, totalScanned: allPosts.length };
}

/**
 * Fetch a paginated list of videos for a specific actress by name.
 */
export async function getActressPageData(
	name: string,
	opts: { page?: number; perPage?: number; orderby?: string; order?: string } = {}
): Promise<ActressPageData> {
	const { page = 1, perPage = 24, orderby = 'views', order = 'DESC' } = opts;

	const { videos, total, totalPages } = await fetchPosts({
		per_page: perPage,
		page,
		actor: name,
		orderby,
		order
	});

	// Build actress meta from the videos already fetched (no extra request needed)
	const actress: Actress = {
		name,
		slug: encodeURIComponent(name),
		videoCount: total, // real count from X-WP-Total header
		avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=200&background=7c3aed&color=fff&bold=true&format=svg`,
		previewThumbs: videos.slice(0, 3).map((v) => v.thumbnailUrl)
	};

	return { actress, videos, total, totalPages, page };
}
