<script lang="ts">
	import { page } from '$app/stores';

	interface Props {
		categories?: unknown[];
	}

	let { categories }: Props = $props();

	let searchQuery = $state('');
	let mobileSearchOpen = $state(false);

	const navLinks = [
		{ label: 'Home', href: '/' },
		{ label: 'Trending', href: '/browse/trending' },
		{ label: 'Categories', href: '/categories' },
		{ label: 'New', href: '/browse/new' },
		{ label: 'Actresses', href: '/actresses' }
	];

	const isActive = (href: string) => {
		const p = $page.url.pathname;
		return href === '/' ? p === '/' : p.startsWith(href);
	};

	function handleSearch(e: Event) {
		e.preventDefault();
		if (searchQuery.trim()) {
			window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
		}
	}
</script>

<header
	class="border-border/80 bg-card/85 fixed top-0 right-0 left-0 z-50 h-16 border-b backdrop-blur-xl"
>
	<div class="flex h-full items-center gap-3 px-4 sm:px-6">
		<!-- Brand Logo -->
		<a href="/" class="group mr-2 flex shrink-0 items-center">
			<span class="text-foreground hidden text-lg font-black tracking-tight sm:block">
				JAV<span class="text-primary">STER</span>
			</span>
		</a>

		<!-- Desktop Nav Links -->
		<nav class="hidden items-center gap-1 md:flex">
			{#each navLinks as link (link.href)}
				{@const active = isActive(link.href)}
				<a
					href={link.href}
					class="relative rounded-xl px-3.5 py-2 text-xs font-bold transition-all duration-150 {active
						? 'bg-primary/10 text-primary font-extrabold'
						: 'text-muted-foreground hover:bg-muted hover:text-foreground'}"
				>
					{link.label}
					{#if active}
						<span
							class="bg-primary absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full"
						></span>
					{/if}
				</a>
			{/each}
		</nav>

		<!-- Search Bar -->
		<form onsubmit={handleSearch} class="mx-auto hidden max-w-md flex-1 sm:block">
			<div class="relative">
				<svg
					class="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
				<input
					type="search"
					bind:value={searchQuery}
					onfocus={() => (searchFocused = true)}
					onblur={() => (searchFocused = false)}
					placeholder="Search videos, actresses, studios..."
					class="border-border bg-background/80 text-foreground focus:border-primary focus:ring-primary/20 w-full rounded-2xl border py-2 pr-4 pl-10 text-xs font-medium transition-all duration-200 outline-none focus:ring-2"
				/>
				{#if searchQuery}
					<button
						type="button"
						onclick={() => (searchQuery = '')}
						class="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
						aria-label="Clear search"
					>
						<svg
							class="h-3.5 w-3.5"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							viewBox="0 0 24 24"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				{/if}
			</div>
		</form>

		<!-- Right Quick Links & Profile -->
		<div class="ml-auto flex shrink-0 items-center gap-1.5">
			<button
				onclick={() => (mobileSearchOpen = !mobileSearchOpen)}
				class="border-border bg-card text-muted-foreground hover:text-foreground flex h-9 w-9 items-center justify-center rounded-xl border transition-colors sm:hidden"
				aria-label="Search"
			>
				<svg
					class="h-4.5 w-4.5"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/></svg
				>
			</button>

			<a
				href="/actresses"
				class="border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground hidden items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-colors lg:flex"
			>
				<svg
					class="text-primary h-3.5 w-3.5"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
					/></svg
				>
				Actresses
			</a>

			<a
				href="/browse/trending"
				class="border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground hidden items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-colors xl:flex"
			>
				<svg
					class="text-primary h-3.5 w-3.5"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
					/></svg
				>
				Trending
			</a>

			<div class="bg-border mx-1 hidden h-5 w-px sm:block"></div>

			<button
				class="bg-primary text-primary-foreground shadow-primary/20 flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black shadow-md transition-all hover:scale-105"
				aria-label="User Account"
			>
				JV
			</button>
		</div>
	</div>

	{#if mobileSearchOpen}
		<div class="border-border bg-card border-t px-4 py-2.5 sm:hidden">
			<form onsubmit={handleSearch}>
				<div class="relative">
					<svg
						class="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/></svg
					>
					<input
						type="search"
						bind:value={searchQuery}
						placeholder="Search videos, actresses..."
						class="border-border bg-background text-foreground focus:border-primary w-full rounded-xl border py-2 pr-4 pl-10 text-xs font-medium outline-none"
					/>
				</div>
			</form>
		</div>
	{/if}
</header>
