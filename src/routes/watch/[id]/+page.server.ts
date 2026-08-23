import { getWatchPageData, getPlayerById } from '$lib/server/api.js';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params }) => {
	const [data, player] = await Promise.all([getWatchPageData(params.id), getPlayerById(params.id)]);

	if (!data.video) {
		error(404, 'Video not found');
	}

	// Attach the permanent embed from the player endpoint (overrides post-level embed)
	if (player && data.video) {
		data.video.embedUrl = player.embed_url;
		data.video.iframeHtml = player.iframe_html;
	}

	return data;
};
