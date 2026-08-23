<script lang="ts">
	let { data } = $props();

	let searchQuery = $state('');

	const filteredGroups = $derived(
		searchQuery.trim()
			? data.groups
					.map((group) => ({
						...group,
						categories: group.categories.filter((c) =>
							c.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
						)
					}))
					.filter((group) => group.categories.length > 0)
			: data.groups
	);
</script>

<svelte:head>
	<title>Categories & Genres &middot; Javster</title>
	<meta name="description" content="Browse all categories, acts, themes, and formats on Javster." />
</svelte:head>

<div class="bg-background text-foreground min-h-screen px-4 py-8 sm:px-8 lg:px-12">
	<!-- ── Header Banner ── -->
	<div
		class="border-border/80 bg-card relative mb-10 overflow-hidden rounded-3xl border p-6 shadow-xs sm:p-10"
	>
		<!-- Subtle ambient glow -->
		<div
			class="bg-primary/10 pointer-events-none absolute -top-12 right-0 h-64 w-64 rounded-full blur-3xl"
		></div>

		<div class="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
			<div class="max-w-2xl space-y-2">
				<div class="flex items-center gap-2">
					<span class="bg-primary h-2 w-2 rounded-full"></span>
					<p class="text-primary text-xs font-bold tracking-widest uppercase">Browse Library</p>
					<span class="text-muted-foreground/40 text-xs">&bull;</span>
					<p class="text-muted-foreground text-xs font-semibold">
						{data.totalCategories} Categories Available
					</p>
				</div>

				<h1 class="text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
					Explore Categories
				</h1>

				<p class="text-muted-foreground text-sm leading-relaxed">
					Discover videos by content format, actress attributes, specific performance themes,
					cosplay roles, and high-definition streams.
				</p>
			</div>

			<!-- Search Filter -->
			<div class="w-full lg:max-w-xs">
				<div class="relative">
					<svg
						class="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0z"
						/>
					</svg>

					<input
						type="search"
						bind:value={searchQuery}
						placeholder="Filter categories..."
						class="border-border bg-background/80 text-foreground focus:border-primary focus:ring-primary/20 w-full rounded-2xl border py-2.5 pr-8 pl-10 text-xs font-medium transition-all outline-none focus:ring-2"
					/>

					{#if searchQuery}
						<button
							type="button"
							onclick={() => (searchQuery = '')}
							class="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
							aria-label="Clear filter"
						>
							<svg
								class="h-3.5 w-3.5"
								fill="none"
								stroke="currentColor"
								stroke-width="2.5"
								viewBox="0 0 24 24"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6L6 18" />
							</svg>
						</button>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<!-- ── Category Groups ── -->
	<div class="space-y-12">
		{#each filteredGroups as group (group.id)}
			<section class="space-y-4">
				<div class="border-border flex items-baseline justify-between border-b pb-3">
					<div>
						<h2 class="text-foreground text-xl font-bold tracking-tight">{group.title}</h2>
						<p class="text-muted-foreground mt-0.5 text-xs">{group.description}</p>
					</div>
					<span class="text-primary/80 font-mono text-xs font-semibold">
						{group.categories.length}
						{group.categories.length === 1 ? 'tag' : 'tags'}
					</span>
				</div>

				<div
					class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
				>
					{#each group.categories as cat (cat.name)}
						<a
							href={cat.slug}
							class="group border-border/80 bg-card hover:border-primary/50 relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
						>
							{#if cat.imageUrl}
								<div class="relative aspect-[4/3] overflow-hidden">
									<img
										src={cat.imageUrl}
										alt={cat.name}
										class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
										loading="lazy"
									/>
									<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
								</div>
							{/if}

							<div class="flex flex-1 flex-col justify-between p-4">
								<div class="flex items-start justify-between gap-2">
									<h3
										class="text-foreground group-hover:text-primary text-sm leading-tight font-bold transition-colors"
									>
										{cat.name}
									</h3>
									{#if cat.tag}
										<span
											class="bg-primary/15 text-primary shrink-0 rounded-md px-1.5 py-0.5 font-mono text-[10px] font-bold"
										>
											{cat.tag}
										</span>
									{/if}
								</div>

								<div class="text-muted-foreground mt-3 flex items-center justify-between text-xs">
									<span class="group-hover:text-foreground text-[11px] transition-colors"
										>Browse &rarr;</span
									>
									<svg
										class="text-muted-foreground/50 group-hover:text-primary h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										viewBox="0 0 24 24"
									>
										<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
									</svg>
								</div>
							</div>
						</a>
					{/each}
				</div>
			</section>
		{/each}

		{#if filteredGroups.length === 0}
			<div
				class="border-border bg-card flex flex-col items-center justify-center rounded-3xl border py-24 text-center"
			>
				<p class="text-foreground text-base font-bold">No categories matched "{searchQuery}"</p>
				<button
					type="button"
					onclick={() => (searchQuery = '')}
					class="text-primary mt-4 text-xs font-bold hover:underline"
				>
					Clear Search Filter
				</button>
			</div>
		{/if}
	</div>
</div>
