<script lang="ts">
	import { page } from '$app/stores';
	import type { Category } from '$lib/types/index.js';

	interface Props {
		categories?: Category[];
	}

	let { categories = [] }: Props = $props();

	let expanded = $state(false);
	let openSection = $state<string | null>(null);

	const primaryNav = [
		{
			label: 'Home',
			href: '/',
			icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
		},
		{
			label: 'Trending',
			href: '/browse/trending',
			icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
		},
		{
			label: 'New Releases',
			href: '/browse/new',
			icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'
		},
		{
			label: 'Categories',
			href: '/categories',
			icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'
		},
		{
			label: 'Actresses',
			href: '/actresses',
			icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
		},
		{
			label: 'Search',
			href: '/search',
			icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
		}
	];

	const categorySections = $derived<Array<{ id: string; label: string; cats: Category[] }>>(
		[
			{
				id: 'content',
				label: 'Content',
				cats: categories.filter((c) =>
					[
						'Uncensored',
						'Uncensored Leak',
						'Censored',
						'Amateur',
						'Exclusive',
						'Famous',
						'Hot Girl'
					].includes(c.name)
				)
			},
			{
				id: 'acts',
				label: 'Acts',
				cats: categories.filter((c) =>
					[
						'Creampie',
						'Oral Sex',
						'Squirting',
						'Extreme Orgasm',
						'Threesome',
						'POV',
						'Lesbian',
						'Blowjob',
						'BDSM'
					].includes(c.name)
				)
			},
			{
				id: 'scenarios',
				label: 'Scenarios',
				cats: categories.filter((c) =>
					[
						'Cosplay',
						'Office Lady',
						'Teacher',
						'Nurse',
						'Maid',
						'Swimsuit',
						'School Girl',
						'Idol'
					].includes(c.name)
				)
			},
			{
				id: 'body',
				label: 'Body Types',
				cats: categories.filter((c) =>
					[
						'Big Breasts',
						'Beautiful Breasts',
						'Small Breasts',
						'Beautiful Legs',
						'Slender',
						'Plump'
					].includes(c.name)
				)
			},
			{
				id: 'quality',
				label: 'Quality',
				cats: categories.filter((c) => ['HD', '4K', 'VR'].includes(c.name))
			}
		].filter((s) => s.cats.length > 0)
	);

	const isActive = (href: string) => {
		if (href === '/') return $page.url.pathname === '/';
		return $page.url.pathname.startsWith(href);
	};

	function toggleSection(id: string) {
		openSection = openSection === id ? null : id;
	}
</script>

<aside
	class="border-sidebar-border bg-sidebar text-sidebar-foreground fixed top-16 bottom-0 left-0 z-40 flex flex-col overflow-hidden border-r transition-[width] duration-200 ease-out {expanded
		? 'w-60 shadow-2xl shadow-black/20'
		: 'w-14'}"
	onmouseenter={() => (expanded = true)}
	onmouseleave={() => (expanded = false)}
	aria-label="Navigation sidebar"
>
	<div class="scrollbar-hide flex-1 overflow-x-hidden overflow-y-auto">
		<!-- Primary Links -->
		<nav class="space-y-0.5 px-2 pt-4 pb-2">
			{#each primaryNav as item (item.href)}
				{@const active = isActive(item.href)}
				<a
					href={item.href}
					title={!expanded ? item.label : undefined}
					class="group relative flex items-center gap-3.5 rounded-xl px-2.5 py-2.5 text-xs font-semibold transition-all duration-150 {active
						? 'bg-primary/15 text-primary'
						: 'text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground'}"
				>
					<!-- Active indicator -->
					{#if active}
						<span
							class="bg-primary absolute top-1/2 left-0 h-5 w-[3px] -translate-y-1/2 rounded-r-full"
						></span>
					{/if}

					<svg
						class="h-[18px] w-[18px] shrink-0 {active
							? 'text-primary'
							: 'text-sidebar-foreground/50 group-hover:text-sidebar-foreground'}"
						fill="none"
						stroke="currentColor"
						stroke-width="1.75"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d={item.icon} />
					</svg>

					<span
						class="truncate leading-none tracking-tight whitespace-nowrap transition-all duration-150 {expanded
							? 'translate-x-0 opacity-100'
							: 'pointer-events-none -translate-x-1 opacity-0'}"
					>
						{item.label}
					</span>
				</a>
			{/each}
		</nav>

		<!-- Separator -->
		<div class="bg-sidebar-border/60 mx-3 h-px"></div>

		<!-- Category Sections -->
		<div class="space-y-0.5 px-2 py-2">
			{#each categorySections as section (section.id)}
				<!-- Section header / toggle -->
				<button
					onclick={() => toggleSection(section.id)}
					class="hover:bg-sidebar-accent flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 transition-colors"
					title={!expanded ? section.label : undefined}
				>
					{#if expanded}
						<span class="text-muted-foreground/70 text-[10px] font-black tracking-widest uppercase">
							{section.label}
						</span>
						<svg
							class="text-muted-foreground/50 h-2.5 w-2.5 transition-transform duration-200 {openSection ===
							section.id
								? 'rotate-180'
								: ''}"
							fill="none"
							stroke="currentColor"
							stroke-width="3"
							viewBox="0 0 24 24"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
						</svg>
					{:else}
						<span class="bg-sidebar-border/80 mx-auto block h-px w-5"></span>
					{/if}
				</button>

				<!-- Category links (show in collapsed mode too, as icons) -->
				{#if !expanded || openSection === section.id}
					<div class="space-y-0.5 {expanded ? 'pb-1' : ''}">
						{#each section.cats as cat (cat.id)}
							{@const catActive = isActive(cat.slug)}
							<a
								href={cat.slug}
								title={!expanded ? cat.name : undefined}
								class="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors duration-100 {catActive
									? 'bg-primary/15 text-primary font-bold'
									: 'text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground font-medium'}"
							>
								<span
									class="h-1.5 w-1.5 shrink-0 rounded-full {catActive
										? 'bg-primary'
										: 'bg-sidebar-border'}"
								></span>
								<span
									class="truncate whitespace-nowrap transition-all duration-150 {expanded
										? 'translate-x-0 opacity-100'
										: 'pointer-events-none -translate-x-1 opacity-0'}"
								>
									{cat.name}
								</span>
							</a>
						{/each}
					</div>
				{/if}
			{/each}
		</div>

		<!-- Spacer at bottom -->
		<div class="h-6"></div>
	</div>

	<!-- Footer -->
	<div class="border-sidebar-border shrink-0 border-t px-2 py-3">
		{#if expanded}
			<div class="bg-sidebar-accent/60 rounded-xl px-3 py-2.5">
				<p class="text-foreground text-[10px] font-bold">JAVSTER</p>
				<p class="text-muted-foreground mt-0.5 text-[10px]">100K+ free HD releases</p>
			</div>
		{:else}
			<div class="flex justify-center">
				<div class="bg-primary/20 flex h-6 w-6 items-center justify-center rounded-lg">
					<svg class="text-primary h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
						<path d="M8 5v14l11-7z" />
					</svg>
				</div>
			</div>
		{/if}
	</div>
</aside>
