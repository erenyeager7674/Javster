import { getActressPageData } from '$lib/server/api.js';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params, url }) => {
	const name = decodeURIComponent(params.name);
	const page = parseInt(url.searchParams.get('page') ?? '1', 10);
	const orderby = url.searchParams.get('orderby') ?? 'views';
	const order = url.searchParams.get('order') ?? 'DESC';

	const data = await getActressPageData(name, { page, orderby, order, perPage: 24 });

	if (!data.videos.length && page === 1) {
		error(404, `No videos found for actress "${name}"`);
	}

	return data;
};
