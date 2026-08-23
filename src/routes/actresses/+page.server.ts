import { searchActresses } from '$lib/server/api.js';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ url }) => {
	const query = url.searchParams.get('q') ?? '';
	// Fetch up to 200 actresses — multi-page scan with real video counts
	const data = await searchActresses(query, 1000);
	return data;
};
