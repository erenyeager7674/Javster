import { getChannelPageData } from '$lib/server/api.js';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params }) => {
	const data = await getChannelPageData(params.id);
	if (!data.channel) {
		error(404, 'Channel not found');
	}
	return data;
};
