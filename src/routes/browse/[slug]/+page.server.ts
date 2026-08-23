import { getBrowsePageData } from '$lib/server/api.js';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params, url }) => {
	const page = parseInt(url.searchParams.get('page') ?? '1', 10);
	const orderby = url.searchParams.get('orderby') ?? 'views';
	const order = url.searchParams.get('order') ?? 'DESC';

	return getBrowsePageData(params.slug, { page, orderby, order, perPage: 24 });
};
