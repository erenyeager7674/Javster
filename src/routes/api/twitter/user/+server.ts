import { json, type RequestEvent } from '@sveltejs/kit';
import { getUserInfo, getUserTweets } from '$lib/server/twitter.js';

export async function POST({ request }: RequestEvent) {
	try {
		const { username, cursor } = await request.json();

		if (!username?.trim()) {
			return json({ success: false, error: 'Username is required' }, { status: 400 });
		}

		const user = await getUserInfo(username);
		const tweetsPage = await getUserTweets(username, cursor || undefined);

		return json({
			success: true,
			results: {
				tweets: tweetsPage.tweets,
				users: [user],
				nextCursor: tweetsPage.nextCursor,
				hasNextPage: tweetsPage.hasNextPage,
				totalCount: tweetsPage.tweets.length
			}
		});
	} catch (e) {
		return json(
			{ success: false, error: e instanceof Error ? e.message : 'User lookup failed' },
			{ status: 500 }
		);
	}
}
