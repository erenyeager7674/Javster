import { searchVideos } from '$lib/server/api.js';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ url }) => {
	const query = url.searchParams.get('q') ?? '';
	const category = url.searchParams.get('category') ?? undefined;
	const actor = url.searchParams.get('actor') ?? undefined;
	const studio = url.searchParams.get('studio') ?? undefined;
	const sort = url.searchParams.get('sort') ?? 'relevance';
	const page = parseInt(url.searchParams.get('page') ?? '1', 10);

	if (!query.trim() && !category && !actor && !studio) {
		return { results: null, query: '' };
	}

	// Map sort parameter to orderby/order
	const orderby = sort === 'recent' ? 'date' : sort === 'most-viewed' ? 'views' : 'relevance';
	const order = 'DESC';

	const results = await searchVideos(query, {
		limit: 24,
		page,
		category,
		actor,
		studio,
		orderby,
		order
	});
	return { results, query };
};
