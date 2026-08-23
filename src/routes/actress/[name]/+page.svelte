<script lang="ts">
	import VideoCard from '$lib/components/video/VideoCard.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let { data } = $props();

	const SORT_OPTIONS = [
		{ label: 'Most Viewed', orderby: 'views', order: 'DESC' },
		{ label: 'Newest', orderby: 'date', order: 'DESC' },
		{ label: 'Oldest', orderby: 'date', order: 'ASC' }
	];

	function navigate(opts: { page?: number; orderby?: string; order?: string }) {
		const u = new URL($page.url);
		if (opts.page !== undefined) u.searchParams.set('page', String(opts.page));
		if (opts.orderby) u.searchParams.set('orderby', opts.orderby);
		if (opts.order) u.searchParams.set('order', opts.order);
		goto(u.toString());
	}

	const orderby = $derived($page.url.searchParams.get('orderby') ?? 'views');
	const order = $derived($page.url.searchParams.get('order') ?? 'DESC');

	const currentSort = $derived(
		SORT_OPTIONS.find((o) => o.orderby === orderby && o.order === order) ?? SORT_OPTIONS[0]
	);
</script>

<svelte:head>
	<title>{data.actress.name} &middot; Javster</title>
	<meta
		name="description"
		content="Watch all {data.total.toLocaleString()} videos featuring {data.actress
			.name} on Javster."
	/>
</svelte:head>

<div class="bg-background text-foreground min-h-screen">
	<!-- ── Profile Hero Showcase ── -->
	<div class="border-border/80 bg-card relative overflow-hidden border-b">
		<!-- Backdrop Ambient Blur Layer -->
		{#if data.actress.previewThumbs[0]}
			<div class="absolute inset-0 overflow-hidden">
				<img
					src={data.actress.previewThumbs[0]}
					alt=""
					aria-hidden="true"
					class="h-full w-full scale-125 object-cover opacity-20 blur-3xl"
				/>
			</div>
		{/if}

		<div class="from-card via-card/85 absolute inset-0 bg-gradient-to-t to-transparent"></div>
		<div
			class="from-primary/10 pointer-events-none absolute inset-0 bg-radial-[at_top_left] via-transparent to-transparent"
		></div>

		<!-- Foreground Hero Container -->
		<div class="relative z-10 px-4 py-12 sm:px-8 lg:px-12">
			<!-- Breadcrumbs -->
			<nav class="text-muted-foreground mb-6 flex items-center gap-2 text-xs font-medium">
				<a href="/" class="hover:text-foreground transition-colors">Home</a>
				<span class="text-muted-foreground/40">/</span>
				<a href="/actresses" class="hover:text-foreground transition-colors">Actresses</a>
				<span class="text-muted-foreground/40">/</span>
				<span class="text-primary font-semibold">{data.actress.name}</span>
			</nav>

			<div class="flex flex-col gap-8 md:flex-row md:items-end">
				<!-- Multi-Thumbnail Mosaic Avatar Frame -->
				<div class="relative shrink-0">
					<div
						class="border-primary/30 bg-muted/60 ring-primary/10 grid h-36 w-36 grid-cols-2 gap-1.5 overflow-hidden rounded-3xl border-2 p-1 shadow-2xl ring-4 sm:h-44 sm:w-44"
					>
						{#each [0, 1, 2, 3] as qi (qi)}
							{@const thumb = data.actress.previewThumbs[qi % data.actress.previewThumbs.length]}
							<div class="bg-card overflow-hidden rounded-xl">
								{#if thumb}
									<img
										src={thumb}
										alt=""
										class="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
										loading={qi === 0 ? 'eager' : 'lazy'}
									/>
								{:else}
									<div
										class="text-muted-foreground flex h-full w-full items-center justify-center font-mono text-sm font-bold"
									>
										{data.actress.name.charAt(0)}
									</div>
								{/if}
							</div>
						{/each}
					</div>

					<!-- Floating Total Pill -->
					<div
						class="border-primary/40 bg-primary text-primary-foreground shadow-primary/25 absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full border px-3.5 py-1 text-xs font-bold whitespace-nowrap shadow-lg"
					>
						{data.total.toLocaleString()} Videos
					</div>
				</div>

				<!-- Profile Info & Meta -->
				<div class="flex-1 space-y-3">
					<div class="flex flex-wrap items-center gap-2">
						<span
							class="border-primary/30 bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-bold"
						>
							<svg class="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
								<path
									d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
								/>
							</svg>
							Verified Talent
						</span>
						<span
							class="border-border/80 bg-background/60 text-muted-foreground rounded-lg border px-2.5 py-0.5 font-mono text-xs"
						>
							{data.videos.length} On this page
						</span>
					</div>

					<h1
						class="text-foreground text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
					>
						{data.actress.name}
					</h1>

					<p class="text-muted-foreground text-sm">
						Complete media collection and HD video streaming catalog for <span
							class="text-foreground font-semibold">{data.actress.name}</span
						>.
					</p>

					<!-- Action Buttons -->
					<div class="flex flex-wrap gap-2.5 pt-2">
						<Button
							href="/search?actor={encodeURIComponent(data.actress.name)}"
							variant="primary"
							size="md"
						>
							<svg
								class="h-4 w-4"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M15 10l4.55-2.28A1 1 0 0 1 21 8.62v6.76a1 1 0 0 1-1.45.9L15 14M5 19h8a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"
								/>
							</svg>
							<span>Filter Actress Videos</span>
						</Button>

						<Button
							href="/search?q={encodeURIComponent(data.actress.name)}"
							variant="outline"
							size="md"
						>
							<svg
								class="h-4 w-4"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
							<span>Global Search</span>
						</Button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- ── Video Grid & Controls Section ── -->
	<div class="px-4 py-8 sm:px-8 lg:px-12">
		<!-- Toolbar: Title & Sorting Pills -->
		<div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<h2 class="text-foreground text-lg font-bold">Video Filmography</h2>
				<p class="text-muted-foreground text-xs">
					{data.total.toLocaleString()} total titles available
				</p>
			</div>

			<!-- Sort Filter Pills -->
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

		<!-- Video Grid -->
		<div
			class="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
		>
			{#each data.videos as video (video.id)}
				<VideoCard {video} />
			{/each}
		</div>

		<!-- Single Sleek Pagination -->
		<Pagination
			currentPage={data.page}
			totalPages={data.totalPages}
			onNavigate={(p) => navigate({ page: p })}
		/>
	</div>
</div>
