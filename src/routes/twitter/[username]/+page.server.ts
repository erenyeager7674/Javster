import type { PageServerLoad } from './$types.js';
import { getUserInfo, getUserTweets } from '$lib/server/twitter.js';

export const load: PageServerLoad = async ({ params, url }) => {
	try {
		const username = params.username;
		const cursor = url.searchParams.get('cursor') || undefined;

		// Get user info first (only on the initial load, not on cursor navigation)
		const user = await getUserInfo(username);
		// Then get tweets with optional cursor for pagination
		const tweetsPage = await getUserTweets(username, cursor);

		return {
			user,
			tweets: tweetsPage.tweets,
			nextCursor: tweetsPage.nextCursor,
			hasNextPage: tweetsPage.hasNextPage,
			currentCursor: cursor ?? null,
			error: null
		};
	} catch (e) {
		return {
			user: null,
			tweets: [],
			nextCursor: null,
			hasNextPage: false,
			currentCursor: null,
			error: e instanceof Error ? e.message : 'Failed to load cosplayer data'
		};
	}
};
