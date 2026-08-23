import { getCategories } from '$lib/server/api.js';
import type { LayoutServerLoad } from './$types.js';

export const load: LayoutServerLoad = async () => {
	const categories = await getCategories();
	return { categories };
};
