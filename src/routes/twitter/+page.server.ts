import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async () => {
	// Initial load - no data needed, search is client-side
	return {};
};
