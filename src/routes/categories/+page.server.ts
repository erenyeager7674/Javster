import { getCategories, getBrowsePageData } from '$lib/server/api.js';
import type { PageServerLoad } from './$types.js';

export interface CategoryGroup {
	id: string;
	title: string;
	description: string;
	icon: string;
	categories: Array<{
		name: string;
		slug: string;
		tag?: string;
		imageUrl?: string;
	}>;
}

export const load: PageServerLoad = async () => {
	const allCategories = await getCategories();

	// Filter out countries as requested
	const validCategories = allCategories.filter(
		(c) =>
			!['Japanese', 'Chinese', 'Korean', 'Western', 'Home', 'Trending', 'New Releases'].includes(
				c.name
			)
	);

	// Fetch images from API for each category
	async function getCategoryImage(categoryName: string): Promise<string> {
		try {
			const { videos } = await getBrowsePageData(categoryName, { perPage: 1 });
			if (videos.length > 0 && videos[0].thumbnailUrl) {
				return videos[0].thumbnailUrl;
			}
		} catch {
			// Fallback to placeholder if API call fails
		}
		// Fallback placeholder
		return `https://via.placeholder.com/400x300/27272a/ffffff?text=${encodeURIComponent(categoryName)}`;
	}

	const baseGroups: Array<{
		id: string;
		title: string;
		description: string;
		icon: string;
		categories: Array<{ name: string; slug: string; tag?: string }>;
	}> = [
		{
			id: 'content-types',
			title: 'Content Formats',
			description: 'Censorship styles, amateur productions, and studio exclusives',
			icon: 'film',
			categories: [
				{ name: 'Uncensored', slug: '/browse/Uncensored', tag: 'Top Rated' },
				{ name: 'Uncensored Leak', slug: '/browse/Uncensored+leak', tag: 'Trending' },
				{ name: 'Censored', slug: '/browse/Censored' },
				{ name: 'Amateur', slug: '/browse/Amateur', tag: 'Popular' },
				{ name: 'Exclusive', slug: '/browse/Exclusive' },
				{ name: 'Famous', slug: '/browse/Famous' },
				{ name: 'Hot Girl', slug: '/browse/Hot+Girl' },
				{ name: 'Individual', slug: '/browse/Individual' },
				{ name: 'Pick-Up', slug: '/browse/Pick-Up' },
				{ name: 'Ordinary Person', slug: '/browse/Ordinary+Person' }
			]
		},
		{
			id: 'body-types',
			title: 'Body & Aesthetics',
			description: 'Physical attributes, body shapes, and appearance styles',
			icon: 'heart',
			categories: [
				{ name: 'Big Breasts', slug: '/browse/Big+Breasts', tag: 'Hot' },
				{ name: 'Beautiful Breasts', slug: '/browse/Beautiful+Breasts' },
				{ name: 'Small Breasts', slug: '/browse/Small+Breasts' },
				{ name: 'Beautiful Legs', slug: '/browse/Beautiful+Legs' },
				{ name: 'Slender', slug: '/browse/Slender' },
				{ name: 'Plump', slug: '/browse/Plump' },
				{ name: 'Beautiful Butt', slug: '/browse/Beautiful+Butt' }
			]
		},
		{
			id: 'acts',
			title: 'Acts & Themes',
			description: 'Specific scenes, positions, and performance themes',
			icon: 'flame',
			categories: [
				{ name: 'Creampie', slug: '/browse/Creampie', tag: 'Popular' },
				{ name: 'Oral Sex', slug: '/browse/Oral+Sex' },
				{ name: 'Blowjob', slug: '/browse/Blowjob' },
				{ name: 'Handjob', slug: '/browse/Handjob' },
				{ name: 'Squirting', slug: '/browse/Squirting' },
				{ name: 'Extreme Orgasm', slug: '/browse/Extreme+Orgasm' },
				{ name: 'Threesome', slug: '/browse/Threesome' },
				{ name: 'Gangbang', slug: '/browse/Gangbang' },
				{ name: 'Lesbian', slug: '/browse/Lesbian' },
				{ name: 'Anal', slug: '/browse/Anal' },
				{ name: 'POV', slug: '/browse/POV', tag: 'Immersive' },
				{ name: 'Toys', slug: '/browse/Toys' },
				{ name: 'BDSM', slug: '/browse/BDSM' },
				{ name: 'Bondage', slug: '/browse/Bondage' }
			]
		},
		{
			id: 'scenarios',
			title: 'Roles & Scenarios',
			description: 'Cosplay, uniforms, workplace dynamics, and narrative themes',
			icon: 'user-check',
			categories: [
				{ name: 'Cosplay', slug: '/browse/Cosplay', tag: 'Hot' },
				{ name: 'Office Lady', slug: '/browse/Office+Lady' },
				{ name: 'Teacher', slug: '/browse/Teacher' },
				{ name: 'Nurse', slug: '/browse/Nurse' },
				{ name: 'Maid', slug: '/browse/Maid' },
				{ name: 'Swimsuit', slug: '/browse/Swimsuit' },
				{ name: 'School Girl', slug: '/browse/School+Girl' },
				{ name: 'Idol', slug: '/browse/Idol' },
				{ name: 'Incest', slug: '/browse/Incest' },
				{ name: 'Step Family', slug: '/browse/Step+Family' }
			]
		},
		{
			id: 'quality-platforms',
			title: 'Quality & Platforms',
			description: 'Video resolutions and external studio platforms',
			icon: 'tv',
			categories: [
				{ name: 'HD', slug: '/browse/Hd', tag: '1080p' },
				{ name: '4K', slug: '/browse/4K', tag: 'Ultra HD' },
				{ name: 'VR', slug: '/browse/VR', tag: '360°' },
				{ name: 'Missav', slug: '/browse/Missav' },
				{ name: '123av', slug: '/browse/123av' }
			]
		}
	];

	// Add images from API to each category
	const groups: CategoryGroup[] = await Promise.all(
		baseGroups.map(async (group) => ({
			...group,
			categories: await Promise.all(
				group.categories.map(async (cat) => ({
					...cat,
					imageUrl: await getCategoryImage(cat.name)
				}))
			)
		}))
	);

	return {
		groups,
		totalCategories: validCategories.length
	};
};
