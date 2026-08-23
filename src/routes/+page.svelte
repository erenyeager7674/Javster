<script lang="ts">
	import HeroBanner from '$lib/components/video/HeroBanner.svelte';
	import VideoRow from '$lib/components/video/VideoRow.svelte';
	import VideoCard from '$lib/components/video/VideoCard.svelte';

	let { data } = $props();

	// Use top trending videos as carousel slides (up to 10)
	const heroVideos = $derived(data.trending.slice(0, 10));

	// Featured spotlight video (first trending)
	const spotlight = $derived(data.trending[0]);

	// Top picks in a 2x2 grid alongside the spotlight
	const spotlightSide = $derived(data.trending.slice(1, 5));

	// Category shortcut definitions with emoji icons
	const quickLinks = [
		{
			label: 'Uncensored',
			href: '/browse/Uncensored',
			icon: '🔥',
			accent: 'from-orange-500/20 to-red-500/10 border-orange-500/30'
		},
		{
			label: 'Amateur',
			href: '/browse/Amateur',
			icon: '🎥',
			accent: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30'
		},
		{
			label: 'Creampie',
			href: '/browse/Creampie',
			icon: '💫',
			accent: 'from-purple-500/20 to-violet-500/10 border-purple-500/30'
		},
		{
			label: 'Cosplay',
			href: '/browse/Cosplay',
			icon: '🌸',
			accent: 'from-pink-500/20 to-rose-500/10 border-pink-500/30'
		},
		{
			label: 'POV',
			href: '/browse/POV',
			icon: '👁️',
			accent: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30'
		},
		{
			label: 'Lesbian',
			href: '/browse/Lesbian',
			icon: '♀️',
			accent: 'from-fuchsia-500/20 to-pink-500/10 border-fuchsia-500/30'
		}
	];
</script>

<svelte:head>
	<title>Javster &middot; Premium Streaming</title>
	<meta name="description" content="Watch trending JAV, uncensored, amateur and more on Javster." />
</svelte:head>

<div class="bg-background text-foreground min-h-screen">
	<!-- ── HERO CAROUSEL ── -->
	<div class="px-4 pt-6 sm:px-8 lg:px-10">
		{#if heroVideos.length > 0}
			<HeroBanner videos={heroVideos} />
		{/if}
	</div>

	<!-- ── QUICK CATEGORY SHORTCUTS ── -->
	<div class="px-4 pt-6 sm:px-8 lg:px-10">
		<div class="scrollbar-hide flex items-center gap-2.5 overflow-x-auto pb-1">
			{#each quickLinks as link (link.label)}
				<a
					href={link.href}
					class="group text-foreground flex shrink-0 items-center gap-2 rounded-2xl border bg-gradient-to-br px-4 py-2.5 text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md {link.accent}"
				>
					<span class="text-base leading-none">{link.icon}</span>
					<span>{link.label}</span>
				</a>
			{/each}
			<a
				href="/categories"
				class="border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-primary flex shrink-0 items-center gap-1.5 rounded-2xl border px-4 py-2.5 text-xs font-bold transition-all hover:-translate-y-0.5"
			>
				<span>All Categories</span>
				<span class="font-mono">&rarr;</span>
			</a>
		</div>
	</div>

	<!-- ── SPOTLIGHT + SIDE PICKS GRID ── -->
	{#if spotlight}
		<div class="mt-8 px-4 sm:px-8 lg:px-10">
			<div class="mb-4 flex items-center gap-2">
				<span class="bg-primary h-4 w-1 rounded-full"></span>
				<h2 class="text-foreground text-xl font-bold tracking-tight">Editor's Picks</h2>
				<span
					class="bg-primary/15 text-primary ml-2 rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase"
					>Featured</span
				>
			</div>

			<div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
				<!-- Main spotlight card — wider -->
				<div class="lg:col-span-2">
					<VideoCard video={spotlight} />
				</div>

				<!-- Side 2x2 grid -->
				<div class="grid grid-cols-2 gap-3">
					{#each spotlightSide as video (video.id)}
						<VideoCard {video} showChannel={false} />
					{/each}
				</div>
			</div>
		</div>
	{/if}

	<!-- ── STATS RIBBON ── -->
	{#if data.serverTotal}
		<div class="mt-10 px-4 sm:px-8 lg:px-10">
			<div class="border-border/80 bg-card relative overflow-hidden rounded-3xl border p-5">
				<!-- Ambient glow -->
				<div
					class="bg-primary/10 pointer-events-none absolute -top-10 -right-10 h-48 w-48 rounded-full blur-3xl"
				></div>

				<div class="relative flex flex-wrap items-center gap-5 sm:gap-10">
					<div>
						<p class="text-primary font-mono text-2xl font-extrabold">
							{(data.serverTotal / 1000).toFixed(0)}K+
						</p>
						<p class="text-muted-foreground text-[11px] font-semibold">Free Videos</p>
					</div>
					<div class="bg-border hidden h-8 w-px sm:block"></div>
					<div>
						<p class="text-foreground font-mono text-2xl font-extrabold">
							{data.categoryRows.length}+
						</p>
						<p class="text-muted-foreground text-[11px] font-semibold">Genres & Categories</p>
					</div>
					<div class="bg-border hidden h-8 w-px sm:block"></div>
					<div>
						<p class="text-foreground font-mono text-2xl font-extrabold">HD</p>
						<p class="text-muted-foreground text-[11px] font-semibold">1080p Streams</p>
					</div>
					<div class="bg-border hidden h-8 w-px sm:block"></div>
					<p class="text-muted-foreground hidden flex-1 text-xs leading-relaxed xl:block">
						Updated daily &bull; Full HD & Uncensored &bull; Free without subscription
					</p>
					<a
						href="/categories"
						class="bg-primary text-primary-foreground shadow-primary/20 ml-auto rounded-xl px-5 py-2 text-xs font-bold shadow-md transition-all hover:opacity-90 active:scale-95"
					>
						Browse All &rarr;
					</a>
				</div>
			</div>
		</div>
	{/if}

	<!-- ── VIDEO ROWS ── -->
	<div class="mt-2 space-y-10 px-4 py-8 sm:px-8 lg:px-10">
		<VideoRow title="Trending Now" videos={data.trending} seeAllHref="/browse/trending" />
		<VideoRow title="New Releases" videos={data.newReleases} seeAllHref="/browse/new" />

		{#each data.categoryRows.slice(0, 4) as row (row.category.id)}
			<VideoRow title={row.category.name} videos={row.videos} seeAllHref={row.category.slug} />
		{/each}

		<!-- Mid-page CTA banner -->
		<div
			class="border-primary/20 from-primary/10 via-card to-card relative overflow-hidden rounded-3xl border bg-gradient-to-r p-6 sm:p-8"
		>
			<div
				class="from-primary/10 pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] via-transparent to-transparent"
			></div>
			<div class="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div class="space-y-1">
					<p class="text-primary text-[11px] font-extrabold tracking-widest uppercase">
						Discover More
					</p>
					<h3 class="text-foreground text-xl font-extrabold sm:text-2xl">Explore Every Category</h3>
					<p class="text-muted-foreground text-xs leading-relaxed">
						Browse 30+ curated genres from uncensored to cosplay, HD to VR, amateur to exclusive
						studio releases.
					</p>
				</div>
				<div class="flex shrink-0 flex-col gap-2 sm:flex-row">
					<a
						href="/categories"
						class="bg-primary text-primary-foreground shadow-primary/25 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-xs font-bold shadow-lg transition-all hover:opacity-90 active:scale-95"
					>
						<span>All Categories</span>
						<svg
							class="h-3.5 w-3.5"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							viewBox="0 0 24 24"
							><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg
						>
					</a>
					<a
						href="/actresses"
						class="border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted inline-flex items-center justify-center gap-2 rounded-xl border px-6 py-2.5 text-xs font-bold transition-all active:scale-95"
					>
						Actress Directory
					</a>
				</div>
			</div>
		</div>

		{#each data.categoryRows.slice(4) as row (row.category.id)}
			<VideoRow title={row.category.name} videos={row.videos} seeAllHref={row.category.slug} />
		{/each}

		<VideoRow title="Recommended for You" videos={data.recommended} seeAllHref="/browse/trending" />
	</div>
</div>
