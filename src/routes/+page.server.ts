import { getHomePageData } from '$lib/server/api.js';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async () => {
	// All fetches run in parallel server-side — zero client JS overhead
	const data = await getHomePageData();
	return data;
};
