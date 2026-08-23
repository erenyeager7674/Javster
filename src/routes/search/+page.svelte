<script lang="ts">
	import VideoCard from '$lib/components/video/VideoCard.svelte';
	import Avatar from '$lib/components/ui/Avatar.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import { formatSubscribers } from '$lib/types/index.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let { data } = $props();
	const { results, query } = $derived(data);

	let filter = $state<'all' | 'videos' | 'channels'>('all');
	const sortBy = $derived(
		($page.url.searchParams.get('sort') as 'relevance' | 'recent' | 'most-viewed' | null) ||
			'relevance'
	);

	function navigatePage(p: number) {
		const u = new URL($page.url);
		u.searchParams.set('page', String(p));
		goto(u.toString());
	}

	function navigateSort(sort: 'relevance' | 'recent' | 'most-viewed') {
		const u = new URL($page.url);
		u.searchParams.set('sort', sort);
		goto(u.toString());
	}
</script>

<svelte:head>
	<title>{query ? `"${query}" — Search` : 'Search'} &middot; Javster</title>
</svelte:head>

<div class="bg-background text-foreground mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-8">
	{#if !query}
		<div class="flex flex-col items-center justify-center py-32 text-center">
			<div
				class="bg-muted text-muted-foreground mb-4 flex h-16 w-16 items-center justify-center rounded-full"
			>
				<svg
					class="h-8 w-8"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
			</div>
			<h1 class="text-foreground text-xl font-bold">Search videos, actresses, studios</h1>
			<p class="text-muted-foreground mt-1 text-sm">
				Use the search bar above to explore the collection
			</p>
		</div>
	{:else if results}
		<div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<h1 class="text-foreground text-xl font-extrabold tracking-tight sm:text-2xl">
					Results for <span class="text-primary">"{query}"</span>
				</h1>
				<p class="text-muted-foreground mt-0.5 text-xs">
					{results.totalCount.toLocaleString()} result{results.totalCount !== 1 ? 's' : ''} found
				</p>
			</div>
			<div class="flex flex-wrap items-center gap-3">
				<div class="border-border/80 bg-card flex flex-wrap gap-1.5 rounded-2xl border p-1">
					{#each [['all', 'All'], ['videos', 'Videos'], ['channels', 'Channels']] as [val, label] (val)}
						<button
							onclick={() => (filter = val as typeof filter)}
							class="rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all {filter === val
								? 'border-primary bg-primary text-primary-foreground border shadow-xs'
								: 'text-muted-foreground hover:bg-muted hover:text-foreground'}"
						>
							{label}
						</button>
					{/each}
				</div>

				{#if filter === 'all' || filter === 'videos'}
					<div class="border-border/80 bg-card flex flex-wrap gap-1.5 rounded-2xl border p-1">
						{#each [['relevance', 'Relevance'], ['recent', 'Recent'], ['most-viewed', 'Most Viewed']] as [val, label] (val)}
							<button
								onclick={() => navigateSort(val as typeof sortBy)}
								class="rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all {sortBy === val
									? 'border-primary bg-primary text-primary-foreground border shadow-xs'
									: 'text-muted-foreground hover:bg-muted hover:text-foreground'}"
							>
								{label}
							</button>
						{/each}
					</div>
				{/if}
			</div>
		</div>

		{#if results.channels.length > 0 && (filter === 'all' || filter === 'channels')}
			<div class="mb-8 space-y-3">
				<h2 class="text-primary text-xs font-bold tracking-widest uppercase">Channels & Studios</h2>
				<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{#each results.channels as channel (channel.id)}
						<a
							href="/channel/{channel.id}"
							class="group border-border bg-card hover:border-primary/50 flex items-center gap-4 rounded-2xl border p-4 shadow-xs transition-all hover:shadow-md"
						>
							<Avatar src={channel.avatarUrl} alt={channel.name} size="lg" />
							<div class="min-w-0">
								<div class="flex items-center gap-1">
									<span
										class="text-foreground group-hover:text-primary truncate font-bold transition-colors"
										>{channel.name}</span
									>
									{#if channel.verified}
										<svg
											class="text-primary h-3.5 w-3.5 shrink-0"
											fill="currentColor"
											viewBox="0 0 24 24"
											><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg
										>
									{/if}
								</div>
								<p class="text-muted-foreground truncate text-xs">{channel.handle}</p>
								<p class="text-muted-foreground/75 font-mono text-xs">
									{formatSubscribers(channel.subscriberCount)}
								</p>
							</div>
						</a>
					{/each}
				</div>
			</div>
		{/if}

		{#if results.videos.length > 0 && (filter === 'all' || filter === 'videos')}
			<div class="space-y-4">
				<h2 class="text-primary text-xs font-bold tracking-widest uppercase">Videos</h2>
				<div class="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
					{#each results.videos as video (video.id)}
						<VideoCard {video} />
					{/each}
				</div>
			</div>

			<!-- Single Pagination -->
			<Pagination
				currentPage={parseInt($page.url.searchParams.get('page') ?? '1', 10)}
				totalPages={results.totalPages}
				onNavigate={navigatePage}
			/>
		{:else if results.videos.length === 0 && filter !== 'channels'}
			<div class="border-border bg-card rounded-3xl border py-20 text-center">
				<p class="text-foreground text-base font-bold">No videos found for "{query}"</p>
				<p class="text-muted-foreground mt-1 text-xs">
					Try different keywords, actress names, or categories
				</p>
			</div>
		{/if}
	{/if}
</div>
