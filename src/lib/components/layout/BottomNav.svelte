<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { Category } from '$lib/types/index.js';

	interface Props {
		categories?: Category[];
	}

	let { categories = [] }: Props = $props();

	let menuOpen = $state(false);

	const navItems = [
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

	const isActive = (href: string) => {
		if (href === '/') return $page.url.pathname === '/';
		return $page.url.pathname.startsWith(href);
	};

	// Group categories into sections for the sheet
	const SECTION_DEFS: { label: string; names: string[] }[] = [
		{ label: 'Content', names: ['Uncensored', 'Uncensored Leak', 'Censored', 'Amateur', 'Exclusive', 'Famous', 'Hot Girl'] },
		{ label: 'Acts', names: ['Creampie', 'Oral Sex', 'Blowjob', 'Squirting', 'Threesome', 'Gangbang', 'Lesbian', 'Anal', 'BDSM', 'POV'] },
		{ label: 'Body', names: ['Big Breasts', 'Beautiful Breasts', 'Small Breasts', 'Beautiful Legs', 'Slender', 'Plump'] },
		{ label: 'Scenarios', names: ['Cosplay', 'School Girl', 'Nurse', 'Office Lady', 'Teacher', 'Maid', 'Idol'] },
		{ label: 'Origin', names: ['Japanese', 'Chinese', 'Korean', 'Western'] },
		{ label: 'Quality', names: ['HD', 'VR', '4K'] },
	];

	const sections = $derived(
		SECTION_DEFS.map(s => ({
			label: s.label,
			cats: categories.filter(c => s.names.includes(c.name))
		})).filter(s => s.cats.length > 0)
	);

	function navigateTo(slug: string) {
		menuOpen = false;
		goto(slug);
	}
</script>

<!-- Backdrop when menu is open -->
{#if menuOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="md:hidden fixed inset-0 z-[48]"
		style="background:rgba(0,0,0,0.6);"
		onclick={() => (menuOpen = false)}
		role="presentation"
	></div>
{/if}

<!-- Categories slide-up sheet -->
<div
	class="md:hidden fixed left-0 right-0 z-[49] rounded-t-2xl transition-transform duration-300 ease-out"
	style="bottom:56px; background:#16161a; border-top:1px solid #2a2a34; max-height:70vh; transform:{menuOpen ? 'translateY(0)' : 'translateY(100%)'};"
>
	<!-- Handle -->
	<div class="flex justify-center pt-3 pb-1">
		<div class="h-1 w-10 rounded-full" style="background:#3a3a48;"></div>
	</div>

	<!-- Header -->
	<div class="flex items-center justify-between px-4 py-2">
		<span class="text-xs font-bold tracking-widest uppercase" style="color:#50506a;">Browse Categories</span>
		<button onclick={() => (menuOpen = false)} class="rounded-lg p-1.5 transition-colors" style="color:#8080a0;" aria-label="Close">
			<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
			</svg>
		</button>
	</div>

	<!-- Scrollable category grid -->
	<div class="scrollbar-hide overflow-y-auto px-4 pb-4" style="max-height:calc(70vh - 80px);">
		{#each sections as section (section.label)}
			<div class="mb-4">
				<p class="mb-2 text-[10px] font-bold tracking-widest uppercase" style="color:#50506a;">{section.label}</p>
				<div class="grid grid-cols-3 gap-2">
					{#each section.cats as cat (cat.id)}
						<button
							onclick={() => navigateTo(cat.slug)}
							class="rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition-all active:scale-95"
							style="background:#1e1e24; color:#c0c0d0; border:1px solid #2a2a34;"
							onmouseenter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor='#6d28d9'; el.style.color='#a78bfa'; }}
							onmouseleave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor='#2a2a34'; el.style.color='#c0c0d0'; }}
						>
							{cat.name}
						</button>
					{/each}
				</div>
			</div>
		{/each}

		<!-- Quick links at the bottom -->
		<div class="mt-2 flex gap-2 border-t pt-3" style="border-color:#2a2a34;">
			<a href="/browse/trending" onclick={() => (menuOpen = false)}
				class="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold text-white transition-colors"
				style="background:#6d28d9;">
				Trending
			</a>
			<a href="/browse/new" onclick={() => (menuOpen = false)}
				class="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition-colors"
				style="background:#1e1e24; border:1px solid #2a2a34; color:#c0c0d0;">
				New Releases
			</a>
		</div>
	</div>
</div>

<!-- Bottom navigation bar -->
<nav
	class="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-stretch"
	style="background:#16161a; border-top:1px solid #2a2a34; height:56px;"
	aria-label="Mobile navigation"
>
	{#each navItems as item (item.href)}
		{@const active = isActive(item.href)}
		<a
			href={item.href}
			class="relative flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors duration-150"
			style="color:{active ? '#a78bfa' : '#50506a'};"
			aria-current={active ? 'page' : undefined}
		>
			{#if active}
				<span class="absolute top-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-b-full" style="background:#7c3aed;"></span>
			{/if}
			<svg class="h-5 w-5 shrink-0 transition-transform duration-150 {active ? 'scale-110' : ''}"
				fill="none" stroke="currentColor" stroke-width={active ? '2.25' : '1.75'} viewBox="0 0 24 24" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" d={item.icon}/>
			</svg>
			<span class="text-[9px] font-semibold leading-none tracking-tight">{item.label}</span>
		</a>
	{/each}

	<!-- Burger / Menu tab -->
	<button
		onclick={() => (menuOpen = !menuOpen)}
		class="relative flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors duration-150"
		style="color:{menuOpen ? '#a78bfa' : '#50506a'}; background:none; border:none;"
		aria-label="Browse categories"
		aria-expanded={menuOpen}
	>
		{#if menuOpen}
			<span class="absolute top-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-b-full" style="background:#7c3aed;"></span>
		{/if}
		<!-- Animated burger → X -->
		<div class="flex h-5 w-5 flex-col items-center justify-center gap-1 transition-all duration-200">
			<span class="block h-0.5 w-4 rounded-full transition-all duration-200 origin-center"
				style="background:currentColor; transform:{menuOpen ? 'translateY(6px) rotate(45deg)' : 'none'};"></span>
			<span class="block h-0.5 w-4 rounded-full transition-all duration-200"
				style="background:currentColor; opacity:{menuOpen ? '0' : '1'};"></span>
			<span class="block h-0.5 w-4 rounded-full transition-all duration-200 origin-center"
				style="background:currentColor; transform:{menuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none'};"></span>
		</div>
		<span class="text-[9px] font-semibold leading-none tracking-tight">{menuOpen ? 'Close' : 'More'}</span>
	</button>
</nav>
