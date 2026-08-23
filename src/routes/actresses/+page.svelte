<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import ActressCard from '$lib/components/actress/ActressCard.svelte';

	let { data } = $props();

	// --------------------------------
	// SEARCH
	// --------------------------------
	let searchInput = $state($page.url.searchParams.get('q') ?? '');

	function handleSubmit(e: Event) {
		e.preventDefault();
		const query = searchInput.trim();
		const u = new URL($page.url);

		if (query) {
			u.searchParams.set('q', query);
		} else {
			u.searchParams.delete('q');
		}

		letterFilter = '';
		goto(u.toString());
	}

	function clearSearch() {
		searchInput = '';
		const u = new URL($page.url);
		u.searchParams.delete('q');
		letterFilter = '';
		goto(u.toString());
	}

	// --------------------------------
	// ALPHABET FILTER
	// --------------------------------
	let letterFilter = $state('');
	const alphabet = ['All', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

	const filtered = $derived(
		letterFilter && letterFilter !== 'All'
			? data.actresses.filter((a: { name: string }) =>
					a.name.toUpperCase().startsWith(letterFilter)
				)
			: data.actresses
	);

	function selectLetter(letter: string) {
		letterFilter = letter === 'All' ? '' : letter;
	}
</script>

<svelte:head>
	<title>Actresses &middot; Javster</title>
	<meta name="description" content="Browse {data.actresses.length}+ actresses on Javster." />
</svelte:head>

<div class="bg-background min-h-screen px-4 py-8 sm:px-8 lg:px-10">
	<!-- ── Header Banner ── -->
	<div
		class="border-border/80 bg-card relative mb-8 overflow-hidden rounded-3xl border p-6 shadow-xs sm:p-10"
	>
		<!-- Background Glow -->
		<div
			class="bg-primary/10 pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full blur-3xl"
		></div>
		<div
			class="bg-secondary/10 pointer-events-none absolute bottom-0 left-1/3 h-48 w-48 rounded-full blur-3xl"
		></div>

		<div class="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
			<div class="max-w-2xl space-y-2">
				<div class="flex items-center gap-2">
					<span class="bg-primary inline-flex h-2 w-2 animate-pulse rounded-full"></span>
					<p class="text-primary text-xs font-bold tracking-widest uppercase">Talent Directory</p>
					<span class="text-muted-foreground/50 text-xs">&bull;</span>
					<p class="text-muted-foreground text-xs font-semibold">
						{data.actresses.length.toLocaleString()} Actresses Indexed
					</p>
				</div>

				<h1 class="text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
					Discover Actresses
				</h1>

				<p class="text-muted-foreground text-sm leading-relaxed">
					Explore comprehensive actress profiles, filmographies, and trending videos across
					Japanese, Korean, and Asian idol media.
				</p>
			</div>

			<!-- Search Input Box -->
			<form onsubmit={handleSubmit} class="w-full lg:max-w-md">
				<div class="relative">
					<svg
						class="text-muted-foreground pointer-events-none absolute top-1/2 left-4 h-4.5 w-4.5 -translate-y-1/2"
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
						bind:value={searchInput}
						placeholder="Search actress name..."
						autocomplete="off"
						class="border-border bg-background/80 text-foreground focus:border-primary focus:ring-primary/20 w-full rounded-2xl border py-3.5 pr-24 pl-11 text-sm font-medium transition-all outline-none focus:ring-2"
					/>

					{#if searchInput}
						<button
							type="button"
							onclick={clearSearch}
							class="text-muted-foreground hover:bg-muted hover:text-foreground absolute top-1/2 right-20 -translate-y-1/2 rounded-full p-1"
							aria-label="Clear search"
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

					<button
						type="submit"
						class="bg-primary text-primary-foreground absolute top-1/2 right-1.5 -translate-y-1/2 rounded-xl px-4 py-2 text-xs font-bold shadow-sm transition-all hover:opacity-90 active:scale-95"
					>
						Search
					</button>
				</div>
			</form>
		</div>

		{#if data.query}
			<div
				class="border-primary/30 bg-primary/10 text-primary mt-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold"
			>
				<span>Searching: "{data.query}"</span>
				<button onclick={clearSearch} class="hover:text-foreground">✕</button>
			</div>
		{/if}
	</div>

	<!-- ── Alphabet Filter Bar ── -->
	{#if !data.query}
		<div class="border-border/80 bg-card/60 mb-8 rounded-2xl border p-4 backdrop-blur-sm">
			<div class="mb-3 flex items-center justify-between">
				<p class="text-muted-foreground text-xs font-bold tracking-wider uppercase">
					Filter by letter
				</p>
				{#if letterFilter}
					<button
						type="button"
						onclick={() => selectLetter('All')}
						class="text-primary text-xs font-semibold hover:underline"
					>
						Reset Filter
					</button>
				{/if}
			</div>

			<div class="flex flex-wrap gap-1.5">
				{#each alphabet as letter (letter)}
					{@const active = (letter === 'All' && !letterFilter) || letterFilter === letter}
					<button
						type="button"
						onclick={() => selectLetter(letter)}
						class="flex h-8 min-w-8 items-center justify-center rounded-xl px-2.5 font-mono text-xs font-bold transition-all duration-150 active:scale-95 {active
							? 'border-primary bg-primary text-primary-foreground shadow-primary/20 border shadow-md'
							: 'border-border bg-background text-muted-foreground hover:border-primary/40 hover:bg-muted hover:text-foreground border'}"
					>
						{letter}
					</button>
				{/each}
			</div>
		</div>
	{/if}

	<!-- ── Results Count ── -->
	{#if filtered.length > 0}
		<div class="text-muted-foreground mb-6 flex items-center justify-between text-xs font-medium">
			<p>
				Showing <span class="text-foreground font-bold">{filtered.length.toLocaleString()}</span>
				{filtered.length === 1 ? 'actress' : 'actresses'}
			</p>
			{#if letterFilter}
				<span class="bg-muted text-foreground rounded-lg px-2.5 py-1 text-xs font-semibold">
					Letter: {letterFilter}
				</span>
			{/if}
		</div>
	{/if}

	<!-- ── Empty State ── -->
	{#if filtered.length === 0}
		<div
			class="border-border bg-card flex flex-col items-center justify-center rounded-3xl border py-28 text-center"
		>
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
						d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0z"
					/>
				</svg>
			</div>
			<h2 class="text-foreground text-lg font-bold">No Actresses Found</h2>
			<p class="text-muted-foreground mt-1 max-w-sm text-sm">
				{#if data.query}
					We couldn't find any actress profiles matching "{data.query}".
				{:else if letterFilter}
					No actresses found starting with "{letterFilter}".
				{/if}
			</p>
			<button
				type="button"
				onclick={clearSearch}
				class="bg-primary text-primary-foreground shadow-primary/20 mt-6 rounded-xl px-5 py-2.5 text-xs font-bold shadow-md transition-all hover:opacity-90 active:scale-95"
			>
				Show All Actresses
			</button>
		</div>
	{:else}
		<!-- ── Actress Cards Grid ── -->
		<div
			class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7"
		>
			{#each filtered as actress (actress.name)}
				<ActressCard {actress} />
			{/each}
		</div>
	{/if}
</div>
