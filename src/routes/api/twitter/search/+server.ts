import { json, type RequestEvent } from '@sveltejs/kit';
import { searchNSFWContent } from '$lib/server/twitter.js';

export async function POST({ request }: RequestEvent) {
	try {
		const { query } = await request.json();

		if (!query?.trim()) {
			return json({ success: false, error: 'Query is required' }, { status: 400 });
		}

		const results = await searchNSFWContent(query);
		return json({ success: true, results });
	} catch (e) {
		return json(
			{ success: false, error: e instanceof Error ? e.message : 'Search failed' },
			{ status: 500 }
		);
	}
}
