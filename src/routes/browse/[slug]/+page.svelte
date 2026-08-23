<script lang="ts">
	import VideoCard from '$lib/components/video/VideoCard.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let { data } = $props();

	const SORT_OPTIONS = [
		{ label: 'Most Viewed', orderby: 'views', order: 'DESC' },
		{ label: 'Newest', orderby: 'date', order: 'DESC' },
		{ label: 'Oldest', orderby: 'date', order: 'ASC' },
		{ label: 'Title A–Z', orderby: 'title', order: 'ASC' }
	];

	function navigate(opts: { page?: number; orderby?: string; order?: string }) {
		const u = new URL($page.url);
		if (opts.page !== undefined) u.searchParams.set('page', String(opts.page));
		if (opts.orderby) u.searchParams.set('orderby', opts.orderby);
		if (opts.order) u.searchParams.set('order', opts.order);
		goto(u.toString());
	}

	const currentSort = $derived(
		SORT_OPTIONS.find((o) => o.orderby === data.orderby && o.order === data.order) ??
			SORT_OPTIONS[0]
	);
</script>

<svelte:head>
	<title>{data.title} &middot; Javster</title>
	<meta
		name="description"
		content="Browse {data.title} videos on Javster. {data.total.toLocaleString()} videos available."
	/>
</svelte:head>

<div class="bg-background text-foreground min-h-screen px-4 py-8 sm:px-8">
	<!-- Header & Sorting Bar -->
	<div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<nav class="text-muted-foreground mb-2 flex items-center gap-1.5 text-xs">
				<a href="/" class="hover:text-foreground transition-colors">Home</a>
				<span>/</span>
				<span class="text-primary font-semibold">{data.title}</span>
			</nav>
			<h1 class="text-foreground text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
				{data.title}
			</h1>
			<p class="text-muted-foreground mt-1 text-xs">
				{data.total.toLocaleString()} videos &bull; Page {data.page} of {data.totalPages}
			</p>
		</div>

		<!-- Sort Pills -->
		<div
			class="border-border/80 bg-card flex flex-wrap items-center gap-1.5 rounded-2xl border p-1.5 shadow-xs"
		>
			<span class="text-muted-foreground px-2 text-xs font-semibold">Sort:</span>
			{#each SORT_OPTIONS as opt (opt.label)}
				{@const active = currentSort.label === opt.label}
				<button
					onclick={() => navigate({ orderby: opt.orderby, order: opt.order, page: 1 })}
					class="rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-150 active:scale-95 {active
						? 'border-primary bg-primary text-primary-foreground shadow-primary/20 border shadow-sm'
						: 'text-muted-foreground hover:bg-muted hover:text-foreground'}"
				>
					{opt.label}
				</button>
			{/each}
		</div>
	</div>

	{#if data.videos.length > 0}
		<div
			class="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
		>
			{#each data.videos as video (video.id)}
				<VideoCard {video} />
			{/each}
		</div>
	{:else}
		<div
			class="border-border bg-card flex flex-col items-center justify-center rounded-3xl border py-32 text-center"
		>
			<svg
				class="text-muted-foreground/50 mb-4 h-16 w-16"
				fill="none"
				stroke="currentColor"
				stroke-width="1.25"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
				/>
			</svg>
			<p class="text-foreground text-sm font-semibold">No videos found in this category yet.</p>
			<a href="/" class="text-primary mt-4 text-xs font-bold hover:underline">Return to Home</a>
		</div>
	{/if}

	<!-- Single Pagination -->
	<Pagination
		currentPage={data.page}
		totalPages={data.totalPages}
		onNavigate={(p) => navigate({ page: p })}
	/>
</div>
